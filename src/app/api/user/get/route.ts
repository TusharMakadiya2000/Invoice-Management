import User from "@/components/models/user";
import connectDB from "@/components/common/mongodb";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }
  connectDB();
  const items = await User.find();
  return NextResponse.json(items);
}
export { handler as POST };
