import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/components/common/mongodb";
import mongoose from "mongoose";
import User, { IUser } from "@/components/models/user";

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "PUT") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }
  try {
    const body = await req.text();

    // Parse the raw body as JSON
    const newItemData = JSON.parse(body);
    newItemData.email = decodeURIComponent(newItemData.email);
    console.log("newItemData", newItemData);

    connectDB();
    const user = await User.findOne({ email: newItemData.email });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Compare passwords
    const hashedPassword = await bcrypt.hash(newItemData.password || "", 10);

    const set = {
      password: hashedPassword,
    };
    const updatepassword = await User.updateOne(
      { email: newItemData.email },
      {
        $set: set,
      }
    );

    if (updatepassword) {
      return new NextResponse("Password Reset successfully");
    } else {
      return new NextResponse("Failed to reset password", { status: 500 });
    }
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export { handler as PUT };
