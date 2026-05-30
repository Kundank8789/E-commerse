import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user with admin role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "7d" }
    );
    
    // Set cookie and return response
    const response = NextResponse.json({ 
      success: true, 
      message: "Registration successful!",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    
    return response;
    
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}