import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();
    
    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    // Check if admin
    if (decoded.role !== "admin" && decoded.email !== "admin@gmail.com") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    // Get all users
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    
    return NextResponse.json(users);
    
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}