// app/api/contact/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const { EMAIL, PASSWORD_APP_EMAIL } = process.env;

export async function POST(req) {
  const { name, mail, phoneNumber, country, city, query } = await req.json();
  
//   console.log({ name, email, phone, message, country, city });

  try {
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD_APP_EMAIL,
      },
    });

    let mailOptions = {
      from: mail,
      to: EMAIL,
      subject: "New Contact Form Submission",
      text: `
        Name: ${name}
        Email: ${mail}
        Phone: ${phoneNumber}
        Country: ${country}
        City: ${city}
        Message: ${query}
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "Form submitted successfully." }, { status: 200 });
  } catch (error) {
    // console.error("Error sending email:", error.message);
    return NextResponse.json({ message: "Failed to submit form." }, { status: 500 });
  }
}
