"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-6">Orders</h1>

      {orders.map((o) => (
        <div key={o._id} className="bg-black p-4 mb-4 rounded">

          <p>Total: ₹{o.total}</p>
          <p>Status: {o.status}</p>

          {o.items.map((item, i) => (
            <p key={i}>
              {item.product.name} × {item.quantity}
            </p>
          ))}

        </div>
      ))}
    </div>
  );
}