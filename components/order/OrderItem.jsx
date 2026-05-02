// components/order/OrderItem.jsx
import Image from "next/image";

export default function OrderItem({ item }) {
  return (
    <div className="flex gap-4 items-center bg-black/40 p-4 rounded-xl mb-3 hover:bg-black/60 transition">
      
      <Image
        src={item.product?.image || "/placeholder.png"}
        alt={item.product?.name || "Product"}
        width={80}
        height={80}
        className="object-cover rounded-lg border"
      />

      <div className="flex-1">
        <p className="font-semibold text-white">
          {item.product?.name || "Product"}
        </p>

        <p className="text-sm text-gray-400">
          Qty: {item.quantity}
        </p>

        <p className="text-sm text-gray-500">
          ₹{item.product?.price || 0} each
        </p>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-green-400">
          ₹{(item.product?.price || 0) * item.quantity}
        </p>
      </div>
    </div>
  );
}