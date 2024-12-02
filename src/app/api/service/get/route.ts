import OurServiceModel from "@/components/models/ourService";
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
  const Services = await OurServiceModel.find();
  return NextResponse.json(Services);
}
export { handler as POST };
