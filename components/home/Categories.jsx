"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragMoved = useRef(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    console.log("Categories loaded:", data); // Debug: Check what data has image
    setCategories(data);
  };

  const loopedCategories = categories.length > 0
    ? [...categories, ...categories, ...categories]
    : [];

  useEffect(() => {
    if (!outerRef.current || loopedCategories.length === 0) return;
    const third = outerRef.current.scrollWidth / 3;
    outerRef.current.scrollLeft = third;
  }, [loopedCategories.length]);

  const resetScrollIfNeeded = () => {
    const el = outerRef.current;
    if (!el) return;
    const third = el.scrollWidth / 3;
    if (el.scrollLeft < third * 0.3 || el.scrollLeft > third * 2) {
      el.scrollLeft = third;
    }
  };

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.pageX - outerRef.current.offsetLeft;
    scrollLeft.current = outerRef.current.scrollLeft;
    innerRef.current.style.animationPlayState = "paused";
    outerRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    dragMoved.current = true;
    const x = e.pageX - outerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    outerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    outerRef.current.style.cursor = "grab";
    innerRef.current.style.animationPlayState = "running";
    resetScrollIfNeeded();
  };

  const onMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      outerRef.current.style.cursor = "grab";
      innerRef.current.style.animationPlayState = "running";
      resetScrollIfNeeded();
    }
  };

  const onTouchStart = (e) => {
    dragMoved.current = false;
    startX.current = e.touches[0].pageX - outerRef.current.offsetLeft;
    scrollLeft.current = outerRef.current.scrollLeft;
    innerRef.current.style.animationPlayState = "paused";
  };

  const onTouchMove = (e) => {
    dragMoved.current = true;
    const x = e.touches[0].pageX - outerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    outerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onTouchEnd = () => {
    innerRef.current.style.animationPlayState = "running";
    resetScrollIfNeeded();
  };

  return (
    <section className="bg-white text-black py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-wide">
          SHOP BY CATEGORY
        </h2>
        <div className="w-28 h-[3px] bg-yellow-600 mx-auto mt-4 rounded-full" />
      </div>

      <div
        ref={outerRef}
        className="w-full overflow-x-scroll py-4 select-none hide-scroll"
        style={{ cursor: "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div ref={innerRef} className="animate-scroll flex gap-6 md:gap-10">
          {loopedCategories.map((cat, index) => {
            // Determine what to show: image > icon > default emoji
            const hasImage = cat.image && cat.image !== "";
            const displayIcon = cat.icon || "📦";
            
            return (
              <div
                key={`${cat._id}-${index}`}
                onClick={() => {
                  if (!dragMoved.current) {
                    router.push(`/products?category=${cat._id}`);
                  }
                }}
                className="flex flex-col items-center cursor-pointer group shrink-0"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-gray-200 shadow-md bg-gray-100 flex items-center justify-center">
                  {hasImage ? (
                    // Show uploaded image
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    // Show emoji/icon
                    <span className="text-6xl md:text-7xl group-hover:scale-110 transition duration-500">
                      {displayIcon}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-base md:text-lg font-medium text-center group-hover:text-yellow-600 transition capitalize">
                  {cat.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}