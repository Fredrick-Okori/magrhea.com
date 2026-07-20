"use client";

import { useEffect } from "react";

export default function MouseTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMove = (e: MouseEvent) => {
      // Direct raw DOM variables bypass React execution pipelines completely
      document.documentElement.style.setProperty("--raw-mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--raw-my", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return null; // Purely functional, returns no markup
}