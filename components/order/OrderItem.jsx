import Image from "next/image";

export default function OrderItem({ item }) {
  return (
    <div className="flex gap-4 items-center bg-gray-50 border border-gray-200 p-4 rounded-2xl mb-4 hover:bg-gray-100 transition">

      {/* PRODUCT IMAGE */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-200">

        <Image
          src={
            item.product?.images?.[0] ||
            "/placeholder.png"
          }
          alt={
            item.product?.name || "Product"
          }
          fill
          className="object-cover"
        />

      </div>

      {/* PRODUCT INFO */}
      <div className="flex-1">

        <p className="font-semibold text-black">
          {item.product?.name || "Product"}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Qty: {item.quantity}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          ₹
          {item.product?.price || 0}
          {" "}each
        </p>

      </div>

      {/* TOTAL */}
      <div className="text-right">

        <p className="text-lg font-bold text-black">
          ₹
          {(item.product?.price || 0) *
            item.quantity}
        </p>

      </div>

    </div>
  );
}