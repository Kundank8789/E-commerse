"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {

        toast.success("Account created successfully 🎉");

        setForm({
          name: "",
          email: "",
          password: "",
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);

      } else {

        toast.error(data.error || "Registration failed");

      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* LOGO / BRAND */}
        <div className="text-center mb-6">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
            <ShoppingBag size={28} />
          </div>

          <h1 className="text-3xl font-bold mt-5 text-black">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Create your account to continue shopping
          </p>

        </div>

        {/* CARD */}
        <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-2xl border border-gray-300 
                bg-gray-50 outline-none focus:ring-2 focus:ring-black 
                focus:bg-white transition-all duration-300"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full mt-2 px-4 py-3 rounded-2xl border border-gray-300 
                bg-gray-50 outline-none focus:ring-2 focus:ring-black 
                focus:bg-white transition-all duration-300"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative mt-2">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create strong password"
                  required
                  value={form.password}
                  minLength={6}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 
                  bg-gray-50 outline-none focus:ring-2 focus:ring-black 
                  focus:bg-white transition-all duration-300 pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>
            </div>

            {/* TERMS */}
            <div className="flex items-start gap-2 text-sm text-gray-500">

              <input
                type="checkbox"
                required
                className="mt-1 accent-black"
              />

              <p>
                I agree to the{" "}
                <span className="text-black font-medium cursor-pointer hover:underline">
                  Terms & Conditions
                </span>
              </p>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-2xl font-semibold 
              hover:bg-gray-800 transition-all duration-300 
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-sm text-gray-400">OR</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            
            className="w-full border border-gray-300 py-3 rounded-2xl 
            font-medium hover:bg-gray-50 transition"
          >
            Continue with Google
          </button>

          {/* LOGIN */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-black font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>
    </section>
  );
}



