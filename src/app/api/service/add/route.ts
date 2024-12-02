import connectDB from "@/components/common/mongodb";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import OurServiceModel from "@/components/models/ourService";

interface ourService {
  userId: string;
  service: string;
  note: string;
  charge: number;
  gst: number;
}

let items: ourService[] = [];

const ourServiceSchema = Joi.object({
  userId: Joi.string().required(),
  service: Joi.string().required(),
  note: Joi.string().required(),
  charge: Joi.number().required().min(0),
  gst: Joi.number().required().min(0),
});

async function handler(req: NextRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    const { error } = ourServiceSchema.validate(req.body);
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

    const newItemData: ourService = await JSON.parse(requestBody);

    const newService: ourService = await OurServiceModel.create({
      userId: newItemData.userId || "",
      service: newItemData.service || "",
      note: newItemData.note || "",
      charge: newItemData.charge || 0,
      gst: newItemData.gst || 0,
    });
    items.push(newService);
    return NextResponse.json(newService);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }
}
export { handler as POST };
