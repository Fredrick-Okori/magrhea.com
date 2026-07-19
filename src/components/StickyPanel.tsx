"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StickyPanel({
  children,
  zIndex,
}: {
  children: ReactNode;
  zIndex: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const panel = panelRef.current;
    const shadow = shadowRef.current;
    if (!container || !panel || !shadow) return;

    const ctx = gsap.context(() => {
      // Pin this panel to the viewport for its own height, then — during
      // the final viewport-height of that pin — tilt it back in 3D like a
      // book cover lifting away, while the next (higher z-index) panel
      // slides up beneath it. `pinSpacing: false` deliberately lets the
      // next panel overlap rather than reserving extra scroll room.
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        pin: panel,
        pinSpacing: false,
      });

      gsap.set(panel, { transformPerspective: 1600, transformOrigin: "top center" });

      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "bottom bottom",
          end: "bottom top",
          scrub: 0.3,
        },
      })
        .to(panel, { rotationX: -20, y: -70, scale: 0.95, ease: "none" }, 0)
        .to(shadow, { opacity: 0.4, ease: "none" }, 0);
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ zIndex }}>
      <div ref={panelRef} className="relative">
        {children}
        <div
          ref={shadowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink opacity-0"
        />
      </div>
    </div>
  );
}
