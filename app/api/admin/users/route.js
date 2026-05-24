import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET all users - Admin only
export async function GET(req) {
  try {
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    
    return NextResponse.json(users);
    
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE user - Admin only
export async function DELETE(req) {
  try {
    await connectDB();
    
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    
    await User.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, message: "User deleted" });
    
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}