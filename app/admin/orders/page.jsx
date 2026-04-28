"use client";

import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    // 🔄 instant UI update
    setOrders((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, status } : o
      )
    );
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl mb-6">Admin Orders</h1>

      {orders.map((order) => (
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
            {order.items.map((item, i) => (
              <p key={i} className="text-gray-300">
                {item.product?.name} × {item.quantity}
              </p>
            ))}
          </div>

          {/* 🏠 ADDRESS */}
          <div className="mt-3 text-sm text-gray-400">
            <p className="font-semibold text-white">Shipping Address:</p>
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
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}