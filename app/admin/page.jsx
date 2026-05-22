"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersRes = await fetch("/api/orders", { credentials: "include" });
      const orders = await ordersRes.json();
      
      // Fetch products
      const productsRes = await fetch("/api/products", { credentials: "include" });
      const products = await productsRes.json();
      
      // Fetch users
      const usersRes = await fetch("/api/users", { credentials: "include" });
      const users = await usersRes.json();
      
      // Calculate dashboard metrics
      const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your store today.</p>
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
    </div>
  );
}