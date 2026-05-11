"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import CustomerInfo from "@/components/checkout/CustomerInfo";
import ShippingAddress from "@/components/checkout/ShippingAddress";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState({
    city: "", state: "", pincode: "", addressLine: "",
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    async function fetchUser() {
      try {
        if (cart.length === 0) { router.push("/cart"); return; }
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) { router.push("/login?redirect=/checkout"); return; }
        const data = await res.json();
        setUser(data.user);
        setCustomerName(data.user?.name || "");
        setCustomerPhone(data.user?.phone || "");
      } catch (error) {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [cart, router]);

  const isFormValid = () => {
    if (!customerName.trim()) { toast.error("Enter your name"); return false; }
    if (!customerPhone.trim() || customerPhone.length < 10) { toast.error("Enter valid phone"); return false; }
    if (!address.addressLine.trim()) { toast.error("Enter your address"); return false; }
    if (!address.city.trim()) { toast.error("Enter your city"); return false; }
    if (!address.state.trim()) { toast.error("Enter your state"); return false; }
    if (!address.pincode.trim()) { toast.error("Enter your pincode"); return false; }
    return true;
  };

  const orderPayload = {
    items: cart.map((item) => ({ product: item._id || item.id, quantity: item.quantity })),
    total,
    address: { ...address, phone: customerPhone, name: customerName },
  };

  // ── Load Razorpay script ─────────────────────────
  const loadRazorpay = () => new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  // ── COD Flow ────────────────────────────────────
  const handleCOD = async () => {
    try {
      setPlacing(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...orderPayload, paymentMethod: "cod", paymentStatus: "pending" }),
      });
      if (!res.ok) throw new Error("Order failed");
      const order = await res.json();
      toast.success("Order placed successfully 🎉");
      clearCart();
      setTimeout(() => router.push(`/order-success?orderId=${order._id}`), 1500);
    } catch {
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  // ── Razorpay Flow ────────────────────────────────
  const handleRazorpay = async () => {
    try {
      setPlacing(true);
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error("Razorpay failed to load"); return; }
      console.log("RAZORPAY KEY:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const { order } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        order_id: order.id,
        handler: async (response) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderData: orderPayload }),
          });
          const data = await verifyRes.json();
          if (data.success) {
            toast.success("Payment successful 🎉");
            clearCart();
            setTimeout(() => router.push(`/order-success?orderId=${data.orderId}`), 1500);
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name: customerName, email: user?.email, contact: customerPhone },
        theme: { color: "#000000" },
      };

      console.log("OPTIONS:", options);
      console.log("ORDER ID:", order.id);
      console.log("AMOUNT:", order.amount);


      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Payment failed");
    } finally {
      setPlacing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!isFormValid()) return;
    paymentMethod === "cod" ? handleCOD() : handleRazorpay();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
      <p className="text-lg font-medium text-gray-600 animate-pulse">Loading checkout...</p>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-black">Secure Checkout</h1>
          <p className="text-gray-500 mt-2">Complete your order details below</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerInfo
              customerName={customerName} setCustomerName={setCustomerName}
              customerPhone={customerPhone} setCustomerPhone={setCustomerPhone}
              email={user?.email}
            />
            <ShippingAddress address={address} setAddress={setAddress} />
          </div>

          {/* RIGHT */}
          <OrderSummary
            cart={cart} total={total}
            customerName={customerName} customerPhone={customerPhone}
            email={user?.email}
            paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
            placing={placing} onPlaceOrder={handlePlaceOrder}
          />

        </div>
      </div>
    </section>
  );
}