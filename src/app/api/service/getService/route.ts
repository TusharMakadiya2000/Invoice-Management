import OurServiceModel from "@/components/models/ourService";
import connectDB from "@/components/common/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "GET") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }
  connectDB();
  const search = new URL(req.url || "").search;
  const urlParams = new URLSearchParams(search);
  const id = urlParams.get("id") || "";

  const service = await OurServiceModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  return NextResponse.json(service);
}
export { handler as GET };
