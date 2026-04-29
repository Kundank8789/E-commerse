"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderTimeline from "@/components/order/OrderTimeline";
import Link from "next/link"; // 🔥 ADD THIS

export default function OrderSuccess() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`, {
      credentials: "include", // 🔥 better auth handling
    })
      .then((res) => res.json())
      .then(setOrder);
  }, [orderId]);

  return (
    <div className="text-white text-center py-20">
      
      {/* 🎉 SUCCESS MESSAGE */}
      <h1 className="text-3xl font-bold mb-6">
        🎉 Order Placed Successfully!
      </h1>

      {/* 🔥 STEP 2 BUTTON (ADD HERE) */}
      <Link href="/orders">
        <button className="mt-4 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition">
          View My Orders
        </button>
      </Link>

      {/* 📦 TIMELINE */}
      {order && (
        <div className="max-w-xl mx-auto mt-10">
          <OrderTimeline
            status={order.status}
            createdAt={order.createdAt}
          />
        </div>
      )}

    </div>
  );
}