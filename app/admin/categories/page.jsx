"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function CategoryPage() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📦");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [bulk, setBulk] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Image upload to Cloudinary (same as products)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

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

      if (data?.secure_url) {
        setImage(data.secure_url);
        setMessage("✅ Image uploaded successfully");
      } else {
        setMessage("❌ Upload failed");
      }
    } catch (err) {
      setMessage("❌ Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  // Add single category
  const addCategory = async () => {
    if (!name.trim()) {
      setMessage("❌ Category name is required");
      return;
    }

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        icon,
        image,
        description
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Category added successfully");
      setName("");
      setIcon("📦");
      setImage("");
      setDescription("");
      fetchCategories();
      setTimeout(() => setMessage(""), 2000);
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  // Update category
  const updateCategory = async () => {
    if (!editingCategory) return;

    const res = await fetch(`/api/categories/${editingCategory._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        icon,
        image,
        description,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Category updated successfully");
      setEditingCategory(null);
      setName("");
      setIcon("📦");
      setImage("");
      setDescription("");
      setShowModal(false);
      fetchCategories();
      setTimeout(() => setMessage(""), 2000);
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  // Bulk add categories
  const bulkAdd = async () => {
    const list = bulk.split(",").map(c => c.trim()).filter(c => c);

    if (list.length === 0) {
      setMessage("❌ Please enter at least one category");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const catName of list) {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, icon: "📦" }),
      });

      if (res.ok) {
        successCount++;
      } else {
        failCount++;
      }
    }

    setMessage(`✅ ${successCount} categories added, ${failCount} failed`);
    setBulk("");
    fetchCategories();
    setTimeout(() => setMessage(""), 3000);
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;

    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setMessage("✅ Category deleted");
    fetchCategories();
    setTimeout(() => setMessage(""), 2000);
  };

  const editCategory = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIcon(cat.icon || "📦");
    setImage(cat.image || "");
    setDescription(cat.description || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setName("");
    setIcon("📦");
    setImage("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Categories</h1>
        <p className="text-gray-500 mb-6">Manage your product categories with icons and images</p>

        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Single Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Category</h2>

            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Electronics, Clothing, Shoes"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
                />
              </div>

              {/* Icon Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon / Emoji
                  <span className="text-xs text-gray-500 ml-2">(Fallback if no image)</span>
                </label>
                <input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Enter emoji (e.g., 🛍️, 👕, 📱)"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900 text-2xl"
                />
                <p className="text-xs text-gray-500 mt-1">Preview: <span className="text-xl">{icon || "📦"}</span></p>
              </div>

              {/* Image Upload - Same as products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image
                  <span className="text-xs text-gray-500 ml-2">(Upload image - will show instead of icon)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {image ? (
                    <div className="relative inline-block">
                      <Image
                        src={image}
                        alt="Category preview"
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                      <button
                        onClick={() => setImage("")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                        id="categoryImage"
                      />
                      <label
                        htmlFor="categoryImage"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Upload Image
                      </label>
                    </>
                  )}
                </div>
                {uploading && <p className="text-blue-500 text-sm mt-1 text-center">Uploading...</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the category"
                  rows="2"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
                />
              </div>

              <button
                onClick={addCategory}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                + Add Category
              </button>
            </div>
          </div>

          {/* Bulk Add Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bulk Add Categories</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Names
                </label>
                <textarea
                  value={bulk}
                  onChange={(e) => setBulk(e.target.value)}
                  placeholder="Enter categories separated by commas&#10;Example: Shoes, T-Shirts, Jeans, Hats, Bags"
                  rows="5"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">Separate each category with a comma</p>
              </div>
              <button
                onClick={bulkAdd}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Bulk Add Categories
              </button>
            </div>
          </div>
        </div>

        {/* Categories List - Shows images if uploaded, otherwise icons */}
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">All Categories</h2>
            <p className="text-gray-500 text-sm">Total: {categories.length} categories</p>
          </div>

          {categories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No categories yet. Add your first category above.
            </div>
          ) : (
            <div className="divide-y">
              {categories.map(cat => (
                <div key={cat._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    {/* Category Image or Icon */}
                    <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                      {cat.image && cat.image !== "" ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          width={50}
                          height={50}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-3xl">{cat.icon || "📦"}</span>
                      )}
                    </div>

                    <div>
                      <div className="font-medium text-gray-800">{cat.name}</div>
                      {cat.description && (
                        <div className="text-sm text-gray-500">{cat.description}</div>
                      )}
                      <div className="text-xs text-gray-400 font-mono">
                        Slug: {cat.slug || "generating..."}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editCategory(cat)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Category</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
                    placeholder="Enter category name"
                  />
                </div>

                {/* Icon / Emoji */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon / Emoji
                  </label>
                  <input
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Enter emoji (e.g., 🛍️, 👕, 📱)"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Preview: <span className="text-xl">{icon || "📦"}</span>
                  </p>
                </div>

                {/* Category Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Image
                  </label>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="w-full border rounded-lg px-4 py-2 text-gray-700 bg-white"
                  />
                  {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}
                  {image && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative w-16 h-16">
                        <Image
                          src={image}
                          alt="Category preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <button onClick={() => setImage("")} className="text-red-500 text-sm">
                        Remove image
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
                    placeholder="Brief description of the category"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={updateCategory}
                    className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Update Category
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}