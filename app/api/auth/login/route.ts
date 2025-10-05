import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Login Request Started ===');
    
    // Parse request body
    const body = await request.json();
    const { username, password } = body;
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      console.log('Missing credentials');
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not configured');
      return NextResponse.json(
        { success: false, message: 'Database configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.SESSION_SECRET) {
      console.error('SESSION_SECRET not configured');
      return NextResponse.json(
        { success: false, message: 'Session configuration error' },
        { status: 500 }
      );
    }

    // Connect to database
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected');

    // Find user
    console.log('Searching for user...');
    let user = await User.findOne({ username });
    console.log('User found:', !!user);

    // Create default admin user if doesn't exist
    if (!user && username === 'admin') {
      console.log('Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = await User.create({
        username: 'admin',
        password: hashedPassword,
      });
      console.log('Admin user created');
    }

    if (!user) {
      console.log('Invalid username');
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
      console.log('Invalid password');
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
    console.log('Session saved');

    console.log('=== Login Successful ===');
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: { username: user.username },
    });
  } catch (error) {
    console.error('=== Login Error ===');
    console.error('Error:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}