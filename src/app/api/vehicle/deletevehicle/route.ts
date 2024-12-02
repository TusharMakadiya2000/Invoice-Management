import OurVehicleModel from "@/components/models/vehicles";
import connectDB from "@/components/common/mongodb";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "DELETE") {
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
    console.log("Connecting to the database...");
    connectDB();
    console.log("Connected to the database.");
    const deletedVehicle = await OurVehicleModel.findByIdAndDelete(id);
    if (!deletedVehicle) {
      return NextResponse.json({ message: "Vehicles not found" });
    }

    return NextResponse.json({ message: "Vehicles deleted successfully" });
  } catch (error) {
    console.error("Error deleting Vehicles:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
export { handler as DELETE };
