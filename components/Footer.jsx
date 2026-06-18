"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      return toast.error("Please enter a valid email address ❌");
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success("Subscribed successfully! 🎉");
    setEmail("");
    setIsSubmitting(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Grid - 5 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-wider">NIWLE</h2>
            <p className="text-gray-400 text-xs mt-1">— FASHION & COMMERCE —</p>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Premium fashion & jewellery for modern lifestyle. Designed for elegance, crafted for you.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-gray-400 text-sm">📍 India</p>
              <p className="text-gray-400 text-sm">📞 +91 8826305153</p>
              {/* ✅ Updated Email */}
              <a 
                href="mailto:supportniwle@gmail.com" 
                className="text-gray-400 text-sm hover:text-yellow-500 transition flex items-center gap-2"
              >
                ✉️ supportniwle@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div>
            <h3 className="text-base font-semibold mb-4">SHOP</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-400 hover:text-yellow-500 transition text-sm">All Products</Link></li>
              <li><Link href="/category/jewellery" className="text-gray-400 hover:text-yellow-500 transition text-sm">Jewellery</Link></li>
              <li><Link href="/category/cloth" className="text-gray-400 hover:text-yellow-500 transition text-sm">Clothing</Link></li>
              <li><Link href="/new" className="text-gray-400 hover:text-yellow-500 transition text-sm">New Arrivals</Link></li>
              <li><Link href="/best-sellers" className="text-gray-400 hover:text-yellow-500 transition text-sm">Best Sellers</Link></li>
              <li><Link href="/sale" className="text-gray-400 hover:text-yellow-500 transition text-sm">Sale & Offers</Link></li>
            </ul>
          </div>

          {/* Column 3: CUSTOMER SUPPORT */}
          <div>
            <h3 className="text-base font-semibold mb-4">CUSTOMER SUPPORT</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-yellow-500 transition text-sm">Contact Us</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-yellow-500 transition text-sm">Track Your Order</Link></li>
              <li><Link href="/shipping-policy" className="text-gray-400 hover:text-yellow-500 transition text-sm">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="text-gray-400 hover:text-yellow-500 transition text-sm">Return & Refund Policy</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-yellow-500 transition text-sm">FAQ</Link></li>
              <li><Link href="/size-guide" className="text-gray-400 hover:text-yellow-500 transition text-sm">Size Guide</Link></li>
            </ul>
          </div>

          {/* Column 4: MY ACCOUNT */}
          <div>
            <h3 className="text-base font-semibold mb-4">MY ACCOUNT</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-gray-400 hover:text-yellow-500 transition text-sm">Login / Register</Link></li>
              <li><Link href="/account/orders" className="text-gray-400 hover:text-yellow-500 transition text-sm">My Orders</Link></li>
              <li><Link href="/wishlist" className="text-gray-400 hover:text-yellow-500 transition text-sm">Wishlist</Link></li>
              <li><Link href="/cart" className="text-gray-400 hover:text-yellow-500 transition text-sm">Shopping Cart</Link></li>
              <li><Link href="/account" className="text-gray-400 hover:text-yellow-500 transition text-sm">Account Details</Link></li>
            </ul>
          </div>

          {/* Column 5: NEWSLETTER & SOCIAL */}
          <div>
            <h3 className="text-base font-semibold mb-4">NEWSLETTER</h3>
            <p className="text-gray-400 text-sm mb-3">
              Subscribe to get updates on new arrivals & exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 text-white placeholder-gray-500 rounded-l-md focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
              />
              <button
                onClick={handleSubscribe}
                disabled={isSubmitting}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-r-md transition disabled:opacity-50 text-sm"
              >
                {isSubmitting ? "..." : "Subscribe"}
              </button>
            </div>
            <p className="text-yellow-500 text-xs mt-2">🎉 Get 10% Off on your first order!</p>
            
            {/* Social Media with Icons */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">FOLLOW US</h3>
              <div className="flex gap-4">
                <a 
                  href="https://www.facebook.com/share/14kPVf5fye1/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition text-2xl"
                >
                  <FaFacebook />
                </a>
                <a 
                  href="https://www.instagram.com/niwleofficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-600 transition text-2xl"
                >
                  <FaInstagram />
                </a>
                <a 
                  href="https://pin.it/5aPQFeQ8o" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-600 transition text-2xl"
                >
                  <FaPinterest />
                </a>
                <a 
                  href="https://www.youtube.com/@niwleofficial" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-700 transition text-2xl"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Policies */}
        <div className="text-center mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-xs">
            © {currentYear} NIWLE. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-yellow-500 transition">Privacy Policy</Link>
            <span className="text-gray-600">|</span>
            <Link href="/terms" className="text-gray-500 hover:text-yellow-500 transition">Terms & Conditions</Link>
            <span className="text-gray-600">|</span>
            <Link href="/cookie-policy" className="text-gray-500 hover:text-yellow-500 transition">Cookie Policy</Link>
          </div>
        </div>

        {/* We Accept - Payment Methods */}
        <div className="text-center mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm mb-3">We Accept</p>
          <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-xs">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>American Express</span>
            <span>PayPal</span>
            <span>Apple Pay</span>
            <span>Google Pay</span>
            <span>Alipay</span>
            <span>WeChat Pay</span>
            <span>UnionPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}