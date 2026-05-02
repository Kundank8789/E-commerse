"use client";

import { useEffect, useState } from "react";
import OrderTimeline from "@/components/order/OrderTimeline";

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

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000); // refresh every 5 sec

    return () => clearInterval(interval);
  }, []);

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse text-lg">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-10 text-center">
          My Orders 📦
        </h1>

        {/* ❌ EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-400">
            <p className="text-lg">No orders yet</p>
            <p className="text-sm mt-2">
              Start shopping and your orders will appear here
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-900 rounded-xl p-6 mb-8 shadow-lg border border-white/10"
            >
              {/* 🧾 HEADER */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">
                    Order ID: {order._id}
                  </p>
                  <p className="text-sm text-gray-400">
                    Date: {new Date(order.createdAt).toDateString()}
                  </p>
                </div>

                <p className="text-lg font-semibold mt-2 md:mt-0">
                  Total: ₹{order.total}
                </p>
              </div>

              {/* 📦 TIMELINE */}
              <OrderTimeline
                status={order.status}
                createdAt={order.createdAt}
              />

              {/* 🛒 ITEMS */}
              <div className="mt-6">
                <p className="font-semibold mb-2">Items:</p>

                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-gray-300 mb-1"
                  >
                    <span>
                      {item.product?.name || "Product"} × {item.quantity}
                    </span>
                    <span>
                      ₹{(item.product?.price || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* 🏠 ADDRESS */}
              <div className="mt-6 text-sm text-gray-400">
                <p className="font-semibold text-white mb-1">
                  Shipping Address:
                </p>
                <p>{order.address?.addressLine}</p>
                <p>
                  {order.address?.city}, {order.address?.state} -{" "}
                  {order.address?.pincode}
                </p>
                <p>📞 {order.address?.phone}</p>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}