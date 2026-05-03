"use client";

import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="py-12">
      <h1 className="text-3xl font-semibold mb-6">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item._id} className="border p-4 rounded">
              <img src={item.image} className="mb-2" />
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              <button
                onClick={() => removeFromWishlist(item._id)}
                className="mt-2 text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}