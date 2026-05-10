// app/api/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  cookieStore.set("token", "", {
    httpOnly: true,  // ✅ matches your login
    path: "/",       // ✅ matches your login
    maxAge: 0,       // ✅ expire immediately
  });

  return NextResponse.json({ success: true, message: "Logged out" });
}