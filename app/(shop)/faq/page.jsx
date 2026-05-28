"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "How can I place an order?",
    a: "Simply browse products, add your favorite items to the cart, and proceed to checkout."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, Debit/Credit Cards, Net Banking, Wallets, and Cash on Delivery (COD)."
  },
  {
    q: "How long does delivery take?",
    a: "Orders are usually delivered within 4–8 business days depending on your location."
  },
  {
    q: "How can I track my order?",
    a: "Once your order is shipped, tracking details will be shared via email or SMS."
  },
  {
    q: "Can I return or exchange a product?",
    a: "Yes, products can be returned or exchanged within 7 days of delivery, subject to our Return & Refund Policy."
  },
  {
    q: "Do you offer Cash on Delivery (COD)?",
    a: "Yes, COD is available on selected orders and locations."
  },
  {
    q: "What should I do if I receive a damaged product?",
    a: "Please contact us within 48 hours of delivery with product photos and packaging video."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <div className="w-20 h-1 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition flex justify-between items-center"
              >
                {faq.q}
                <span className="text-yellow-500 text-xl">{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 text-gray-600 border-t border-gray-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mt-8 text-center">
          <p className="text-gray-600">Still have questions?</p>
          <Link href="/contact">
            <button className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}