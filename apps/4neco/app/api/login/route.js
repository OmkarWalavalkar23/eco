import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../../shared/mongodb';
import CryptoJS from 'crypto-js';

const { JWT_SECRET_KEY, ENCRYPTION_KEY } = process.env;

export async function POST(req) {
  try {
    const { email, password: encryptedPassword } = await req.json();

    const decryptedPassword = CryptoJS.AES.decrypt(
      encryptedPassword,
      ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      decryptedPassword,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      email: user.email,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
