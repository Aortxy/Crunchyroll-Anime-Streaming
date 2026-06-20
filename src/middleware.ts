import { NextRequest, NextResponse } from "next/server";

import { getClientIP } from "./lib/utils";
import { ipAddress, geolocation } from "@vercel/functions";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const ip = ipAddress(request);
    const geo = geolocation(request);

    const headers = new Headers(request.headers);
    headers.set("x-client-ip", ip ?? getClientIP(headers));
    headers.set("x-client-geo-country", geo.country ?? "GLOBAL");

    return NextResponse.next({ request: { headers } });
  }

  const cmsURL = process.env.CMS_SERVER;
  if (request.nextUrl.pathname.startsWith("/series/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (cmsURL && request.nextUrl.pathname.startsWith("/cms")) {
    try {
      const response = await fetch(cmsURL, { method: "HEAD" });
      if (!response.ok)
        return new NextResponse("CMS server is not running.", { status: 503 });
    } catch (error) {
      return new NextResponse("CMS server is not running.", { status: 503 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/cms/:path*"],
};
