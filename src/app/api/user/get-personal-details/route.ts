import connectDB from "@/components/common/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import User from "@/components/models/user";

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "GET") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }

  const authToken = await getToken({ req: req });
  if (!authToken) {
    throw new Error("Authentication Error");
    return;
  }
  connectDB();

  const user = await User.findOne({ email: authToken.email });
  const userItem = JSON.parse(JSON.stringify(user));
  delete userItem.password;
  return NextResponse.json(userItem);
}
export { handler as GET };
