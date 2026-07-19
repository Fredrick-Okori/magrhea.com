"use client";

import { useEffect, useRef } from "react";

export default function GrainOverlay() {
  const turbRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let seed = 0;
    let frame: ReturnType<typeof setTimeout>;

    const animate = () => {
      seed = (seed + 1) % 100;
      turbRef.current?.setAttribute("seed", String(seed));
      frame = setTimeout(animate, 120);
    };
    animate();

    return () => clearTimeout(frame);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.05] mix-blend-overlay"
    >
      <svg className="h-full w-full">
        <filter id="grainFilter">
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainFilter)" />
      </svg>
    </div>
  );
}
