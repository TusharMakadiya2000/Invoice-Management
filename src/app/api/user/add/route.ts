import connectDB from "@/components/common/mongodb";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import bcrypt from "bcrypt";
import User from "@/components/models/user";

interface Item {
  fullName: string;
  businessName: string;
  email: string;
  servieCenterName: string;
  password: string;
  confirmPassword: string;
}

let items: Item[] = []; // This array will act as an in-memory database

const itemSchema = Joi.object({
  fullName: Joi.string().required(),
  businessName: Joi.string().required(),
  email: Joi.string().required(),
  servieCenterName: Joi.string().required(),
  password: Joi.string().required(),
});

async function handler(req: NextRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    const { error } = itemSchema.validate(req.body);
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

    const newItemData: Item = await JSON.parse(requestBody);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newItemData.password, saltRounds);

    const newItem: Item = await User.create({
      fullName: newItemData.fullName || "",
      businessName: newItemData.businessName || "",
      email: newItemData.email || "",
      servieCenterName: newItemData.servieCenterName || "",
      password: hashedPassword,
    });
    items.push(newItem);
    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }
}
export { handler as POST };
