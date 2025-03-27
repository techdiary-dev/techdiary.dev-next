import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-url", request.url);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
