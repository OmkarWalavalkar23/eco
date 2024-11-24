// app/api/forgot-password/route.js
import { connectToDatabase } from '../../../shared/mongodb';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const { JWT_SECRET_KEY, EMAIL, PASSWORD_APP_EMAIL, NEXT_PUBLIC_SERVER_URL } = process.env;

export async function POST(req) {
  const { email } = await req.json();
  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'No user found with this email' }), { status: 404 });
    }

    const resetToken = jwt.sign({ email: user.email }, JWT_SECRET_KEY, { expiresIn: '1h' });
    const resetUrl = `${NEXT_PUBLIC_SERVER_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASSWORD_APP_EMAIL,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>To reset your password, click the link below:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'Password reset link sent' }), { status: 200 });
  } catch (error) {
    console.error('Error in forgot-password API:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
