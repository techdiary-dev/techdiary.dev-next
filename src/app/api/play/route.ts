import { headers } from "next/headers";
import { NextResponse, userAgent } from "next/server";

export async function GET(request: Request) {
  const _headers = await headers();
  return NextResponse.json({
    nextUA: userAgent(request),
    requestUA: _headers.get("user-agent"),
    forwarded: request.headers.get("x-forwarded-for"),
    realIp: request.headers.get("x-real-ip"),
  });
}
