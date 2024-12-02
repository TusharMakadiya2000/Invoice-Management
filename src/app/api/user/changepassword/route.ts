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
    const { password }: IUser = JSON.parse(body);
    const newItemData = JSON.parse(body);
    connectDB();
    const user = await User.findOne({ _id: newItemData.userId });
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Compare passwords
    const passwordsMatched = await bcrypt.compare(
      newItemData.currentPassword,
      user.password
    );

    if (!passwordsMatched) {
      return new NextResponse("Current password is incorrect", { status: 400 });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newItemData.password, saltRounds);
    // Update user password
    const set = {
      password: hashedPassword,
    };
    const updatepassword = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(newItemData.userId) },
      {
        $set: set,
      }
    );

    if (updatepassword.matchedCount === 1) {
      return new NextResponse("Password updated successfully");
    } else {
      return new NextResponse("Failed to update password", { status: 500 });
    }
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export { handler as PUT };
