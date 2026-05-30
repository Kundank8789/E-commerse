import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// GET current admin user
export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    
    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    
    return NextResponse.json({ success: true, user });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE current admin user
export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    const { name, phone, address } = await req.json();
    
    await connectDB();
    
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { name, phone, address },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, user });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}