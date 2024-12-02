import User from "@/components/models/user";
import connectDB from "@/components/common/mongodb";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer, { TransportOptions } from "nodemailer";
import { AuthenticationType } from "nodemailer/lib/smtp-connection";

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }
  const { email } = await req.json();
  connectDB();
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return new NextResponse("Email doesn't exist.", { status: 400 });
  }
  const GenerateOTP = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  existingUser.resetOTP = GenerateOTP;
  await existingUser.save();
  console.log("existingUser.save()", existingUser.save());
  const resetToken = crypto.randomBytes(6).toString("hex"); // Generate a 6-digit OTP
  const resetURL = `localhost:3000/reset-password/${resetToken}`;
  console.log("resetURL", resetURL);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SES_EMAIL_SERVER_HOST as string,
      port: process.env.SES_EMAIL_SERVER_PORT as string,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SES_EMAIL_SERVER_USER, // replace with your email address
        pass: process.env.SES_EMAIL_SERVER_PASSWORD, // replace with your email password or application-specific password
      } as AuthenticationType,
    } as TransportOptions);

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.SES_FROM_EMAIL}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
      <p style="font-size: 24px; color: black; font-weight: bold;">Let's Reset your Password</p>
      <p style="color: black;">Use this code for Reset your password. <br> This OTP will expire in 2 minutes.</p>
      <p style="font-size: 22px;"> <strong>
      ${GenerateOTP.split("")
        .map((digit, index) => {
          return index === GenerateOTP.length - 1
            ? digit
            : digit + "&nbsp;" + "&nbsp;" + "&nbsp;" + "&nbsp;";
        })
        .join("")}
    </strong></p>
      <p style="font-size: 16px;">Thank you.</p>
    </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully!");
  } catch (error) {
    console.error("Error sending reset email:", error);
    return new NextResponse("Error sending reset email.", { status: 500 });
  }
  return NextResponse.json(existingUser);
}

export { handler as POST };
