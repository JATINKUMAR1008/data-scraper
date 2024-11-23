import { handleGoogleCallback } from "@/app/(auth)/signin/action";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  console.log(req.referrer);
  const searchParams = new URLSearchParams(req.nextUrl.search);
  console.log(searchParams);
  const userType = await handleGoogleCallback(searchParams);
  if (userType.isNew) {
    return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL + "/welcome");
  }
  return NextResponse.redirect(process.env.NEXT_PUBLIC_APP_URL + "/");
};
