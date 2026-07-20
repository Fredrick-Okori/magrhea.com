"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ScrollSmoother is GSAP's own smooth-scroll driver — it integrates
    // natively with ScrollTrigger (no manual ticker/proxy wiring needed,
    // unlike third-party smooth-scroll libs). #smooth-wrapper/#smooth-content
    // are rendered in page.tsx around <main>/<Footer> only — fixed-position
    // UI (Navbar, Cursor, GrainOverlay) stays outside that tree, since a
    // `position: fixed` descendant of a transformed ScrollSmoother content
    // div would anchor to that div instead of the real viewport.
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.1,
      effects: false,
      normalizeScroll: true,
    });

    return () => {
      smoother.kill();
    };
  }, []);

  return null;
}
