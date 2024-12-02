import OurVehicleModel from "@/components/models/vehicles";
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
  const Vehicles = await OurVehicleModel.find();
  console.log("Vehicles", Vehicles);
  return NextResponse.json(Vehicles);
}
export { handler as POST };
