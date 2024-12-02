// updateItem.ts
import OurVehicleModel, { vehicles } from "@/components/models/vehicles";
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
    const {
      vehicleName,
      vehicleNumber,
      vehicleType,
      ownerName,
      mobileNumber,
    }: vehicles = JSON.parse(body);

    connectDB();

    const set = {
      vehicleName: vehicleName,
      vehicleNumber: vehicleNumber,
      vehicleType: vehicleType,
      ownerName: ownerName,
      mobileNumber: mobileNumber,
    };
    const updatedVehicle = await OurVehicleModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: set,
      }
    );
    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error("Error updating Vehicle:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export { handler as PUT };
