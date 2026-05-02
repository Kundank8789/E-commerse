"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import OrderTimeline from "./OrderTimeline";
import OrderItem from "./OrderItem";
import OrderAddress from "./OrderAddress";

export default function OrderCard({ order }) {
const [status, setStatus] = useState(order.status);
const [loading, setLoading] = useState(false);
const [refund, setRefund] = useState(false);

// 🔥 CANCEL ORDER (AMAZON STYLE UX)
const cancelOrder = async () => {
try {
setLoading(true);


  const res = await fetch(`/api/orders/${order._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "cancelled" }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Cancel failed");
    return;
  }

  // ✅ Instant UI update (NO reload)
  setStatus("cancelled");

  // 💰 Fake refund trigger (can connect real payment later)
  setTimeout(() => {
    setRefund(true);
  }, 1500);

} catch (err) {
  console.error(err);
  alert("Something went wrong");
} finally {
  setLoading(false);
}


};

// 🎨 STATUS COLORS
const statusColors = {
pending: "bg-yellow-500/20 text-yellow-400",
processing: "bg-blue-500/20 text-blue-400",
shipped: "bg-purple-500/20 text-purple-400",
delivered: "bg-green-500/20 text-green-400",
cancelled: "bg-red-500/20 text-red-400",
};

return (
<motion.div
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 mb-8 shadow-xl border border-white/10"
>
{/* HEADER */} <div className="flex justify-between mb-4"> <div> <p className="text-sm text-gray-400">
Order ID: {order._id} </p> <p className="text-sm text-gray-400">
Date: {new Date(order.createdAt).toDateString()} </p> </div>


    <div className="text-right">
      <p className="text-lg font-semibold">₹{order.total}</p>

      {/* 🟢 Animated Status Badge */}
      <motion.span
        key={status}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`px-3 py-1 rounded-full text-sm ${statusColors[status]}`}
      >
        {status}
      </motion.span>
    </div>
  </div>

  {/* 📦 TIMELINE */}
  <OrderTimeline status={status} createdAt={order.createdAt} />

  {/* 🛒 ITEMS */}
  <div className="mt-6">
    {order.items?.map((item, i) => (
      <OrderItem key={i} item={item} />
    ))}
  </div>

  {/* 🏠 ADDRESS */}
  <OrderAddress address={order.address} />

  {/* ❌ CANCEL BUTTON (AMAZON STYLE) */}
  {status !== "shipped" &&
    status !== "delivered" &&
    status !== "cancelled" && (
      <button
        onClick={cancelOrder}
        disabled={loading}
        className="mt-6 w-full border border-red-500 text-red-400 py-2 rounded-lg hover:bg-red-500 hover:text-white transition font-medium disabled:opacity-50"
      >
        {loading ? "Cancelling..." : "Cancel Order"}
      </button>
    )}

  {/* 💰 REFUND BADGE */}
  {status === "cancelled" && refund && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 bg-green-500/10 border border-green-500 text-green-400 px-4 py-2 rounded-lg text-sm"
    >
      💰 Refund initiated to your account
    </motion.div>
  )}
</motion.div>


);
}
