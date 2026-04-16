import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();

  const existing = await User.findOne({ email: "admin@gmail.com" });

  if (existing) {
    return Response.json({ message: "Admin already exists" });
  }

  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    email: "admin@gmail.com",
    password: hashed,
  });

  return Response.json({ message: "Admin created ✅" });
}