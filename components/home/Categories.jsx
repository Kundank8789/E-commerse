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

  // State for touch/mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchCategories();
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    console.log("Categories loaded:", data);
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

  // Mouse events (for desktop)
  const onMouseDown = (e) => {
    if (isMobile) return; // Disable on mobile
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.pageX - outerRef.current.offsetLeft;
    scrollLeft.current = outerRef.current.scrollLeft;
    innerRef.current.style.animationPlayState = "paused";
    outerRef.current.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!isDragging.current || isMobile) return;
    e.preventDefault();
    dragMoved.current = true;
    const x = e.pageX - outerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    outerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    if (isMobile) return;
    isDragging.current = false;
    outerRef.current.style.cursor = "grab";
    innerRef.current.style.animationPlayState = "running";
    resetScrollIfNeeded();
  };

  const onMouseLeave = () => {
    if (isMobile) return;
    if (isDragging.current) {
      isDragging.current = false;
      outerRef.current.style.cursor = "grab";
      innerRef.current.style.animationPlayState = "running";
      resetScrollIfNeeded();
    }
  };

  // Touch events (for mobile)
  const onTouchStart = (e) => {
    dragMoved.current = false;
    const touch = e.touches[0];
    startX.current = touch.pageX - outerRef.current.offsetLeft;
    scrollLeft.current = outerRef.current.scrollLeft;
    innerRef.current.style.animationPlayState = "paused";
  };

  const onTouchMove = (e) => {
    e.preventDefault(); // Prevent page scroll while dragging
    dragMoved.current = true;
    const touch = e.touches[0];
    const x = touch.pageX - outerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    outerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onTouchEnd = () => {
    innerRef.current.style.animationPlayState = "running";
    resetScrollIfNeeded();
  };

  // For mobile: pause animation on touch start
  const handleTouchStart = (e) => {
    onTouchStart(e);
  };

  return (
    <section className="bg-white text-black py-8 md:py-16 px-4 md:px-0">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-5xl font-bold tracking-wide">
          SHOP BY CATEGORY
        </h2>
        <div className="w-20 md:w-28 h-[3px] bg-yellow-600 mx-auto mt-3 md:mt-4 rounded-full" />
      </div>

      <div
        ref={outerRef}
        className="w-full overflow-x-scroll py-3 md:py-4 select-none hide-scroll touch-pan-x"
        style={{ 
          cursor: isMobile ? "default" : "grab",
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          ref={innerRef} 
          className={`flex gap-4 md:gap-10 ${
            !isMobile ? 'animate-scroll' : ''
          }`}
          style={{
            animationDuration: isMobile ? '0s' : '30s',
            animationPlayState: isMobile ? 'paused' : 'running'
          }}
        >
          {loopedCategories.map((cat, index) => {
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
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full overflow-hidden border border-gray-200 shadow-md bg-gray-100 flex items-center justify-center">
                  {hasImage ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl md:text-7xl group-hover:scale-110 transition duration-500">
                      {displayIcon}
                    </span>
                  )}
                </div>
                <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg font-medium text-center group-hover:text-yellow-600 transition capitalize px-1">
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
        
        /* Only apply animation on desktop */
        @media (min-width: 768px) {
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
        }
        
        /* Mobile optimizations */
        @media (max-width: 767px) {
          .hide-scroll {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </section>
  );
}