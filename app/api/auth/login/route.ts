import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    let user = await User.findOne({ username });

    // For demo: create default admin user if doesn't exist
    if (!user && username === 'admin') {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = await User.create({
        username: 'admin',
        password: hashedPassword,
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set session
    const session = await getSession();
    session.userId = user._id.toString();
    session.username = user.username;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: { username: user.username },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}