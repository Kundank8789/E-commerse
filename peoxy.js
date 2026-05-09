import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // NO TOKEN
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  try {
    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const pathname = req.nextUrl.pathname;

    // ADMIN PROTECTION
    if (
      pathname.startsWith("/admin") &&
      decoded.role !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }

    return NextResponse.next();

  } catch (error) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout",
    "/account/:path*",
  ],
};