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
  const { cart, clearCart, getCartTotal, getShippingCost, getGrandTotal } = useCart();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState({
    city: "", state: "", pincode: "", addressLine: "",
  });

  // ✅ Calculate totals using cart context functions
  const subtotal = getCartTotal();
  const shippingCost = getShippingCost();
  const total = getGrandTotal();

  // ✅ Debug: Log shipping details
  useEffect(() => {
    console.log("📦 Cart items with shipping:", cart.map(item => ({
      name: item.name,
      shippingCost: item.shippingCost || 0,
      quantity: item.quantity
    })));
    console.log("🚚 Total shipping cost:", shippingCost);
    console.log("💰 Subtotal:", subtotal);
    console.log("💵 Grand Total:", total);
  }, [cart, shippingCost, subtotal, total]);

  useEffect(() => {
    async function fetchUser() {
      try {
        if (cart.length === 0) { 
          router.push("/cart"); 
          return; 
        }
        
        // ✅ Validate stock before checkout
        const outOfStockItems = cart.filter(item => item.stock === 0);
        if (outOfStockItems.length > 0) {
          toast.error(`Some items are out of stock: ${outOfStockItems.map(i => i.name).join(', ')}`);
          router.push("/cart");
          return;
        }
        
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

  // ✅ Validate stock before placing order
  const validateStockBeforeOrder = () => {
    const outOfStockItems = cart.filter(item => item.stock === 0);
    if (outOfStockItems.length > 0) {
      toast.error(`Out of stock: ${outOfStockItems.map(i => i.name).join(', ')}`);
      return false;
    }
    
    const exceededStock = cart.filter(item => item.quantity > item.stock);
    if (exceededStock.length > 0) {
      toast.error(`Quantity exceeds stock for: ${exceededStock.map(i => i.name).join(', ')}`);
      return false;
    }
    
    return true;
  };

  // ✅ Prepare order data (but DON'T create order yet)
  const getOrderData = () => ({
    items: cart.map((item) => ({ 
      product: item._id || item.id, 
      quantity: item.quantity,
      shippingCost: item.shippingCost || 0,
      productName: item.name,
      productPrice: item.price,
      productImage: item.images?.[0] || '',
      selectedSize: item.selectedSize || '',
      selectedColor: item.selectedColor || '',
    })),
    subtotal: subtotal,
    shippingCost: shippingCost,
    total: total,
    address: { ...address, phone: customerPhone, name: customerName },
    notes: "",
  });

  // ── Load Razorpay script ─────────────────────────
  const loadRazorpay = () => new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  // ── Razorpay Flow (Order created AFTER payment) ──
  const handleRazorpay = async () => {
    if (!validateStockBeforeOrder()) return;
    if (!isFormValid()) return;
    
    try {
      setPlacing(true);
      
      // ✅ Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) { 
        toast.error("Razorpay failed to load"); 
        setPlacing(false);
        return; 
      }

      // ✅ Prepare order data (but don't save to DB yet)
      const orderData = getOrderData();

      // ✅ Create Razorpay payment order
      const paymentRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: total,
        }),
      });
      
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentData.error || "Failed to create payment");
      }
      
      const { order: razorpayOrder } = paymentData;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "NIWLE",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            // ✅ Verify payment AND create order in one step
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                ...response, 
                orderData: orderData, // ✅ Pass order data to create order after verification
              }),
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              toast.success("Payment successful 🎉");
              clearCart();
              const orderId = verifyData.orderId;
              setTimeout(() => router.push(`/order-success?orderId=${orderId}`), 1500);
            } else {
              toast.error(verifyData.error || "Payment verification failed");
              setPlacing(false);
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed");
            setPlacing(false);
          }
        },
        prefill: { 
          name: customerName, 
          email: user?.email, 
          contact: customerPhone 
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: function() {
            // ✅ User closed the payment modal - NO order is created
            toast.error("Payment cancelled");
            setPlacing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      toast.error(error.message || "Payment failed");
      setPlacing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!isFormValid()) return;
    if (!validateStockBeforeOrder()) return;
    handleRazorpay(); // ✅ Only Razorpay - no COD
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
            cart={cart} 
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
            customerName={customerName} 
            customerPhone={customerPhone}
            email={user?.email}
            paymentMethod="razorpay"
            setPaymentMethod={() => {}}
            placing={placing} 
            onPlaceOrder={handlePlaceOrder}
          />

        </div>
      </div>
    </section>
  );
}