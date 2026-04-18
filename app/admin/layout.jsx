"use client";

import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}