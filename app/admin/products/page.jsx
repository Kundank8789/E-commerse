"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    const deleteProduct = async (id) => {
        if (!confirm("Delete this product?")) return;

        await fetch(`/api/products/${id}`, { method: "DELETE" });

        setProducts(prev => prev.filter(p => p._id !== id));
    };

    const getStockStatus = (p) => {
        if (p.stock === 0) return "❌ Out of Stock";
        if (p.stock < p.lowStockThreshold) return "⚠️ Low Stock";
        return "✅ In Stock";
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Products</h1>

            <Link href="/admin/products/new">
                <button className="mb-4 bg-black text-white px-4 py-2">
                    + Add Product
                </button>
            </Link>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map(p => (
                        <tr key={p._id} className="border-t text-center">
                            {/* ✅ IMAGE COLUMN */}
                            <td>
                                <div className="relative w-12 h-12 mx-auto">
                                    {p.images?.[0] && typeof p.images[0] === "string" ? (
                                        <Image
                                            src={p.images[0]}
                                            alt={p.name || "product"}
                                            fill
                                            className="object-cover rounded"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 text-xs rounded">
                                            No Img
                                        </div>
                                    )}
                                    
                                </div>
                            </td>
                            <td>{p.name}</td>
                            <td>₹{p.price}</td>
                            <td>{p.stock}</td>
                            <td>{getStockStatus(p)}</td>

                            <td className="space-x-2">
                                <Link href={`/admin/products/edit/${p._id}`}>
                                    <button className="bg-blue-500 text-white px-2 py-1">
                                        Edit
                                    </button>
                                </Link>

                                <button
                                    onClick={() => deleteProduct(p._id)}
                                    className="bg-red-500 text-white px-2 py-1"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}