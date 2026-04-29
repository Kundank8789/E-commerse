"use client";

import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  // 🔥 FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        credentials: "include",
      });

      const data = await res.json();

      console.log("ADMIN API:", data);

      if (!res.ok) {
        console.error("API ERROR:", data);
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setOrders([]);
    }
  };

  // 🔥 UPDATE STATUS (OPTIMISTIC + SYNC)
  const updateStatus = async (id, status) => {
    // ⚡ instant UI update
    setOrders((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, status } : o
      )
    );

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      // 🔄 sync with DB
      fetchOrders();

    } catch (err) {
      console.error("Update failed:", err);

      // rollback
      fetchOrders();
    }
  };

  // 🔥 LOAD + AUTO REFRESH
  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl mb-6">Admin Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-900 p-5 mb-5 rounded-lg shadow"
          >
            {/* 🧾 ORDER INFO */}
            <p className="text-sm text-gray-400">
              Order ID: {order._id}
            </p>
            <p className="text-lg font-semibold">
              Total: ₹{order.total}
            </p>

            {/* 📦 ITEMS */}
            <div className="mt-3">
              <p className="font-semibold mb-1">Items:</p>
              {order.items?.map((item, i) => (
                <p key={i} className="text-gray-300">
                  {item.product?.name} × {item.quantity}
                </p>
              ))}
            </div>

            {/* 🏠 ADDRESS */}
            <div className="mt-3 text-sm text-gray-400">
              <p className="font-semibold text-white">
                Shipping Address:
              </p>
              <p>{order.address?.addressLine}</p>
              <p>
                {order.address?.city}, {order.address?.state} -{" "}
                {order.address?.pincode}
              </p>
              <p>📞 {order.address?.phone}</p>
            </div>

            {/* 🔄 STATUS */}
            <div className="mt-4">
              <label className="mr-2">Status:</label>
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="bg-black border px-3 py-1 rounded"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
}