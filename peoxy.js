import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // ✅ Helper to redirect to login WITH redirect param
  const redirectToLogin = () => {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname); // ✅ e.g. /login?redirect=/checkout
    return NextResponse.redirect(loginUrl);
  };

  // NO TOKEN
  if (!token) {
    return redirectToLogin(); // ✅ was: new URL("/login", req.url)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ADMIN PROTECTION
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();

  } catch (error) {
    return redirectToLogin(); // ✅ was: new URL("/login", req.url)
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout",
    "/account/:path*",
  ],
};