"use client";

import { useEffect, useState } from "react";
import AdminForm from "@/components/admin/AdminForm";
import ProductCard from "@/components/admin/ProductCard";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);

    // ✅ NEW STATES
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [form, setForm] = useState({
        name: "",
        price: "",
        images: [],
        description: "",
        category: "",
    });

    const [uploading, setUploading] = useState(false);
    const [editId, setEditId] = useState(null);

    const cloudName = "dop9yznsl";
    const uploadPreset = "ml_default";

    // 🔥 FETCH PRODUCTS
    const fetchProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
    };

    // 🔥 FETCH CATEGORIES
    const fetchCategories = async () => {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
    };

    // ✅ USE EFFECT
    useEffect(() => {
        fetchProducts();
        fetchCategories(); // ✅ ADDED
    }, []);

    // 🔥 DELETE
    const handleDelete = async (id) => {
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
            images: product.images || [],
            description: product.description,
            category: product.category?._id || product.category || "",
        });

        setEditId(product._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 🔥 IMAGE UPLOAD
    const handleImageUpload = (files) => {
        const fileArray = Array.from(files);
        setUploading(true);

        fileArray.forEach((file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", uploadPreset);

            fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: data,
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.secure_url) {
                        setForm((prev) => ({
                            ...prev,
                            images: [...prev.images, res.secure_url],
                        }));
                    }
                })
                .finally(() => {
                    setUploading(false);
                });
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
                category: form.category,
            }),
        });

        // reset
        setForm({
            name: "",
            price: "",
            images: [],
            description: "",
            category: "",
        });

        setEditId(null);
        fetchProducts();
    };

    // 🔥 INPUT CHANGE
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            <h1 className="text-2xl mb-6">Product Management</h1>

            {/* ✅ CATEGORY FILTER DROPDOWN */}
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mb-4 p-2 bg-black border text-white"
            >
                <option value="">All Categories</option>

                {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                        {c.name}
                    </option>
                ))}
            </select>

            {/* FORM */}
            <AdminForm
                form={form}
                setForm={setForm}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                editId={editId}
                handleImageUpload={handleImageUpload}
                uploading={uploading}
                handleRemoveImage={handleRemoveImage}
                categories={categories}   // ✅ ADD THIS
            />

            {/* PRODUCT LIST */}
            <div className="grid md:grid-cols-3 gap-6 mt-10">
                {products
                    .filter((p) => {
                        if (!selectedCategory) return true;

                        return (
                            p.category?._id === selectedCategory ||
                            p.category === selectedCategory ||
                            !p.category
                        );
                    })
                    .map((p) => (
                        <ProductCard
                            key={p._id}
                            product={p}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ))}
            </div>
        </div>
    );
}