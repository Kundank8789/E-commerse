"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
  y = 30,
  once = true,
  className = "",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{
        transform: visible ? "translateY(0px)" : `translateY(${y}px)`,
        opacity: visible ? 1 : 0,
        transition: `all 600ms ease ${delay}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}