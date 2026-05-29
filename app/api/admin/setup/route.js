import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// This endpoint should be removed after first use
export async function POST(req) {
  try {
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin already exists", 
        admin: { email: existingAdmin.email } 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Create admin user
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      phone: "9999999999",
      address: "Admin Office",
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Admin created successfully",
      credentials: {
        email: "admin@gmail.com",
        password: "admin123"
      }
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}