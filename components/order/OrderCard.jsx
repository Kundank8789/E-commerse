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

  const cancelOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "Cancel failed"); return; }
      setStatus("cancelled");
      setTimeout(() => setRefund(true), 1500);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending:    "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    processing: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    shipped:    "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    delivered:  "bg-green-500/20 text-green-400 border border-green-500/30",
    cancelled:  "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-4 sm:p-6 mb-6 shadow-xl border border-white/10 w-full overflow-hidden"
    >
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-2 mb-4">

        {/* Row 1: Order ID + Status badge */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-400 truncate max-w-[65%]">
            #{order._id.slice(-10)}   {/* show last 10 chars only */}
          </p>
          <motion.span
            key={status}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${statusColors[status]}`}
          >
            {status}
          </motion.span>
        </div>

        {/* Row 2: Date + Price */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toDateString()}
          </p>
          <p className="text-base font-semibold text-white flex-shrink-0">
            ₹{order.total}
          </p>
        </div>

      </div>

      {/* ── TIMELINE ── */}
      <OrderTimeline status={status} createdAt={order.createdAt} />

      {/* ── ITEMS ── */}
      <div className="mt-5 space-y-3">
        {order.items?.map((item, i) => (
          <OrderItem key={i} item={item} />
        ))}
      </div>

      {/* ── ADDRESS ── */}
      <OrderAddress address={order.address} />

      {/* ── CANCEL BUTTON ── */}
      {status !== "shipped" &&
        status !== "delivered" &&
        status !== "cancelled" && (
          <button
            onClick={cancelOrder}
            disabled={loading}
            className="mt-5 w-full border border-red-500/50 text-red-400 py-2.5 rounded-xl hover:bg-red-500/10 active:scale-95 transition-all font-medium text-sm disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

      {/* ── REFUND BADGE ── */}
      {status === "cancelled" && refund && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2.5 rounded-xl text-xs text-center"
        >
          💰 Refund initiated — arrives in 5–7 business days
        </motion.div>
      )}
    </motion.div>
  );
}