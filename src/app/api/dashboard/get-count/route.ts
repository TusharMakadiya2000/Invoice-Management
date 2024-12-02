import InvoiceModel from "@/components/models/invoice";
import connectDB from "@/components/common/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { JWT, getToken } from "next-auth/jwt";
import { checkAuthFn } from "../../utils/commonFn";
import User from "@/components/models/user";

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }
  connectDB(); // This might not be necessary here

  // Removed authentication logic for brevity
  const authToken: JWT | null = await checkAuthFn(req, res);
  if (!authToken) {
    return new NextResponse(null, { status: 401, statusText: "Unauthorized" });
  }

  // Fetch user details
  const user = await User.findOne({ email: authToken.email });

  const match: any = { $and: [{ status: { $ne: "deleted" } }] };
  if (user.role !== "SA") {
    match.createdBy = user._id;
  }
  const count = await InvoiceModel.countDocuments(match); // Use countDocuments to get the count directly

  console.log("count", count);
  return NextResponse.json({ totalInvoice: count }); // Return count in the specified format
}

export { handler as POST };
