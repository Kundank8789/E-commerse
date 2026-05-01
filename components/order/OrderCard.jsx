import { useState } from "react";
import OrderTimeline from "./OrderTimeline";
import OrderItem from "./OrderItem";
import OrderAddress from "./OrderAddress";

export default function OrderCard({ order }) {
  const [loading, setLoading] = useState(false);

  // 🔥 CANCEL ORDER FUNCTION
  const cancelOrder = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to cancel order");
        return;
      }

      alert("Order cancelled successfully");

      // 🔄 reload page (simple approach)
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 mb-8 shadow-xl border border-white/10">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">
            Order ID: {order._id}
          </p>
          <p className="text-sm text-gray-400">
            Date: {new Date(order.createdAt).toDateString()}
          </p>
        </div>

        <div>
          <p className="text-lg font-semibold">
            ₹{order.total}
          </p>
          <span className="text-yellow-400 text-sm">
            {order.status}
          </span>
        </div>
      </div>

      {/* TIMELINE */}
      <OrderTimeline
        status={order.status}
        createdAt={order.createdAt}
      />

      {/* ITEMS */}
      <div className="mt-6">
        {order.items?.map((item, i) => (
          <OrderItem key={i} item={item} />
        ))}
      </div>

      {/* ADDRESS */}
      <OrderAddress address={order.address} />

      {/* ❌ CANCEL BUTTON (HERE 👇) */}
      {order.status !== "shipped" &&
        order.status !== "delivered" &&
        order.status !== "cancelled" && (
          <button
            onClick={() => cancelOrder(order._id)}
            disabled={loading}
            className="mt-4 bg-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Cancel Order"}
          </button>
        )}

    </div>
  );
}