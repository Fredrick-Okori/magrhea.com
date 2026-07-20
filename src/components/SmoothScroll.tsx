"use client";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export default function SmoothScroll() {
  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      smooth: 1,
      effects: true,
    });

    const sections = gsap.utils.toArray(".scroll-section");

    sections.forEach((section, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section as gsap.DOMTarget,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          scrub: true,
        },
      });

      tl.fromTo(
        section as gsap.DOMTarget,
        { yPercent: 0 },
        { yPercent: -100, ease: "none" }
      );
    });

    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
