import { getToken, JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const checkAuthFn = async (req: NextRequest, res: NextResponse) => {
  try {
    const authToken: JWT | null = await getToken({ req: req });
    if (!authToken) {
      NextResponse.json({ message: "Not authenticated!" });
      return null;
    }
    return authToken;
  } catch (error) {
    console.error("Authentication Error:", error);
    NextResponse.json({ message: "Internal Server Error" });
    return null;
  }
};
