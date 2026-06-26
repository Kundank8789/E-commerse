"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricing from "./ProductPricing";
import ProductStockShipping from "./ProductStockShipping";
import ProductDimensions from "./ProductDimensions";
import ProductVariations from "./ProductVariations";
import ProductCategories from "./ProductCategories";
import ProductImages from "./ProductImages";
import ProductSubmitButton from "./ProductSubmitButton";

export default function ProductForm({ isEdit = false, existingProduct = null }) {
  const router = useRouter();
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    sku: "",
    description: "",
    price: "",
    mrp: "",
    tax: "",
    stock: "",
    lowStockThreshold: "10",
    lowStockWarning: "10",
    shippingCost: "0",
    minOrderQuantity: "1",
    maxOrderQuantity: "5",
    status: "active",
    weight: "",
    length: "",
    breadth: "",
    height: "",
    colors: "",
    sizes: "",
    categories: [],
    images: [],
    variations: [],
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories);

    if (isEdit && existingProduct) {
      setProduct({
        ...existingProduct,
        colors: existingProduct.colors?.join(", ") || "",
        sizes: existingProduct.sizes?.join(", ") || "",
        lowStockThreshold: existingProduct.lowStockThreshold || "10",
        lowStockWarning: existingProduct.lowStockWarning || "10",
        shippingCost: existingProduct.shippingCost || "0",
        minOrderQuantity: existingProduct.minOrderQuantity || "1",
        maxOrderQuantity: existingProduct.maxOrderQuantity || "5",
        status: existingProduct.status || "active",
      });
    }
  }, [isEdit, existingProduct]);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setProduct(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === "name") {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleCategoryChange = (id) => {
    setProduct(prev => {
      const exists = prev.categories.includes(id);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter(c => c !== id)
          : [...prev.categories, id],
      };
    });
  };

  // ✅ Add variation
  const addVariation = (variation) => {
    setProduct(prev => ({
      ...prev,
      variations: [...prev.variations, variation],
    }));
  };

  // ✅ Remove variation
  const removeVariation = (index) => {
    setProduct(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  // ✅ UPDATE variation (NEW)
  const updateVariation = (index, updatedVariation) => {
    setProduct(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) => 
        i === index ? updatedVariation : v
      )
    }));
  };

  const handleImageUpload = (imageUrl) => {
    setProduct(prev => ({
      ...prev,
      images: [...prev.images, imageUrl],
    }));
  };

  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate required fields
    if (!product.name || !product.sku || !product.price) {
      setMessage("❌ Name, SKU, and Price are required");
      return;
    }

    // ✅ Validate min/max quantity
    const minQty = parseInt(product.minOrderQuantity) || 1;
    const maxQty = parseInt(product.maxOrderQuantity) || 5;
    if (minQty > maxQty) {
      setMessage("❌ Minimum quantity cannot be greater than maximum quantity");
      return;
    }

    // ✅ Validate stock vs max quantity
    const stock = parseInt(product.stock) || 0;
    if (stock > 0 && maxQty > stock) {
      setMessage(`❌ Maximum order quantity (${maxQty}) cannot exceed available stock (${stock})`);
      return;
    }

    const submitData = {
      name: product.name,
      slug: product.slug || generateSlug(product.name),
      sku: product.sku.toUpperCase(),
      description: product.description,
      price: parseFloat(product.price),
      mrp: product.mrp ? parseFloat(product.mrp) : null,
      tax: parseFloat(product.tax) || 0,
      stock: parseInt(product.stock) || 0,
      lowStockThreshold: parseInt(product.lowStockThreshold) || 10,
      lowStockWarning: parseInt(product.lowStockWarning) || 10,
      shippingCost: parseFloat(product.shippingCost) || 0,
      minOrderQuantity: parseInt(product.minOrderQuantity) || 1,
      maxOrderQuantity: parseInt(product.maxOrderQuantity) || 5,
      status: product.status,
      weight: product.weight ? parseFloat(product.weight) : null,
      length: product.length ? parseFloat(product.length) : null,
      breadth: product.breadth ? parseFloat(product.breadth) : null,
      height: product.height ? parseFloat(product.height) : null,
      colors: product.colors ? product.colors.split(",").map(c => c.trim()).filter(c => c) : [],
      sizes: product.sizes ? product.sizes.split(",").map(s => s.trim()).filter(s => s) : [],
      categories: product.categories,
      images: product.images,
      variations: product.variations, // ✅ Variations are included
    };

    console.log("Submitting product:", submitData);

    // ✅ Use admin API
    const url = isEdit 
      ? `/api/admin/products/${existingProduct._id}` 
      : "/api/admin/products";
    
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(isEdit ? "✅ Product Updated!" : "✅ Product Created!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("❌ Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProductBasicInfo 
        product={product} 
        handleChange={handleChange} 
      />
      
      <ProductPricing 
        product={product} 
        handleChange={handleChange} 
      />
      
      <ProductStockShipping 
        product={product} 
        handleChange={handleChange} 
      />
      
      <ProductDimensions 
        product={product} 
        handleChange={handleChange} 
      />
      
      {/* ✅ Updated ProductVariations with edit support */}
      <ProductVariations 
        product={product}
        onAddVariation={addVariation}
        onRemoveVariation={removeVariation}
        onUpdateVariation={updateVariation}  // ✅ NEW: Pass update function
      />
      
      <ProductCategories 
        categories={categories}
        selectedCategories={product.categories}
        onCategoryChange={handleCategoryChange}
      />
      
      <ProductImages 
        images={product.images}
        uploading={uploading}
        onImageUpload={handleImageUpload}
        onRemoveImage={removeImage}
        setUploading={setUploading}
        setMessage={setMessage}
      />
      
      <ProductSubmitButton 
        isEdit={isEdit}
        uploading={uploading}
      />
      
      {message && (
        <p className={`text-center p-2 rounded ${
          message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message}
        </p>
      )}
    </form>
  );
}