"use client";

import Link from "next/link";
import { useState } from "react";
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube, FaPinterest } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlinePhone } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

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
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1 - Brand */}
          <div>
            <h2 className="text-xl font-bold mb-4">MY STORE</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Premium fashion for modern lifestyle. Designed for comfort, crafted with care, delivered with love.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <HiOutlineLocationMarker className="text-yellow-500" />
                <span>123 Fashion Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <HiOutlinePhone className="text-yellow-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MdOutlineEmail className="text-yellow-500" />
                <span>hello@mystore.com</span>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex gap-2 mt-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition">
                <FaInstagram className="text-sm" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition">
                <FaTwitter className="text-sm" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-700 transition">
                <FaFacebook className="text-sm" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition">
                <FaYoutube className="text-sm" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-500 transition">
                <FaPinterest className="text-sm" />
              </a>
            </div>
          </div>

          {/* Column 2 - Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-400 hover:text-yellow-500 transition text-sm">All Products</Link></li>
              <li><Link href="/collections" className="text-gray-400 hover:text-yellow-500 transition text-sm">Collections</Link></li>
              <li><Link href="/new" className="text-gray-400 hover:text-yellow-500 transition text-sm">New Arrivals</Link></li>
              <li><Link href="/sale" className="text-gray-400 hover:text-yellow-500 transition text-sm">Sale</Link></li>
              <li><Link href="/featured" className="text-gray-400 hover:text-yellow-500 transition text-sm">Featured</Link></li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-yellow-500 transition text-sm">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-yellow-500 transition text-sm">FAQ</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-yellow-500 transition text-sm">Returns & Exchange</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-yellow-500 transition text-sm">Shipping Info</Link></li>
              <li><Link href="/size-guide" className="text-gray-400 hover:text-yellow-500 transition text-sm">Size Guide</Link></li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-yellow-500 text-sm font-medium mb-2">🎉 Get 10% off your first purchase!</p>
            <p className="text-gray-400 text-sm mb-4">Receive exclusive deals, new arrivals & special offers.</p>
            <div className="flex mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Your email address"
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
            <p className="text-gray-500 text-xs">No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p className="text-gray-500">© {currentYear} MY STORE. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-yellow-500 transition">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-yellow-500 transition">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-500 hover:text-yellow-500 transition">Cookie Policy</Link>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <span>🇺🇸</span>
              <span>English (US)</span>
              <span>•</span>
              <span>USD ($)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}