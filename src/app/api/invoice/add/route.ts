import connectDB from "@/components/common/mongodb";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import InvoiceModel from "@/components/models/invoice";

interface Address {
  country: string;
  state: string;
  city: string;
  zipcode: number;
  address1: string;
  address2: string;
}

interface Service {
  title: string;
  serialNo: string;
  hsnSac: string;
  quantity: number;
  amount: number;
  gst: number;
}

interface ourInvoice {
  invoiceID: string;
  customerName: string;
  mobileNumber: string;
  invoiceDate: Date | null;
  address: Address;
  vehicleCompany: string;
  vehicleVariant: string;
  vehicleNo: string;
  kilometers: number;
  nextkilometer: number;
  services: Service[];
  createdBy?: string;
  createdOn?: Date;
  updatedBy?: string;
  updatedOn?: Date;
}

const ourInvoiceSchema = Joi.object({
  customerName: Joi.string().required(),
  mobileNumber: Joi.string().required(),
  invoiceDate: Joi.date().optional().allow(null),
  address: Joi.object({
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    zipcode: Joi.number().required().min(0),
    address1: Joi.string().required(),
    address2: Joi.string().optional(),
  }).required(),
  vehicleCompany: Joi.string().required(),
  vehicleVariant: Joi.string().required(),
  vehicleNo: Joi.string().required(),
  kilometers: Joi.number().required().min(0),
  nextkilometer: Joi.number().required().min(0),
  services: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        serialNo: Joi.string().required(),
        hsnSac: Joi.string().required(),
        quantity: Joi.number().required().min(0),
        amount: Joi.number().required().min(0),
        gst: Joi.number().required().min(0),
      })
    )
    .required(),
  note: Joi.string().required(),
  createdBy: Joi.string(),
  createdOn: Joi.date().optional(),
  updatedBy: Joi.string(),
  updatedOn: Joi.date().optional(),
});

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    const { error } = ourInvoiceSchema.validate(req.body);
    if (error) {
      return new NextResponse(null, {
        status: 400,
        statusText: error.details[0].message,
      });
    }
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }

  try {
    const requestBody = await req.text();
    if (!requestBody) {
      throw new Error("Empty request body");
    }
    connectDB();
    const Invoices = await InvoiceModel.find();
    const newItemData = await JSON.parse(requestBody);
    const invoiceIDPrefix = process.env.NEXT_PUBLIC_INVOICE_DIGITS || "";
    /* const invoiceID = (Invoices.length + 1 + +invoiceIDPrefix)
      .toString()
      .slice(1); */
    const newInvoice: ourInvoice = await InvoiceModel.create({
      invoiceID: Invoices.length + 1,
      customerName: newItemData.customerName || "",
      mobileNumber: newItemData.mobileNumber || "",
      invoiceDate: newItemData.invoiceDate || null,
      address: newItemData.address || ({} as Address),
      vehicleCompany: newItemData.vehicleCompany || "",
      vehicleVariant: newItemData.vehicleVariant || "",
      vehicleNo: newItemData.vehicleNo || "",
      kilometers: newItemData.kilometers || 0,
      nextkilometer: newItemData.nextkilometer || 0,
      services: newItemData.services || [],
      createdBy: newItemData.createdBy,
      createdOn: newItemData.createdOn,
      updatedBy: newItemData.updatedBy,
      updatedOn: newItemData.updatedOn,
    });
    console.log("newInvoice", newInvoice);
    return NextResponse.json(newInvoice);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new NextResponse(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }
}
export { handler as POST };
