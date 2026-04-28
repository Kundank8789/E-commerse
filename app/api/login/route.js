import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 FIXED COOKIE
    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
    });

    return Response.json({ message: "Login successful" });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}