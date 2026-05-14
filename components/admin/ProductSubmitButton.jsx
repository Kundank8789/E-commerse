export default function ProductSubmitButton({ isEdit, uploading }) {
  return (
    <button
      type="submit"
      disabled={uploading}
      className="w-full bg-black text-white py-3 rounded-lg disabled:bg-gray-400 hover:bg-gray-800 transition font-semibold"
    >
      {isEdit ? "Update Product" : "Create Product"}
    </button>
  );
}