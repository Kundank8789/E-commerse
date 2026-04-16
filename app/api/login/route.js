import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // 🔍 Check user
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // 🔥 Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Set cookie
    const response = Response.json({ message: "Login successful ✅" });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // true in production
      path: "/",
    });

    return response;

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}