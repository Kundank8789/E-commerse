import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET all users (Admin only)
export async function GET(req) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    const users = await User.find()
      .select("-password") // Don't return password
      .sort({ createdAt: -1 });
    
    return NextResponse.json(users);
    
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET single user
export async function GET_USER(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}