"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ 
    start: "", 
    end: "", 
    startMonth: "", 
    endMonth: "" 
  });
  const [loading, setLoading] = useState(true);
  const [bulkAction, setBulkAction] = useState(""); // For bulk dropdown

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    rto: 0,
    cod: 0,
    prepaid: 0,
    paid: 0,
    unpaid: 0,
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setOrders([]); return; }
      const ordersData = Array.isArray(data) ? data : [];
      setOrders(ordersData);
      calculateStats(ordersData);
      setLoading(false);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setOrders([]);
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    setLoading(true);
    await fetchOrders();
    setLoading(false);
    toast.success("Orders refreshed");
  };

  const calculateStats = (ordersData) => {
    const newStats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === "pending").length,
      confirmed: ordersData.filter(o => o.status === "confirmed").length,
      shipped: ordersData.filter(o => o.status === "shipped").length,
      delivered: ordersData.filter(o => o.status === "delivered").length,
      cancelled: ordersData.filter(o => o.status === "cancelled").length,
      rto: ordersData.filter(o => o.status === "rto").length,
      cod: ordersData.filter(o => o.paymentMethod === "cod").length,
      prepaid: ordersData.filter(o => o.paymentMethod === "razorpay").length,
      paid: ordersData.filter(o => o.paymentStatus === "paid").length,
      unpaid: ordersData.filter(o => o.paymentStatus !== "paid").length,
    };
    setStats(newStats);
  };

  const updateStatus = async (id, status) => {
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
      fetchOrders();
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) {
        toast.success(`Payment status updated to ${paymentStatus}`);
        fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to update payment status");
    }
  };

  // ✅ BULK ACTION - Apply selected status to all selected orders
  const applyBulkAction = async () => {
    if (selectedOrders.length === 0) {
      toast.error("No orders selected");
      return;
    }
    
    if (!bulkAction) {
      toast.error("Please select an action");
      return;
    }
    
    toast.loading(`Applying ${bulkAction} to ${selectedOrders.length} orders...`);
    
    for (const id of selectedOrders) {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: bulkAction }),
      });
    }
    
    toast.dismiss();
    toast.success(`${selectedOrders.length} orders updated to ${bulkAction}!`);
    setSelectedOrders([]);
    setSelectAll(false);
    setBulkAction("");
    fetchOrders();
  };

  // Select all orders
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map(o => o._id));
    }
    setSelectAll(!selectAll);
  };

  // Handle single order selection
  const handleSelectOrder = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(o => o !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  // Download orders as CSV
  const downloadOrdersCSV = () => {
    const headers = ["Order ID", "Date", "Customer", "Mobile", "Total", "Payment Method", "Payment Status", "Status", "Items"];
    const rows = filteredOrders.map(order => [
      order._id.slice(-8),
      new Date(order.createdAt).toLocaleDateString(),
      order.address?.name || order.user?.name,
      order.address?.phone,
      order.total,
      order.paymentMethod?.toUpperCase(),
      order.paymentStatus,
      order.status,
      order.items?.length || 0,
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Orders exported!");
  };

  // Get product image URL
  const getProductImage = (product) => {
    if (!product) return null;
    if (product.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    if (product.image) return product.image;
    return null;
  };

  // Search and filter
  useEffect(() => {
    let filtered = [...orders];
    
    if (search) {
      filtered = filtered.filter(order => 
        order._id.includes(search) || 
        order.address?.phone?.includes(search) ||
        order.user?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    if (paymentFilter !== "all") {
      filtered = filtered.filter(order => order.paymentMethod === paymentFilter);
    }
    
    if (dateRange.start) {
      filtered = filtered.filter(order => new Date(order.createdAt) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(order => new Date(order.createdAt) <= new Date(dateRange.end));
    }
    
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [search, statusFilter, paymentFilter, dateRange, orders]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400",
    confirmed: "bg-blue-500/20 text-blue-400",
    shipped: "bg-indigo-500/20 text-indigo-400",
    delivered: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
    rto: "bg-orange-500/20 text-orange-400",
  };

  const paymentColors = {
    paid: "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    failed: "bg-red-500/20 text-red-400",
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const StatCard = ({ label, value, color, icon, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-gray-800 rounded-xl p-3 border-l-4 border-${color}-500 ${onClick ? 'cursor-pointer hover:bg-gray-700 transition' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <p className="mt-2 text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 text-white min-h-screen bg-gray-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Orders</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track customer orders</p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={refreshOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            🔄 Refresh
          </button>
          <button
            onClick={downloadOrdersCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            📥 Download CSV
          </button>
        </div>
      </div>

      {/* Stats Cards - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <StatCard 
          label="Total Orders" 
          value={stats.total} 
          color="blue" 
          icon="📊" 
          onClick={() => { setStatusFilter("all"); setSearch(""); }}
        />
        <StatCard 
          label="Pending" 
          value={stats.pending} 
          color="yellow" 
          icon="⏳" 
          onClick={() => setStatusFilter("pending")}
        />
        <StatCard 
          label="Confirmed" 
          value={stats.confirmed} 
          color="blue" 
          icon="✅" 
          onClick={() => setStatusFilter("confirmed")}
        />
        <StatCard 
          label="Shipped" 
          value={stats.shipped} 
          color="indigo" 
          icon="🚚" 
          onClick={() => setStatusFilter("shipped")}
        />
        <StatCard 
          label="Delivered" 
          value={stats.delivered} 
          color="green" 
          icon="🎉" 
          onClick={() => setStatusFilter("delivered")}
        />
        <StatCard 
          label="Cancelled/RTO" 
          value={stats.cancelled + stats.rto} 
          color="red" 
          icon="❌" 
          onClick={() => setStatusFilter("cancelled")}
        />
      </div>

      {/* Second Row Stats - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard 
          label="COD Orders" 
          value={stats.cod} 
          color="orange" 
          icon="💰" 
          onClick={() => setPaymentFilter("cod")}
        />
        <StatCard 
          label="Prepaid" 
          value={stats.prepaid} 
          color="blue" 
          icon="💳" 
          onClick={() => setPaymentFilter("razorpay")}
        />
        <StatCard 
          label="Paid" 
          value={stats.paid} 
          color="green" 
          icon="✓" 
          onClick={() => setPaymentFilter("all")}
        />
        <StatCard 
          label="Unpaid" 
          value={stats.unpaid} 
          color="red" 
          icon="⚠️" 
          onClick={() => setPaymentFilter("all")}
        />
      </div>

      {/* Items Per Page Selector */}
      <div className="flex justify-end mb-3">
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <input
            type="text"
            placeholder="🔍 Search by Order ID or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="rto">RTO</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
          >
            <option value="all">All Payments</option>
            <option value="cod">COD</option>
            <option value="razorpay">Prepaid</option>
          </select>

          <select
            onChange={(e) => {
              const value = e.target.value;
              const today = new Date();
              if (value === "today") {
                const date = today.toISOString().split('T')[0];
                setDateRange({ start: date, end: date, startMonth: "", endMonth: "" });
              } else if (value === "week") {
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                setDateRange({ 
                  start: weekAgo.toISOString().split('T')[0], 
                  end: new Date().toISOString().split('T')[0],
                  startMonth: "", endMonth: "" 
                });
              } else if (value === "month") {
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                setDateRange({ 
                  start: monthAgo.toISOString().split('T')[0], 
                  end: new Date().toISOString().split('T')[0],
                  startMonth: "", endMonth: "" 
                });
              } else if (value === "clear") {
                setDateRange({ start: "", end: "", startMonth: "", endMonth: "" });
              }
            }}
            className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
          >
            <option value="">Quick Date</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="clear">Clear Date Filter</option>
          </select>
        </div>

        {/* Month and Date Pickers */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-400 mb-1">From Date</label>
            <div className="flex gap-2">
              <input
                type="month"
                value={dateRange.startMonth || ""}
                onChange={(e) => {
                  const monthValue = e.target.value;
                  setDateRange(prev => ({ 
                    ...prev, 
                    startMonth: monthValue,
                    start: monthValue ? `${monthValue}-01` : ""
                  }));
                }}
                className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
              />
              <input
                type="date"
                value={dateRange.start || ""}
                onChange={(e) => setDateRange(prev => ({ 
                  ...prev, 
                  start: e.target.value, 
                  startMonth: ""
                }))}
                className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-400 mb-1">To Date</label>
            <div className="flex gap-2">
              <input
                type="month"
                value={dateRange.endMonth || ""}
                onChange={(e) => {
                  const monthValue = e.target.value;
                  if (monthValue) {
                    const [year, month] = monthValue.split('-');
                    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
                    setDateRange(prev => ({ 
                      ...prev, 
                      endMonth: monthValue,
                      end: `${monthValue}-${lastDay}`
                    }));
                  } else {
                    setDateRange(prev => ({ ...prev, endMonth: "", end: "" }));
                  }
                }}
                className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
              />
              <input
                type="date"
                value={dateRange.end || ""}
                onChange={(e) => setDateRange(prev => ({ 
                  ...prev, 
                  end: e.target.value, 
                  endMonth: ""
                }))}
                className="flex-1 bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setDateRange({ start: "", end: "", startMonth: "", endMonth: "" });
                setSearch("");
                setStatusFilter("all");
                setPaymentFilter("all");
                toast.success("All filters cleared");
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar with Dropdown */}
      {currentOrders.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700"
              />
              <span className="text-sm text-gray-300">Select All ({currentOrders.length})</span>
            </label>
            {selectedOrders.length > 0 && (
              <span className="text-sm text-yellow-400">
                {selectedOrders.length} selected
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* ✅ Bulk Action Dropdown */}
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              <option value="">Bulk Actions</option>
              <option value="confirmed">✅ Confirm Selected</option>
              <option value="shipped">🚚 Mark as Shipped</option>
              <option value="delivered">🎉 Mark as Delivered</option>
              <option value="cancelled">❌ Cancel Selected</option>
              <option value="rto">🔄 Mark as RTO</option>
            </select>
            
            <button
              onClick={applyBulkAction}
              disabled={selectedOrders.length === 0 || !bulkAction}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
            >
              Apply to {selectedOrders.length} {selectedOrders.length === 1 ? 'order' : 'orders'}
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      {currentOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl">
          <p className="text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentOrders.map((order) => {
            const productImage = getProductImage(order.items?.[0]?.product);
            return (
              <div key={order._id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                {/* Compact Row */}
                <div
                  className="flex flex-wrap items-center gap-3 p-4 cursor-pointer hover:bg-gray-750 transition"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectOrder(order._id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                  />

                  <div className="flex-shrink-0">
                    {productImage ? (
                      <div className="relative w-11 h-11">
                        <Image
                          src={productImage}
                          alt="product"
                          fill
                          className="rounded-lg object-cover border border-gray-600"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-gray-700 flex items-center justify-center text-lg">📦</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">
                      {order.address?.name || order.user?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{order.address?.phone || "No phone"}</p>
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-xs font-mono text-gray-400">#{order._id.slice(-8)}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="hidden sm:block text-xs text-gray-400">
                    {order.items?.length} item{order.items?.length > 1 ? "s" : ""}
                  </div>

                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                    order.paymentMethod === "razorpay" ? "bg-purple-500/20 text-purple-400" : "bg-orange-500/20 text-orange-400"
                  }`}>
                    {order.paymentMethod === "razorpay" ? "💳 PREPAID" : "💰 COD"}
                  </span>

                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${paymentColors[order.paymentStatus] || paymentColors.pending}`}>
                    {order.paymentStatus === "paid" ? "✓ PAID" : "⏳ PENDING"}
                  </span>

                  <p className="font-bold text-white flex-shrink-0">₹{order.total}</p>

                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusColors[order.status]}`}>
                    {order.status?.toUpperCase()}
                  </span>

                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { e.stopPropagation(); updateStatus(order._id, e.target.value); }}
                    className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded-lg text-xs outline-none focus:border-yellow-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rto">RTO</option>
                  </select>

                  {order.paymentMethod === "cod" && order.paymentStatus !== "paid" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updatePaymentStatus(order._id, "paid"); }}
                      className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-lg text-xs"
                    >
                      Mark Paid
                    </button>
                  )}

                  <span className="text-gray-400 text-sm flex-shrink-0">
                    {expandedOrder === order._id ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order._id && (
                  <div className="border-t border-gray-700 p-4 space-y-4 bg-gray-900">
                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="bg-gray-800 rounded-lg px-3 py-2">
                        <span className="text-gray-400">Order ID:</span>
                        <span className="text-gray-300 ml-2 font-mono">{order._id}</span>
                        <button onClick={() => copyToClipboard(order._id, "Order ID")} className="ml-2 text-yellow-400">📋</button>
                      </div>
                      <div className="bg-gray-800 rounded-lg px-3 py-2">
                        <span className="text-gray-400">Date & Time:</span>
                        <span className="text-gray-300 ml-2">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-3">
                      <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Customer Details</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-400">Name</p>
                          <p className="text-white">{order.address?.name || order.user?.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-white">{order.user?.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Phone</p>
                          <p className="text-white">{order.address?.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-3">
                      <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Shipping Address</p>
                      <p className="text-white">{order.address?.addressLine}</p>
                      <p className="text-gray-400">{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-3">
                      <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Items ({order.items?.length})</p>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 pb-2 border-b border-gray-700 last:border-0">
                            {getProductImage(item.product) ? (
                              <div className="relative w-10 h-10">
                                <Image
                                  src={getProductImage(item.product)}
                                  alt={item.product?.name || "product"}
                                  fill
                                  className="rounded-lg object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">📦</div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm text-white">{item.product?.name || "Product"}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.product?.price}</p>
                            </div>
                            <p className="text-sm font-semibold text-white">
                              ₹{(item.product?.price || 0) * item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 text-right">
                        <p className="text-sm font-bold text-white">Total: ₹{order.total}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => updateStatus(order._id, "confirmed")} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm">Confirm Order</button>
                      <button onClick={() => updateStatus(order._id, "shipped")} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm">Mark Shipped</button>
                      <button onClick={() => updateStatus(order._id, "delivered")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm">Mark Delivered</button>
                      <button onClick={() => updateStatus(order._id, "cancelled")} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm">Cancel Order</button>
                      <button onClick={() => updateStatus(order._id, "rto")} className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-sm">RTO / Return</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition"
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-400">
        Showing {currentOrders.length} of {filteredOrders.length} orders
      </div>
    </div>
  );
}