"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

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
            const res = await fetch("/api/auth/me");

            if (!res.ok) {
                router.push("/login");
                return;
            }

            const data = await res.json();
            setUser(data);
            setLoading(false);
        }

        fetchUser();
    }, []);

    // 🛒 TOTAL
    const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
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
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    total,
                    address,
                }),
            });

            if (!res.ok) throw new Error("Order failed");

            clearCart();
            router.push("/order-success");

        } catch (err) {
            alert("❌ Failed to place order");
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return <p className="text-white text-center py-20">Loading...</p>;
    }

    return (
        <section className="min-h-screen bg-black text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {/* 👤 USER INFO */}
                <div className="bg-gray-900 p-6 rounded-xl mb-6">
                    <h2 className="text-xl mb-4">User Info</h2>
                    <p>Name: {user?.name}</p>
                    <p>Email: {user?.email}</p>
                </div>

                {/* 🏠 ADDRESS FORM */}
                <div className="bg-gray-900 p-6 rounded-xl mb-6">
                    <h2 className="text-xl mb-4">Shipping Address</h2>

                    <input
                        placeholder="Phone"
                        className="w-full mb-3 p-2 bg-black border"
                        onChange={(e) =>
                            setAddress({ ...address, phone: e.target.value })
                        }
                    />

                    <input
                        placeholder="City"
                        className="w-full mb-3 p-2 bg-black border"
                        onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                        }
                    />

                    <input
                        placeholder="State"
                        className="w-full mb-3 p-2 bg-black border"
                        onChange={(e) =>
                            setAddress({ ...address, state: e.target.value })
                        }
                    />

                    <input
                        placeholder="Pincode"
                        className="w-full mb-3 p-2 bg-black border"
                        onChange={(e) =>
                            setAddress({ ...address, pincode: e.target.value })
                        }
                    />

                    <textarea
                        placeholder="Full Address"
                        className="w-full mb-3 p-2 bg-black border"
                        onChange={(e) =>
                            setAddress({ ...address, addressLine: e.target.value })
                        }
                    />
                </div>

                {/* 🧾 ORDER SUMMARY */}
                <div className="bg-gray-900 p-6 rounded-xl mb-6">
                    <h2 className="text-xl mb-4">Order Summary</h2>

                    {cart.map((item) => (
                        <div key={item._id} className="flex justify-between mb-2">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}

                    <div className="flex justify-between mt-4 font-bold">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </div>

                {/* 🚀 PLACE ORDER */}
                <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="w-full bg-white text-black py-3 rounded-lg font-semibold"
                >
                    {placing ? "Placing Order..." : "Place Order"}
                </button>

            </div>
        </section>
    );
}