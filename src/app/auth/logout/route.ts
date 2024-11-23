import { deleteSession } from "@/lib/sessions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  await deleteSession();
  return NextResponse.redirect(new URL("/logout", req.nextUrl));
};
