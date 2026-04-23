import { Suspense } from "react";
import ProductsClient from "@/components/product/ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<p>Loading products...</p>}>
      <ProductsClient />
    </Suspense>
  );
}