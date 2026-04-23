"use client";

import { useEffect, useRef } from "react";

/** Renders 180 randomly-placed twinkling stars into a fixed overlay. */
export default function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Avoid re-populating on hot-reload
    if (container.childElementCount > 0) return;

    for (let i = 0; i < 180; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2.5 + 0.5;
      star.className = "star";
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        --dur: ${(Math.random() * 3 + 2).toFixed(1)}s;
        --delay: ${(Math.random() * 4).toFixed(1)}s;
        opacity: ${(Math.random() * 0.5 + 0.1).toFixed(2)};
      `;
      container.appendChild(star);
    }
  }, []);

  return <div ref={containerRef} className="stars-layer" aria-hidden="true" />;
}
