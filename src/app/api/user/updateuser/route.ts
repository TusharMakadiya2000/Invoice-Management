// updateItem.ts
import UserDetailModal, { IUser } from "@/components/models/user";
import connectDB from "@/components/common/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "PUT") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }
  try {
    const search = new URL(req.url || "").search;
    const urlParams = new URLSearchParams(search);
    const id = urlParams.get("id");

    if (!id) {
      return new NextResponse(null, {
        statusText: "ID parameter is missing",
        status: 400,
      });
    }

    const body = await req.text();
    const { fullName, businessName, email }: IUser = JSON.parse(body);

    connectDB();

    const set = {
      fullName: fullName,
      businessName: businessName,
      email: email,
    };
    const updatedUser = await UserDetailModal.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: set,
      }
    );
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating UserDetail:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export { handler as PUT };
