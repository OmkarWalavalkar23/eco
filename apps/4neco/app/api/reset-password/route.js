// app/api/reset-password/route.js
import { connectToDatabase } from "../../../shared/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const { JWT_SECRET_KEY, EMAIL, PASSWORD_APP_EMAIL } = process.env;

export async function POST(req) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return new Response(
      JSON.stringify({ message: "Token and new password are required" }),
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const tokenBlacklist = db.collection("tokenBlacklist");

    // Check if the token is blacklisted
    const isBlacklisted = await tokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      return new Response(
        JSON.stringify({ message: "Token is invalid or expired" }),
        { status: 400 }
      );
    }

    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const email = decoded.email;

    const usersCollection = db.collection("users");
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await usersCollection.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Password reset failed" }),
        { status: 500 }
      );
    }

    // Blacklist the token to prevent reuse
    await tokenBlacklist.insertOne({ token, blacklistedAt: new Date() });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD_APP_EMAIL,
      },
    });

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Password Reset Confirmation",
      text: `Hello ${email},

Your password has been successfully reset. You can now log in to your account using your new password.

Thank you,
4n.eco`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "Password reset successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset-password API:", error);
    const message =
      error.name === "TokenExpiredError"
        ? "Token has expired"
        : "Invalid token";

    if (error.name === "TokenExpiredError") {
      const db = await connectToDatabase();
      const tokenBlacklist = db.collection("tokenBlacklist");
      await tokenBlacklist.insertOne({ token, blacklistedAt: new Date() });
    }

    return new Response(JSON.stringify({ message }), { status: 400 });
  }
}
