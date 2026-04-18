"use client";

import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProduct() {
  const { id } = useParams();

  return (
    <div>
      <h1>Edit Product</h1>
      <ProductForm productId={id} />
    </div>
  );
}