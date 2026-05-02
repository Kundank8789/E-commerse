import { Suspense } from "react";
import OrderContent from "@/components/order/OrderContent";

export default function OrderSuccess() {
  return (
    <Suspense fallback={<p className="text-white text-center py-20">Loading...</p>}>
      <OrderContent />
    </Suspense>
  );
}