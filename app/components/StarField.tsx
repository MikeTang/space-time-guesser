"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a twinkling star field:
 * - 200 regular stars (small, low-opacity)
 * - 20 "hero" stars (larger, brighter glow, distinct twinkle)
 *
 * Both layers use CSS custom properties (--dur, --delay) so every star
 * animates independently, producing the deep-space shimmer effect from
 * the design mockup.
 */
export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Avoid re-populating on hot-reload
    if (container.childElementCount > 0) return;

    // Regular stars
    for (let i = 0; i < 200; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2 + 0.5; // 0.5–2.5 px
      star.className = "star";
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        --dur: ${(Math.random() * 3 + 2).toFixed(1)}s;
        --delay: ${(Math.random() * 5).toFixed(1)}s;
        opacity: ${(Math.random() * 0.4 + 0.1).toFixed(2)};
      `;
      container.appendChild(star);
    }

    // Hero stars — brighter, with subtle glow
    for (let i = 0; i < 20; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 1.5 + 2.5; // 2.5–4 px
      star.className = "star-hero";
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        --dur: ${(Math.random() * 2 + 3).toFixed(1)}s;
        --delay: ${(Math.random() * 6).toFixed(1)}s;
        opacity: 0.6;
      `;
      container.appendChild(star);
    }
  }, []);

  return <div ref={containerRef} className="stars-layer" aria-hidden="true" />;
}
