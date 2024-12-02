import connectDB from "@/components/common/mongodb";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import OurVehicleModel from "@/components/models/vehicles";

interface Vehicle {
  userId: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleType: string;
  ownerName: string;
  mobileNumber: string;
}

let items: Vehicle[] = []; // This array will act as an in-memory database

const vehicleSchema = Joi.object({
  userId: Joi.string().required(),
  vehicleName: Joi.string().required(),
  vehicleNumber: Joi.string().required(),
  vehicleType: Joi.string().required(),
  ownerName: Joi.string().required(),
  mobileNumber: Joi.string()
    .required()
    .pattern(/^\d{10}$/) // Ensure it contains exactly 10 digits
    .messages({
      "string.pattern.base": "Mobile Number must contain exactly 10 digits",
    }),
});

async function handler(req: NextRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    const { error } = vehicleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }
  connectDB();
  try {
    const requestBody = await req.text();
    if (!requestBody) {
      throw new Error("Empty request body");
    }

    const newItemData: Vehicle = await JSON.parse(requestBody);

    const newVehicle: Vehicle = await OurVehicleModel.create({
      userId: newItemData.userId || "",
      vehicleName: newItemData.vehicleName || "",
      vehicleNumber: newItemData.vehicleNumber || "",
      vehicleType: newItemData.vehicleType || "",
      ownerName: newItemData.ownerName || "",
      mobileNumber: newItemData.mobileNumber || "",
    });
    items.push(newVehicle);
    return NextResponse.json(newVehicle);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }
}
export { handler as POST };
