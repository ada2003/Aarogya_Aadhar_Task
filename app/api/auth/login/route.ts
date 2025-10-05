import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    console.log('Login attempt started');
    
    const body = await request.json();
    console.log('Request body received:', { username: body.username });
    
    const { username, password } = body;

    if (!username || !password) {
      console.log('Missing credentials');
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected');

    // Check if user exists
    console.log('Looking for user:', username);
    let user = await User.findOne({ username });
    console.log('User found:', !!user);

    // For demo: create default admin user if doesn't exist
    if (!user && username === 'admin') {
      console.log('Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = await User.create({
        username: 'admin',
        password: hashedPassword,
      });
      console.log('Default admin user created');
    }

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set session
    console.log('Setting session...');
    const session = await getSession();
    session.userId = user._id.toString();
    session.username = user.username;
    session.isLoggedIn = true;
    await session.save();
    console.log('Session saved successfully');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: { username: user.username },
    });
  } catch (error) {
    console.error('Login error details:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}