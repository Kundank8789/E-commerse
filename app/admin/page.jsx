"use client";

import { useEffect, useState } from "react";
import AdminForm from "@/components/admin/AdminForm";
import ProductCard from "@/components/admin/ProductCard";

export default function AdminPage() {
    const [form, setForm] = useState({
        name: "",
        price: "",
        images: [], // ✅ multiple images
        description: "",
    });

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // 🔴 Cloudinary config
    const cloudName = "dop9yznsl";
    const uploadPreset = "ml_default";

    // 🔥 Fetch products
    const fetchProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔥 MULTIPLE IMAGE UPLOAD
    const handleImageUpload = (files) => {
        const fileArray = Array.from(files);

        let uploadCount = fileArray.length; // ✅ track uploads
        setUploading(true);

        fileArray.forEach((file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", uploadPreset);

            const xhr = new XMLHttpRequest();

            xhr.open(
                "POST",
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
            );

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setUploadProgress(percent);
                }
            };

            xhr.onload = () => {
                const res = JSON.parse(xhr.responseText);

                if (res.secure_url) {
                    setForm((prev) => ({
                        ...prev,
                        images: [...prev.images, res.secure_url],
                    }));
                }

                uploadCount--;

                // ✅ ONLY stop uploading after ALL files done
                if (uploadCount === 0) {
                    setUploading(false);
                    setUploadProgress(0);
                }
            };

            xhr.onerror = () => {
                console.error("Upload failed");
                uploadCount--;

                if (uploadCount === 0) {
                    setUploading(false);
                }
            };

            xhr.send(data);
        });
    };

    // 🔥 REMOVE IMAGE
    const handleRemoveImage = (index) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // 🔥 SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return; // ✅ prevent double submit

        if (uploading) {
            alert("Please wait until images finish uploading");
            return;
        }

        if (form.images.length === 0) {
            alert("Please upload at least one image");
            return;
        }

        setLoading(true);

        try {
            const url = editId
                ? `/api/products/${editId}`
                : "/api/products";

            const method = editId ? "PUT" : "POST";

            await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    images: form.images,
                }),
            });

            // Reset form
            setForm({
                name: "",
                price: "",
                images: [],
                description: "",
            });

            setEditId(null);
            fetchProducts();

        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    // 🔥 DELETE
    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;

        await fetch(`/api/products/${id}`, {
            method: "DELETE",
        });

        fetchProducts();
    };

    // 🔥 EDIT
    const handleEdit = (product) => {
        setForm({
            name: product.name,
            price: product.price,
            images: product.images || [product.image], // support old + new
            description: product.description,
        });

        setEditId(product._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section className="min-h-screen bg-gradient-to-b from-black to-neutral-900 text-white py-20 px-6">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-4xl font-bold mb-10 text-center">
                    Admin Dashboard
                </h1>

                {/* 🔥 FORM */}
                <AdminForm
                    form={form}
                    setForm={setForm}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    editId={editId}
                    handleImageUpload={handleImageUpload}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    handleRemoveImage={handleRemoveImage}
                />

                {/* 🔥 PRODUCT LIST */}
                <div>
                    <h2 className="text-2xl font-semibold mb-6">
                        All Products
                    </h2>

                    {products.length === 0 ? (
                        <p className="text-gray-400">No products found</p>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}