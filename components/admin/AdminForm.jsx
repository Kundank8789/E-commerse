export default function AdminForm({
  form,
  handleChange,
  handleSubmit,
  loading,
  editId,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 mb-16 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg transition-all duration-300 hover:border-white/20"
    >

      <input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg"
        required
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg"
        required
      />

      <input
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg"
      />

      <button className="w-full bg-white text-black py-3 rounded-full font-semibold hover:scale-[1.02] transition">
        {loading
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