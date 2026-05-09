"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CheckCircle2,
  PackageCheck,
  Truck,
  ShoppingBag,
} from "lucide-react";

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
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16">

      <div className="w-full max-w-2xl bg-white border border-gray-200 shadow-2xl rounded-3xl p-10 text-center">

        {/* SUCCESS ICON */}
        <div className="flex justify-center">

          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">

            <CheckCircle2
              size={60}
              className="text-green-600"
            />

          </div>

        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-black mt-8">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          Thank you for shopping with us.
          Your order has been confirmed.
        </p>

        {/* ORDER ID */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-5">

          <p className="text-sm text-gray-500">
            Order ID
          </p>

          <p className="font-semibold text-black mt-1 break-all">
            {orderId}
          </p>

        </div>

        {/* ORDER TIMELINE */}
        {order && (
          <div className="mt-10">
            <OrderTimeline
              status={order.status}
              createdAt={order.createdAt}
            />
          </div>
        )}

        {/* DELIVERY STEPS */}
        <div className="grid grid-cols-3 gap-6 mt-10">

          <div className="flex flex-col items-center">

            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center">
              <PackageCheck size={24} />
            </div>

            <p className="mt-3 font-medium text-sm text-black">
              Confirmed
            </p>

          </div>

          <div className="flex flex-col items-center">

            <div className="w-14 h-14 rounded-full bg-gray-200 text-black flex items-center justify-center">
              <Truck size={24} />
            </div>

            <p className="mt-3 font-medium text-sm text-black">
              Shipping
            </p>

          </div>

          <div className="flex flex-col items-center">

            <div className="w-14 h-14 rounded-full bg-gray-200 text-black flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>

            <p className="mt-3 font-medium text-sm text-black">
              Delivered
            </p>

          </div>

        </div>

        {/* DELIVERY INFO */}
        <div className="mt-10">

          <p className="text-gray-500">
            Estimated delivery
          </p>

          <p className="font-semibold text-black mt-1">
            3 - 5 Business Days
          </p>

        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">

          <Link
            href="/"
            className="flex-1 bg-black text-white py-4 rounded-2xl 
            font-semibold hover:bg-gray-800 transition-all duration-300"
          >
            Continue Shopping
          </Link>

          <Link
            href="/orders"
            className="flex-1 border border-gray-300 py-4 rounded-2xl 
            font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            View Orders
          </Link>

        </div>

      </div>

    </section>
  );
}