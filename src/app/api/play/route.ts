import { slugify } from "@/lib/slug-helper.util";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // const _headers = await headers();
  return NextResponse.json({
    slug: slugify("কেমন আছেন আপনারা?"),
  });
}
