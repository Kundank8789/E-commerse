"use client";

import Image from "next/image";

export default function AdminForm({
  form,
  handleChange,
  handleSubmit,
  loading,
  editId,
  handleImageUpload,
  uploading,
  uploadProgress,
  handleRemoveImage,
  categories,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 mb-16 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg transition-all duration-300 hover:border-white/20"
    >
      {/* Product Name */}
      <input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-400"
        required
      />

      {/* Price */}
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-400"
        required
      />

      {/* Category Dropdown */}
      <select
        name="category"
        value={form.category || ""}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
      >
        <option value="" className="bg-black">
          Select Category
        </option>

        {categories?.map((c) => (
          <option key={c._id} value={c._id} className="bg-black">
            {c.name}
          </option>
        ))}
      </select>

      {/* Drag & Drop Multiple Upload */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          if (!uploading) {
            handleImageUpload(e.dataTransfer.files);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/20 p-6 rounded-xl text-center cursor-pointer 
        hover:border-white/40 transition relative overflow-hidden"
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleImageUpload(e.target.files)}
          className="hidden"
          id="fileUpload"
        />

        <label htmlFor="fileUpload" className="cursor-pointer block w-full h-full">
          {uploading ? (
            <p className="text-sm text-gray-300">
              Uploading... {uploadProgress}%
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Drag & drop images or click to upload
            </p>
          )}
        </label>

        {/* Progress Bar */}
        {uploading && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <div
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Upload Status */}
      {uploading && (
        <p className="text-sm text-yellow-400">
          Uploading images... please wait
        </p>
      )}

      {/* Multiple Image Preview */}
      <div className="flex gap-3 flex-wrap mt-2">
        {form.images?.map((img, index) =>
          img ? (
            <div key={index} className="relative w-24 h-24 group">
              <Image
                src={img}
                alt="preview"
                fill
                sizes="100px"
                className="object-cover rounded-lg border border-white/10"
              />
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full 
                opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ) : null
        )}
      </div>

      {/* Description */}
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-gray-400"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading || loading}
        className="w-full bg-white text-black py-3 rounded-full font-semibold 
        hover:scale-[1.02] transition disabled:opacity-50"
      >
        {uploading
          ? `Uploading ${uploadProgress}%`
          : loading
            ? editId
              ? "Updating..."
              : "Adding..."
            : editId
              ? "Update Product"
              : "Add Product"}
      </button>
    </form>
  );
}