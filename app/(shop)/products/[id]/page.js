"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Truck, RefreshCw, Shield, Heart, Share2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
        
        // ✅ Set initial quantity to min order quantity
        if (data.minOrderQuantity) {
          setQty(data.minOrderQuantity);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  // ✅ Quantity handlers with min/max limits
  const increaseQty = () => {
    const maxQty = Math.min(product?.maxOrderQuantity || 5, product?.stock || 0);
    if (qty < maxQty) {
      setQty(qty + 1);
    } else {
      toast.error(`Maximum ${maxQty} units allowed per order`);
    }
  };

  const decreaseQty = () => {
    const minQty = product?.minOrderQuantity || 1;
    if (qty > minQty) {
      setQty(qty - 1);
    } else {
      toast.error(`Minimum ${minQty} unit required`);
    }
  };

  const handleAddToCart = () => {
    if (product?.stock === 0) {
      toast.error("Out of stock!");
      return;
    }
    
    // ✅ Validate quantity limits
    const minQty = product?.minOrderQuantity || 1;
    const maxQty = Math.min(product?.maxOrderQuantity || 5, product?.stock || 0);
    
    if (qty < minQty) {
      toast.error(`Minimum ${minQty} unit required`);
      return;
    }
    if (qty > maxQty) {
      toast.error(`Maximum ${maxQty} units allowed`);
      return;
    }
    
    for (let i = 0; i < qty; i++) {
      addToCart({
        ...product,
        selectedSize,
        selectedColor,
      });
    }
    setShowPopup(true);
    toast.success(`Added ${qty} item(s) to cart!`);
    setTimeout(() => {
      setShowPopup(false);
    }, 2500);
  };

  const handleBuyNow = () => {
    if (product?.stock === 0) {
      toast.error("Out of stock!");
      return;
    }
    
    // ✅ Validate quantity limits
    const minQty = product?.minOrderQuantity || 1;
    const maxQty = Math.min(product?.maxOrderQuantity || 5, product?.stock || 0);
    
    if (qty < minQty) {
      toast.error(`Minimum ${minQty} unit required`);
      return;
    }
    if (qty > maxQty) {
      toast.error(`Maximum ${maxQty} units allowed`);
      return;
    }
    
    for (let i = 0; i < qty; i++) {
      addToCart({
        ...product,
        selectedSize,
        selectedColor,
      });
    }
    router.push("/checkout");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const calculateDiscount = () => {
    if (product?.mrp && product?.price && product.mrp > product.price) {
      return Math.round(((product.mrp - product.price) / product.mrp) * 100);
    }
    return 0;
  };

  const isPremium = product?.price > 2000 || product?.isPremium;
  const discount = calculateDiscount();
  const isOutOfStock = product?.stock === 0;
  const images = product?.images || [];

  // Generate GOLD stars
  const renderStars = (rating = 5) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
      );
    }
    for (let i = rating; i < 5; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-gray-300" />
      );
    }
    return stars;
  };

  // Parse description to preserve formatting from admin
  const formatDescription = (text) => {
    if (!text) return "No description available";
    
    const lines = text.split("\n");
    
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={index} />;
      
      if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const cleanText = trimmed.replace(/^[•\-\*]\s*/, "");
        return (
          <div key={index} className="flex items-start gap-2 mb-1">
            <span className="text-yellow-500 mt-0.5">✦</span>
            <span>{cleanText}</span>
          </div>
        );
      }
      
      return <p key={index} className="mb-2">{trimmed}</p>;
    });
  };

  const fullDescription = product?.description || "No description available";
  const descriptionWords = fullDescription.split(" ").length;
  const hasMoreContent = descriptionWords > 30;
  
  const getShortDescription = () => {
    const words = fullDescription.split(" ");
    if (words.length <= 30) return fullDescription;
    return words.slice(0, 30).join(" ") + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">Product not found</p>
      </div>
    );
  }

  const minQty = product?.minOrderQuantity || 1;
  const maxQty = Math.min(product?.maxOrderQuantity || 5, product?.stock || 0);
  const shippingCost = product?.shippingCost || 0;

  return (
    <div className="min-h-screen bg-white py-8 px-4 md:px-8">

      {/* POPUP */}
      {showPopup && (
        <div className="fixed top-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle size={20} />
          Added to cart successfully
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT SIDE - IMAGE */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden">
            <div className="relative">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {isOutOfStock ? (
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">Out of Stock</span>
                ) : (
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">In Stock</span>
                )}
                {isPremium && (
                  <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-semibold">PREMIUM</span>
                )}
              </div>
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                  {discount}% OFF
                </div>
              )}
              
              {/* Main Image */}
              <div className="flex items-center justify-center p-8">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-auto object-contain max-h-[450px]"
                  />
                ) : (
                  <div className="w-full h-[300px] flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto border-t border-gray-200">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === idx ? "border-yellow-500" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE - PRODUCT INFO */}
          <div className="flex flex-col space-y-4">
            
            {/* Category */}
            <p className="text-sm uppercase text-gray-500">
              {product.categories?.[0]?.name || "PREMIUM COLLECTION"}
            </p>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-medium text-gray-800">
              {product.name}
            </h1>

            {/* Stars - GOLD COLOR */}
            <div className="flex items-center gap-1">
              {renderStars()}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-black">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Save ₹{product.mrp - product.price}
                  </span>
                </>
              )}
            </div>

            {/* ✅ Shipping Cost Display */}
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-yellow-500" />
              <span className="text-sm text-gray-600">
                Shipping: {shippingCost > 0 ? `₹${shippingCost}` : 'Free'}
              </span>
            </div>

            {/* Description */}
            <div>
              <p className="font-medium text-gray-800 mb-2">Product Details:</p>
              <div className="text-sm text-gray-600">
                {!showFullDescription ? (
                  <>
                    <div>{formatDescription(getShortDescription())}</div>
                    {hasMoreContent && (
                      <button
                        onClick={() => setShowFullDescription(true)}
                        className="text-yellow-600 text-sm font-medium hover:underline mt-2 inline-flex items-center gap-1"
                      >
                        ↓ See More ({descriptionWords - 30}+ more words)
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div>{formatDescription(fullDescription)}</div>
                    <button
                      onClick={() => setShowFullDescription(false)}
                      className="text-yellow-600 text-sm font-medium hover:underline mt-2 inline-flex items-center gap-1"
                    >
                      ↑ See Less
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Size, Color, Quantity - Side by Side */}
            <div className="grid grid-cols-3 gap-3">
              {product.sizes?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Size</p>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 rounded-full border text-xs transition ${
                          selectedSize === size
                            ? "bg-black text-white border-black"
                            : "border-gray-300 text-gray-700 hover:border-yellow-500"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Color</p>
                  <div className="flex flex-wrap gap-1">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1 rounded-full border text-xs transition ${
                          selectedColor === color
                            ? "bg-black text-white border-black"
                            : "border-gray-300 text-gray-700 hover:border-yellow-500"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ Quantity with Min/Max Display */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Qty <span className="text-gray-400 font-normal">(Min: {minQty})</span>
                </p>
                <div className="flex items-center border border-gray-300 rounded-full w-fit">
                  <button
                    onClick={decreaseQty}
                    disabled={qty <= minQty || isOutOfStock}
                    className={`px-3 py-1 text-lg rounded-l-full ${
                      qty <= minQty || isOutOfStock ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                  >
                    -
                  </button>
                  <span className="px-3 text-sm min-w-[40px] text-center">{qty}</span>
                  <button
                    onClick={increaseQty}
                    disabled={qty >= maxQty || isOutOfStock || maxQty === 0}
                    className={`px-3 py-1 text-lg rounded-r-full ${
                      qty >= maxQty || isOutOfStock || maxQty === 0 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'
                    }`}
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Min: {minQty} | Max: {maxQty > 0 ? maxQty : 'Unlimited'}
                </p>
              </div>
            </div>

            {/* ✅ Variations Display */}
            {product?.variations?.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-700 mb-1">Available Variations</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variations.slice(0, 4).map((variation, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {variation.size} / {variation.color} {variation.stock > 0 ? `(${variation.stock})` : '❌'}
                    </span>
                  ))}
                  {product.variations.length > 4 && (
                    <span className="text-xs text-gray-400">+{product.variations.length - 4} more</span>
                  )}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}></div>
              <span className={`text-sm ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                {isOutOfStock ? "Out of Stock" : `${product.stock} units left`}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 rounded-full font-semibold transition ${
                  isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : `Add to Cart — ₹${product.price * qty}`}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-3 rounded-full font-semibold transition border-2 ${
                  isOutOfStock
                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "border-black hover:bg-black hover:text-white"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "Buy Now"}
              </button>
            </div>

            {/* Share & Wishlist */}
            <div className="flex gap-4">
              <button onClick={handleShare} className="flex items-center gap-1 text-gray-500 text-sm hover:text-gray-700">
                <Share2 size={14} /> Share
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center gap-1 text-sm transition ${isWishlisted ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
              >
                <Heart size={14} className={isWishlisted ? "fill-red-500" : ""} /> Wishlist
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
              <div className="text-center">
                <Truck size={14} className="text-yellow-500 mx-auto" />
                <p className="text-[10px] text-gray-500">Free Shipping</p>
                <p className="text-[8px] text-gray-400">on ₹499+</p>
              </div>
              <div className="text-center">
                <RefreshCw size={14} className="text-yellow-500 mx-auto" />
                <p className="text-[10px] text-gray-500">Easy Returns</p>
                <p className="text-[8px] text-gray-400">7 days</p>
              </div>
              <div className="text-center">
                <Shield size={14} className="text-yellow-500 mx-auto" />
                <p className="text-[10px] text-gray-500">Secure Payment</p>
                <p className="text-[8px] text-gray-400">100% secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}