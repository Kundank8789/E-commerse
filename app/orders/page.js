"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/order/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH USER ORDERS
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/my-orders", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API ERROR:", data);
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 LOAD + AUTO REFRESH
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-lg">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        
        {/* 🧾 PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-10 text-center">
          My Orders 📦
        </h1>

        {/* ❌ EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-400">
            <p className="text-lg">No orders yet 😔</p>
            <p className="text-sm mt-2">
              Start shopping and your orders will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}