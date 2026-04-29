"use client";

import { motion } from "framer-motion";

export default function OrderTimeline({ status, createdAt }) {
  const steps = [
    { key: "pending", label: "Order Placed", icon: "📦" },
    { key: "processing", label: "Processing", icon: "⚙️" },
    { key: "shipped", label: "Shipped", icon: "🚚" },
    { key: "delivered", label: "Delivered", icon: "✅" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status);

  // 📅 Estimated Delivery (3–5 days logic)
  const deliveryDate = createdAt
    ? new Date(new Date(createdAt).getTime() + 4 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className="mt-6">

      {/* 🔥 DELIVERY DATE */}
      {deliveryDate && (
        <p className="text-sm text-gray-400 mb-4 text-center">
          Estimated Delivery:{" "}
          <span className="text-white font-semibold">
            {deliveryDate.toDateString()}
          </span>
        </p>
      )}

      <div className="flex items-center justify-between">

        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">

              {/* 🔵 ICON CIRCLE */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isCompleted ? 1.1 : 1,
                  opacity: 1,
                }}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-lg
                ${isCompleted ? "bg-green-500" : "bg-gray-700"}`}
              >
                {step.icon}
              </motion.div>

              {/* 🔗 LINE */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-[2px] z-[-1]
                  ${index < currentIndex ? "bg-green-500" : "bg-gray-700"}`}
                />
              )}

              {/* 📝 LABEL */}
              <p className="text-xs mt-2 text-center">
                {step.label}
              </p>

            </div>
          );
        })}

      </div>
    </div>
  );
}