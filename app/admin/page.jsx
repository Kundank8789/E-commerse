"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    todayOrders: 0,
    thisMonthSales: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
    fetchAdminUser();
  }, []);

  // Fetch logged-in admin user
  const fetchAdminUser = async () => {
    try {
      const res = await fetch("/api/admin/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.user);
        setEditForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching admin user:", error);
    }
  };

  // Update admin profile
  const updateProfile = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.user);
        toast.success("Profile updated successfully!");
        setShowProfileModal(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersRes = await fetch("/api/orders", { credentials: "include" });
      let orders = [];
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        orders = Array.isArray(ordersData) ? ordersData : [];
      }
      
      // Fetch products
      const productsRes = await fetch("/api/products", { credentials: "include" });
      let products = [];
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        products = Array.isArray(productsData) ? productsData : [];
      }
      
      // Fetch users
      let users = [];
      try {
        const usersRes = await fetch("/api/admin/users", { credentials: "include" });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          users = Array.isArray(usersData) ? usersData : [];
        }
      } catch (err) {
        console.log("Users API not available");
      }
      
      // Calculate dashboard metrics
      const totalSales = orders.length > 0 
        ? orders.reduce((sum, order) => sum + (order.total || 0), 0)
        : 0;
      
      const totalOrders = orders.length;
      const totalUsers = users.length;
      const totalProducts = products.length;
      const pendingOrders = orders.filter(o => o.status === "pending").length;
      const lowStockProducts = products.filter(p => p.stock < 10).length;
      
      // Today's orders
      const today = new Date().toDateString();
      const todayOrders = orders.filter(order => 
        new Date(order.createdAt).toDateString() === today
      ).length;
      
      // This month's sales
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonthSales = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === currentMonth && 
                 orderDate.getFullYear() === currentYear;
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      setDashboardData({
        totalSales,
        totalOrders,
        totalUsers,
        totalProducts,
        pendingOrders,
        lowStockProducts,
        todayOrders,
        thisMonthSales,
      });
      
      // Recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
      
      // Top products by sales
      const productSales = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          const productId = item.product?._id;
          if (productId) {
            productSales[productId] = (productSales[productId] || 0) + item.quantity;
          }
        });
      });
      
      const topProductsList = products
        .map(product => ({
          ...product,
          salesCount: productSales[product._id] || 0
        }))
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 5);
      
      setTopProducts(topProductsList);
      setLoading(false);
      
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link, trend, trendValue }) => (
    <Link href={link} className="block">
      <div className={`bg-gray-800 rounded-xl p-6 border-l-4 border-${color}-500 hover:bg-gray-750 transition cursor-pointer`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white">{value?.toLocaleString()}</p>
            {trend && (
              <p className={`text-xs mt-2 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue} from last month
              </p>
            )}
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
      </div>
    </Link>
  );

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400",
    confirmed: "bg-blue-500/20 text-blue-400",
    shipped: "bg-purple-500/20 text-purple-400",
    delivered: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
    rto: "bg-orange-500/20 text-orange-400",
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-400" };
    if (stock < 10) return { text: "Low Stock", color: "text-orange-400" };
    return { text: "In Stock", color: "text-green-400" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <p className="mt-2 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Info and Logout */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your store today.</p>
          </div>
          
          {/* Admin User Info */}
          {adminUser && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-medium">{adminUser.name}</p>
                <p className="text-gray-400 text-sm">{adminUser.email}</p>
                <p className="text-yellow-500 text-xs capitalize">{adminUser.role}</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-yellow-500 text-xl font-bold hover:bg-gray-600 transition"
                >
                  {adminUser.name?.charAt(0).toUpperCase() || "A"}
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard 
            title="Total Sales" 
            value={`₹${dashboardData.totalSales.toLocaleString()}`} 
            icon="💰" 
            color="green"
            link="/admin/orders"
            trend="up"
            trendValue="12%"
          />
          <StatCard 
            title="Total Orders" 
            value={dashboardData.totalOrders} 
            icon="📦" 
            color="blue"
            link="/admin/orders"
          />
          <StatCard 
            title="Total Users" 
            value={dashboardData.totalUsers} 
            icon="👥" 
            color="purple"
            link="/admin/users"
          />
          <StatCard 
            title="Total Products" 
            value={dashboardData.totalProducts} 
            icon="🛍️" 
            color="orange"
            link="/admin/products"
          />
        </div>

        {/* Stats Grid - Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard 
            title="Pending Orders" 
            value={dashboardData.pendingOrders} 
            icon="⏳" 
            color="yellow"
            link="/admin/orders?status=pending"
          />
          <StatCard 
            title="Low Stock Products" 
            value={dashboardData.lowStockProducts} 
            icon="⚠️" 
            color="red"
            link="/admin/products?filter=lowstock"
          />
          <StatCard 
            title="Today's Orders" 
            value={dashboardData.todayOrders} 
            icon="📅" 
            color="indigo"
            link="/admin/orders"
          />
          <StatCard 
            title="This Month's Sales" 
            value={`₹${dashboardData.thisMonthSales.toLocaleString()}`} 
            icon="📊" 
            color="teal"
            link="/admin/orders"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-yellow-400 hover:text-yellow-300">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No orders yet</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {order.address?.name || order.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400">₹{order.total} • {order.items?.length} items</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || statusColors.pending}`}>
                        {order.status || "pending"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Top Selling Products</h2>
              <Link href="/admin/products" className="text-sm text-yellow-400 hover:text-yellow-300">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No sales yet</p>
              ) : (
                topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full text-yellow-400 font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{product.name}</p>
                      <p className="text-xs text-gray-400">₹{product.price} • {product.salesCount} sold</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${getStockStatus(product.stock).color}`}>
                        {getStockStatus(product.stock).text}
                      </p>
                      <p className="text-xs text-gray-400">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <Link href="/admin/products/new">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition flex items-center justify-center gap-2">
                ➕ Add Product
              </button>
            </Link>
            <Link href="/admin/categories">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition flex items-center justify-center gap-2">
                📁 Manage Categories
              </button>
            </Link>
            <Link href="/admin/orders">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition flex items-center justify-center gap-2">
                📦 View Orders
              </button>
            </Link>
            <Link href="/admin/users">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition flex items-center justify-center gap-2">
                👥 Manage Users
              </button>
            </Link>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              🏠 View Store
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter address"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={updateProfile}
                  disabled={updating}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}