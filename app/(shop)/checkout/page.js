"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, clearCart } = useCart();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState({
    phone: "",
    city: "",
    state: "",
    pincode: "",
    addressLine: "",
  });

  // 🔐 GET USER
  useEffect(() => {
    async function fetchUser() {
      try {
        // EMPTY CART PROTECTION
        if (cart.length === 0) {
          router.push("/cart");
          return;
        }

        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          router.push("/login?redirect=/checkout");
          return;
        }

        const data = await res.json();

        setUser(data.user);

      } catch (error) {

        console.error(error);
        toast.error("Failed to load user");

      } finally {

        setLoading(false);

      }
    }

    fetchUser();
  }, [cart, router]);

  // 🛒 TOTAL
  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  // 📦 PLACE ORDER
  const handlePlaceOrder = async () => {
    try {
      setPlacing(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product: item._id || item.id,
            quantity: item.quantity,
          })),
          total,
          address,
        }),
      });

      if (!res.ok) {
        throw new Error("Order failed");
      }

      const order = await res.json();

      toast.success("Order placed successfully 🎉");

      clearCart();

      setTimeout(() => {
        router.push(
          `/order-success?orderId=${order._id}`
        );
      }, 1500);

    } catch (error) {

      console.error(error);
      toast.error("Failed to place order");

    } finally {

      setPlacing(false);

    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <p className="text-lg font-medium text-gray-600">
          Loading checkout...
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">

      <div className="max-w-7xl mx-auto">

        {/* HEADING */}
        <div className="mb-10">

          <h1 className="text-4xl font-bold text-black">
            Secure Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Complete your order details below
          </p>

        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* USER INFO */}
            <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-6">

              <h2 className="text-xl font-semibold mb-5">
                Customer Information
              </h2>

              <div className="space-y-2 text-gray-700">

                <p>
                  <span className="font-semibold text-black">
                    Name:
                  </span>{" "}
                  {user?.name}
                </p>

                <p>
                  <span className="font-semibold text-black">
                    Email:
                  </span>{" "}
                  {user?.email}
                </p>

              </div>

            </div>

            {/* SHIPPING */}
            <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-6">

              <h2 className="text-xl font-semibold mb-5">
                Shipping Address
              </h2>

              <div className="space-y-4">

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300
                  bg-gray-50 outline-none focus:ring-2 focus:ring-black
                  focus:bg-white transition-all duration-300"
                />

                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300
                    bg-gray-50 outline-none focus:ring-2 focus:ring-black
                    focus:bg-white transition-all duration-300"
                  />

                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        state: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300
                    bg-gray-50 outline-none focus:ring-2 focus:ring-black
                    focus:bg-white transition-all duration-300"
                  />

                </div>

                <input
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      pincode: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300
                  bg-gray-50 outline-none focus:ring-2 focus:ring-black
                  focus:bg-white transition-all duration-300"
                />

                <textarea
                  rows={4}
                  placeholder="Full Address"
                  value={address.addressLine}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      addressLine: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300
                  bg-gray-50 outline-none focus:ring-2 focus:ring-black
                  focus:bg-white transition-all duration-300 resize-none"
                />

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-6 sticky top-24">

              <h2 className="text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">

                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border-b border-gray-100 pb-4"
                  >
                    <div>

                      <p className="font-medium text-black">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <p className="font-semibold text-black">
                      ₹
                      {item.price * item.quantity}
                    </p>

                  </div>
                ))}

              </div>

              {/* TOTAL */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">

                <span className="text-lg font-semibold">
                  Total
                </span>

                <span className="text-2xl font-bold text-black">
                  ₹{total}
                </span>

              </div>

              {/* BUTTON */}
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full mt-6 bg-black text-white py-4 rounded-2xl
                font-semibold hover:bg-gray-800 transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}