"use client";

import { motion } from "framer-motion";

export default function OrderTimeline({ status, createdAt }) {
  const steps = [
    { key: "pending",    label: "Order Placed", icon: "📦" },
    { key: "processing", label: "Processing",   icon: "⚙️" },
    { key: "shipped",    label: "Shipped",       icon: "🚚" },
    { key: "delivered",  label: "Delivered",     icon: "✅" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status);

  const deliveryDate = createdAt
    ? new Date(new Date(createdAt).getTime() + 4 * 24 * 60 * 60 * 1000)
    : null;

  // ❌ Don't show tracker if cancelled
  if (status === "cancelled") {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
        ❌ Order Cancelled — Refund will be processed in 5–7 days
      </div>
    );
  }

  return (
    <div className="mt-6">

      {/* 📅 Delivery Date */}
      {deliveryDate && (
        <p className="text-xs text-gray-400 mb-5 text-center">
          Estimated Delivery:{" "}
          <span className="text-white font-semibold">
            {deliveryDate.toDateString()}
          </span>
        </p>
      )}

      {/* 🔵 Steps Row */}
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          const isDone   = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              key={step.key}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* ✅ FIXED LINE — starts after icon, ends before next icon */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-[18px] h-[2px] z-0 transition-all duration-500
                    ${isDone ? "bg-green-500" : "bg-gray-700"}
                  `}
                  style={{
                    left: "calc(50% + 20px)",   // ← right edge of this icon
                    right: "calc(-50% + 20px)",  // ← left edge of next icon
                  }}
                />
              )}

              {/* 🔵 Icon Circle */}
              <motion.div
                key={status}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  opacity: 1,
                }}
                transition={{
                  duration: isActive ? 1.5 : 0.3,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut",
                }}
                className={`
                  relative z-10 w-9 h-9 flex items-center justify-center
                  rounded-full text-base transition-all duration-500
                  ${isDone   ? "bg-green-500"                              : ""}
                  ${isActive ? "bg-blue-500/20 ring-2 ring-blue-400"       : ""}
                  ${!isDone && !isActive ? "bg-gray-800 ring-1 ring-gray-600" : ""}
                `}
              >
                {isDone ? "✓" : step.icon}
              </motion.div>

              {/* 📝 Label */}
              <p className={`
                text-[10px] sm:text-xs mt-2 text-center leading-tight px-1
                ${isDone   ? "text-green-400 font-medium"  : ""}
                ${isActive ? "text-blue-400 font-semibold" : ""}
                ${!isDone && !isActive ? "text-gray-500"   : ""}
              `}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}