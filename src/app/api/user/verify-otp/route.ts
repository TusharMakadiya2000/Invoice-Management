// verify-otp.js

import connectDB from "@/components/common/mongodb";
import User from "@/components/models/user";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }

  const { email, otp } = await req.json();
  console.log("otp", { email, otp });
  try {
    connectDB();
    const existingUser = await User.findOne({ email });

    console.log("existingUser////////////", existingUser);

    if (!existingUser) {
      return new NextResponse("User not found.", { status: 404 });
    }

    if (existingUser.resetOTP === otp) {
      return new NextResponse("OTP is valid.", { status: 200 });
    } else {
      return new NextResponse("Invalid OTP.", { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new NextResponse("Error verifying OTP.", { status: 500 });
  }
}
export { handler as POST };
