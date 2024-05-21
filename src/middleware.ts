import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const _cookies = cookies().getAll();
    const api = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/me`,
      {
        method: "GET",
        headers: {
          Cookie: _cookies.map((c) => `${c.name}=${c.value}`).join("; "),
          referer: process.env.NEXT_PUBLIC_APP_URL,
          Accept: "application/json",
        } as any,
      }
    );
    const me = await api.json();

    console.log("calling middleware", request.nextUrl.pathname);

    if (me?.status !== 200) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml).*)",
    "/dashboard/:path*",
  ],
};
