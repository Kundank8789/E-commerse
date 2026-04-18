"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const menu = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Users", href: "/admin/users" },
  ];

  return (
    <aside className="w-64 bg-black p-6 border-r border-gray-800">
      <h2 className="text-xl font-bold mb-6">Admin</h2>

      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block ${
                path === item.href
                  ? "text-blue-400"
                  : "text-gray-400"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}