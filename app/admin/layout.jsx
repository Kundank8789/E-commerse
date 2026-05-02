export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* 🔥 SIDEBAR */}
      <aside className="w-64 bg-black border-r border-white/10 p-6">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <nav className="flex flex-col gap-4 text-gray-400">
          <a href="/admin">Dashboard</a>
          <a href="/admin/products">Products</a>
          <a href="/admin/categories">Categories</a>
          <a href="/admin/orders">Orders</a>
          <a href="/admin/users">Users</a>
        </nav>
      </aside>

      {/* 🔥 MAIN CONTENT */}
      <main className="flex-1 p-10 bg-[#0f1b3d]">
        {children}
      </main>

    </div>
  );
}