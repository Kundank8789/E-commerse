export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

        <ul className="space-y-3">
          <li>Products</li>
          <li>Orders</li>
          <li>Users</li>
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-neutral-900 text-white">
        {children}
      </main>
    </div>
  );
}