"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProductForm() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    mrp: "",
    tax: "",
    stock: "",
    weight: "",
    length: "",
    breadth: "",
    height: "",
    colors: "",
    sizes: "",
    categories: [],
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
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

  // ✅ Image Upload (FormData version)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // ✅ from your cloudinary

    try {
      setUploading(true);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      console.log("UPLOAD RESPONSE:", data);

      if (data?.secure_url && typeof data.secure_url === "string") {
        setProduct(prev => ({
          ...prev,
          images: [...(prev.images || []), data.secure_url],
        }));
      } else {
        console.error("❌ Upload failed:", data);
      }

      setUploading(false);

    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      setUploading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...product,
        price: product.price ? Number(product.price) : 0,
        mrp: product.mrp ? Number(product.mrp) : 0,
        tax: product.tax ? Number(product.tax) : 0,
        stock: product.stock ? Number(product.stock) : 0,
        weight: product.weight ? Number(product.weight) : 0,
        length: product.length ? Number(product.length) : 0,
        breadth: product.breadth ? Number(product.breadth) : 0,
        height: product.height ? Number(product.height) : 0,
        colors: product.colors ? product.colors.split(",") : [],
        sizes: product.sizes ? product.sizes.split(",") : [],
        categories: product.categories || [],
        images: product.images || [],
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("✅ Product Created Successfully");

      setProduct({
        name: "",
        description: "",
        price: "",
        mrp: "",
        tax: "",
        stock: "",
        weight: "",
        length: "",
        breadth: "",
        height: "",
        colors: "",
        sizes: "",
        categories: [],
        images: [],
      });
    } else {
      setMessage("❌ Error creating product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

      <input name="name" placeholder="Product Name" onChange={handleChange} className="border p-2" required />
      <input name="price" placeholder="Price" onChange={handleChange} className="border p-2" />

      <input name="mrp" placeholder="MRP" onChange={handleChange} className="border p-2" />
      <input name="tax" placeholder="Tax (%)" onChange={handleChange} className="border p-2" />

      <textarea name="description" placeholder="Description" onChange={handleChange} className="border p-2 col-span-2" />

      <input name="stock" placeholder="Stock" onChange={handleChange} className="border p-2" />

      <input name="weight" placeholder="Weight" onChange={handleChange} className="border p-2" />
      <input name="length" placeholder="Length" onChange={handleChange} className="border p-2" />
      <input name="breadth" placeholder="Breadth" onChange={handleChange} className="border p-2" />
      <input name="height" placeholder="Height" onChange={handleChange} className="border p-2" />

      <input name="colors" placeholder="Colors" onChange={handleChange} className="border p-2" />
      <input name="sizes" placeholder="Sizes" onChange={handleChange} className="border p-2" />

      {/* Categories */}
      <div className="col-span-2">
        {categories.map(cat => (
          <label key={cat._id} className="mr-3">
            <input type="checkbox" onChange={() => handleCategoryChange(cat._id)} /> {cat.name}
          </label>
        ))}
      </div>

      {/* Image Upload */}
      <input type="file" onChange={handleImageUpload} />
      {uploading && <p className="text-blue-500">Uploading image...</p>}

      <div className="col-span-2 flex gap-2">
        {product.images
          .filter(img => img && img.trim() !== "")
          .map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`${product?.name || "product"} image ${i + 1}`}
              className="w-20 h-20 object-cover"
              width={80}
              height={80}
            />
          ))}
      </div>

      <button
        disabled={uploading || product.images.length === 0}
        className="bg-black text-white py-2 col-span-2 disabled:bg-gray-400"
      >
        Create Product
      </button>
      {message && <p className="col-span-2">{message}</p>}
    </form>
  );
}