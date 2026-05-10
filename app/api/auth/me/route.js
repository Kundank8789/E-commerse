// app/api/auth/me/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers"; // ✅ keep this

export async function GET() { // ✅ remove req — not needed
  try {
    await connectDB();

    // ✅ CORRECT WAY to read cookies in App Router
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // NO TOKEN
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // VERIFY TOKEN
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // FIND USER
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}