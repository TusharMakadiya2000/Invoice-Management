import InvoiceModel from "@/components/models/invoice";
import connectDB from "@/components/common/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { JWT, getToken } from "next-auth/jwt";
import { checkAuthFn } from "../../utils/commonFn";
import User from "@/components/models/user";

interface Ibody {
  page: number;
  recordPerPage: number;
  searchText?: string;
  sort: string;
  sortDirection: any;
}

async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "POST") {
    return new NextResponse(null, {
      status: 405,
      statusText: "Method not allowed",
    });
  }
  const authToken: JWT | null = await checkAuthFn(req, res);
  connectDB();

  const user = await User.findOne({ email: authToken?.email });

  const bodyData = await req.text();
  const body = (await JSON.parse(bodyData)) as Ibody;
  let match: any = { $and: [{ status: { $ne: "deleted" } }] };
  if (user.role !== "SA") {
    match["$and"].push({ createdBy: user._id });
  }

  if (body.searchText) {
    match = {
      ...match,
      $or: [{ customerName: { $regex: body.searchText, $options: "i" } }],
    };
  }
  const items = await InvoiceModel.aggregate([
    {
      $match: match,
    },
    {
      $sort: { [body.sort]: body.sortDirection },
    },
    {
      $skip: (body.page - 1) * body.recordPerPage,
    },

    {
      $limit: body.recordPerPage,
    },
  ]);
  const count = await InvoiceModel.aggregate([
    {
      $match: match,
    },
  ]);
  return NextResponse.json({ items, count: count.length });
}
export { handler as POST };
