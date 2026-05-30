"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Public routes that don't require authentication
  const publicRoutes = ["/admin/login", "/admin/register"];

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    // Allow access to public routes without auth check
    if (publicRoutes.includes(pathname)) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/check", { 
        credentials: "include" 
      });
      
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  // Show login/register pages without sidebar
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Admin layout with sidebar (only when authenticated)
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-black border-r border-white/10 p-6">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="flex flex-col gap-4 text-gray-400">
          <Link href="/admin" className="hover:text-yellow-500 transition">Dashboard</Link>
          <Link href="/admin/products" className="hover:text-yellow-500 transition">Products</Link>
          <Link href="/admin/categories" className="hover:text-yellow-500 transition">Categories</Link>
          <Link href="/admin/orders" className="hover:text-yellow-500 transition">Orders</Link>
          <Link href="/admin/users" className="hover:text-yellow-500 transition">Users</Link>
          <button
            onClick={handleLogout}
            className="text-left text-red-400 hover:text-red-300 transition mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 bg-[#0f1b3d]">
        {children}
      </main>
    </div>
  );
}