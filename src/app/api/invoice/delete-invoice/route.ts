import InvoiceModal from "@/components/models/invoice";
import connectDB from "@/components/common/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

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
    const invoice = await InvoiceModal.findById(id);
    if (!invoice) {
      return NextResponse.json({ message: "Invoice not found" });
    }
    await InvoiceModal.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: { status: "deleted" },
      }
    );

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting Invoice:", error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
export { handler as DELETE };
