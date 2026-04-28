import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    // 🔐 NO TOKEN
    if (!token) {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: "Token expired or invalid" },
        { status: 401 }
      );
    }

    // 👤 GET USER
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}