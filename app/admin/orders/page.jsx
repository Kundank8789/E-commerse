"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setOrders([]); return; }
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setOrders([]);
    }
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
      fetchOrders();
    } catch (err) {
      fetchOrders();
    }
  };

  // ✅ Copy to clipboard
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  // ✅ Copy all customer details
  const copyAllDetails = (order) => {
    const text = `
Name: ${order.address?.name || order.user?.name}
Email: ${order.user?.email}
Phone: ${order.address?.phone}
Address: ${order.address?.addressLine}
City: ${order.address?.city}
State: ${order.address?.state}
Pincode: ${order.address?.pincode}
Total: ₹${order.total}
Payment: ${order.paymentMethod?.toUpperCase() || "COD"}
Status: ${order.status}
    `.trim();
    navigator.clipboard.writeText(text);
    toast.success("All details copied!");
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    pending:    "bg-yellow-500/20 text-yellow-400",
    processing: "bg-blue-500/20 text-blue-400",
    shipped:    "bg-purple-500/20 text-purple-400",
    delivered:  "bg-green-500/20 text-green-400",
    cancelled:  "bg-red-500/20 text-red-400",
  };

  const paymentColors = {
    paid:    "bg-green-500/20 text-green-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    failed:  "bg-red-500/20 text-red-400",
  };

  return (
    <div className="p-4 md:p-8 text-white min-h-screen">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Orders</h1>
        <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
          {orders.length} orders
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">No orders found</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-900 border border-white/10 rounded-xl overflow-hidden">

              {/* ── COMPACT ROW ── */}
              <div
                className="flex flex-wrap items-center gap-3 p-4 cursor-pointer hover:bg-gray-800/50 transition"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                {/* Product image */}
                <div className="flex-shrink-0">
                  {order.items?.[0]?.product?.images?.[0] ? (
                    <Image
                      src={order.items[0].product.images[0]}
                      alt="product" width={44} height={44}
                      className="rounded-lg object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-gray-700 flex items-center justify-center text-lg">📦</div>
                  )}
                </div>

                {/* Customer */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-white truncate">
                    {order.address?.name || order.user?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{order.user?.email}</p>
                </div>

                {/* Items count */}
                <div className="hidden sm:block text-xs text-gray-400 flex-shrink-0">
                  {order.items?.length} item{order.items?.length > 1 ? "s" : ""}
                </div>

                {/* ✅ Payment method badge */}
                <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 flex-shrink-0 uppercase font-medium">
                  {order.paymentMethod || "cod"}
                </span>

                {/* ✅ Payment status badge */}
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${paymentColors[order.paymentStatus] || paymentColors.pending}`}>
                  {order.paymentStatus || "pending"}
                </span>

                {/* Total */}
                <p className="font-bold text-white flex-shrink-0">₹{order.total}</p>

                {/* Order status badge */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${statusColors[order.status]}`}>
                  {order.status}
                </span>

                {/* Status dropdown */}
                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => { e.stopPropagation(); updateStatus(order._id, e.target.value); }}
                  className="bg-black border border-white/20 text-white px-2 py-1 rounded-lg text-xs outline-none focus:border-yellow-400 flex-shrink-0"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Expand arrow */}
                <span className="text-gray-400 text-sm flex-shrink-0">
                  {expandedOrder === order._id ? "▲" : "▼"}
                </span>
              </div>

              {/* ── EXPANDED DETAILS ── */}
              {expandedOrder === order._id && (
                <div className="border-t border-white/10 p-4 space-y-4 bg-gray-950">

                  {/* Order ID + Date */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span>ID: <span className="text-gray-300">{order._id}</span></span>
                    <span>Date: <span className="text-gray-300">{new Date(order.createdAt).toDateString()}</span></span>
                  </div>

                  {/* ✅ Payment Info */}
                  <div className="bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Payment Info</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div>
                        <span className="text-gray-400 text-xs">Method: </span>
                        <span className="text-white font-medium uppercase">
                          {order.paymentMethod || "COD"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs">Status: </span>
                        <span className={`font-medium text-xs px-2 py-0.5 rounded-full ${paymentColors[order.paymentStatus] || paymentColors.pending}`}>
                          {order.paymentStatus || "pending"}
                        </span>
                      </div>
                      {order.razorpay_payment_id && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">Payment ID: </span>
                          <span className="text-gray-300 text-xs">{order.razorpay_payment_id}</span>
                          <button
                            onClick={() => copyToClipboard(order.razorpay_payment_id, "Payment ID")}
                            className="text-xs text-yellow-400 hover:text-yellow-300"
                          >
                            📋
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ✅ Customer with copy buttons */}
                  <div className="bg-gray-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Customer</p>
                      {/* ✅ Copy all button */}
                      <button
                        onClick={() => copyAllDetails(order)}
                        className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-lg font-medium hover:bg-yellow-300 transition"
                      >
                        📋 Copy All
                      </button>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {(order.address?.name || order.user?.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        {/* Name */}
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">
                            {order.address?.name || order.user?.name}
                          </p>
                          <button onClick={() => copyToClipboard(order.address?.name || order.user?.name, "Name")}
                            className="text-gray-400 hover:text-yellow-400 text-xs">📋</button>
                        </div>
                        {/* Email */}
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400">✉️ {order.user?.email}</p>
                          <button onClick={() => copyToClipboard(order.user?.email, "Email")}
                            className="text-gray-400 hover:text-yellow-400 text-xs">📋</button>
                        </div>
                        {/* Phone */}
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400">📞 {order.address?.phone}</p>
                          <button onClick={() => copyToClipboard(order.address?.phone, "Phone")}
                            className="text-gray-400 hover:text-yellow-400 text-xs">📋</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.product?.images?.[0] ? (
                            <Image src={item.product.images[0]} alt={item.product?.name || "product"}
                              width={40} height={40}
                              className="rounded-lg object-cover border border-white/10 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">📦</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{item.product?.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.product?.price}</p>
                          </div>
                          <p className="text-sm font-semibold text-white flex-shrink-0">
                            ₹{(item.product?.price || 0) * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ✅ Address with copy */}
                  <div className="bg-gray-800 rounded-xl p-3 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Shipping Address</p>
                      <button
                        onClick={() => copyToClipboard(
                          `${order.address?.addressLine}, ${order.address?.city}, ${order.address?.state} - ${order.address?.pincode}`,
                          "Address"
                        )}
                        className="text-xs text-gray-400 hover:text-yellow-400"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <p className="text-white">{order.address?.addressLine}</p>
                    <p className="text-gray-400">{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                    <p className="text-gray-400 mt-1">📞 {order.address?.phone}</p>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}