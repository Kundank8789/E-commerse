"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ add useSearchParams
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();                    // ✅ read URL params
  const redirectTo = searchParams.get("redirect") || "/";   // ✅ get ?redirect=

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful 🎉");
        setTimeout(() => {
          router.push(redirectTo); // ✅ was: router.push("/login?redirect=/checkout")
        }, 1500);
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-3xl p-8">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
            <ShoppingBag size={28} />
          </div>
        </div>

        {/* HEADING */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-sm">Login to continue shopping</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 
              outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                minLength={6}
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 
                outline-none focus:ring-2 focus:ring-black transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-black transition">
              Forgot Password?
            </Link>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold 
            hover:bg-gray-800 transition-all duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button type="button" className="w-full border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
          Continue with Google
        </button>

        {/* REGISTER LINK */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register?redirect=/checkout" // ✅ was: href="/register"
            className="text-black font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </section>
  );
}