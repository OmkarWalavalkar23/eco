// app/api/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "../../../shared/mongodb";
import nodemailer from "nodemailer";

const { EMAIL, PASSWORD_APP_EMAIL } = process.env;

export async function POST(req) {
  try {
    const { email, password } = await req.json(); // Removed username field

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    // List of valid emails
    const validEmails = [
      "nishant@4necotech.in",
      "pratima.singh@4necotech.in",
      "amar.naik@4necotech.in",
      "ajay.j@4necotech.in",
      "komal@4necotech.in",
      "prakhar@4necotech.in",
      "satya@4necotech.in",
      "aditya@4necotech.in",
      "alan@4necotech.in",
      "abhishek@4necotech.in",
      "venkat@4necotech.in",
      "omakar@4necotech.in",
      "saravanan@4necotech.in",
    ];

    if (!validEmails.includes(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Email.",
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const userExists = await usersCollection.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };
    await usersCollection.insertOne(newUser);

    // Send a welcome email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD_APP_EMAIL,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Welcome to 4n.eco, ${email}!`,
      text: `Hi ${email},

We're glad to welcome you to 4n.eco, the world's most Sustainable URL shortener & QR Code Generator!

Thank you for registering with 4n.eco. We're excited to have you on board and empower you to URL shortening, create custom shortened URLs, generate QR codes for your weblinks, customize QR codes with your logos and images, and track your environmental impact. You have made a sustainable choice!

Your account is now active!

To get started, you can:
- Log in to the app using the email address (${email}) you used to register.

Here are some helpful resources to get you acquainted with 4n.eco:
- A quick guide to the app: https://4n.eco/QuickStart
- FAQs: https://4n.eco/FAQ
- Contact us: https://4n.eco/contact

We're always looking for ways to improve, so if you have any questions or feedback, please don't hesitate to reach out. Welcome aboard, and let's work together for a more sustainable future!

Sincerely,
The 4n.eco Team

P.S. Follow us on social media for the latest updates and tips!
- Facebook: https://www.facebook.com/profile.php?id=61564581987548
- Instagram: https://www.instagram.com/4necotech
- LinkedIn: https://www.linkedin.com/company/4necotech/
- X: https://x.com/4necotech/`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Registration successful!",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
