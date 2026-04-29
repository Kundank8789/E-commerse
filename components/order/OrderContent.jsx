"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderTimeline from "@/components/order/OrderTimeline";

export default function OrderContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/orders/${orderId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setOrder);
  }, [orderId]);

  return (
    <div className="text-white text-center py-20">
      <h1 className="text-3xl font-bold mb-6">
        🎉 Order Placed Successfully!
      </h1>

      {order && (
        <div className="max-w-xl mx-auto mt-8">
          <OrderTimeline
            status={order.status}
            createdAt={order.createdAt}
          />
        </div>
      )}
    </div>
  );
}