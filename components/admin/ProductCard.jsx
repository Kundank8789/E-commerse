import Image from "next/image";

export default function ProductCard({ product, handleEdit, handleDelete }) {
  return (
    <div className="group bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 
    transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:border-white/20">

      {/* Image */}
      <div className="relative w-full h-40 mb-3 overflow-hidden rounded-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-lg group-hover:text-white transition">
        {product.name}
      </h3>

      <p className="text-gray-400 text-sm mb-2">
        ₹{product.price}
      </p>

      {/* Buttons */}
      <div className="flex gap-2 mt-3 opacity-80 group-hover:opacity-100 transition">

        <button
          onClick={() => handleEdit(product)}
          className="flex-1 bg-yellow-500 py-2 rounded-lg text-sm 
          hover:bg-yellow-600 hover:scale-[1.03] transition"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(product._id)}
          className="flex-1 bg-red-500 py-2 rounded-lg text-sm 
          hover:bg-red-600 hover:scale-[1.03] transition"
        >
          Delete
        </button>

      </div>

    </div>
  );
}