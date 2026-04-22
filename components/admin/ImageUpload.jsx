"use client";

import Image from "next/image";

export default function ImageUpload({ product, setProduct }) {

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setProduct(prev => ({
      ...prev,
      images: [...prev.images, data.url],
    }));
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />

      <div className="flex gap-2 mt-2">
        {product.images.map((img, i) => (
          <div key={i} className="relative w-16 h-16">
            <Image
              src={img}
              alt="product"
              fill
              className="object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}