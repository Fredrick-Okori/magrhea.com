"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function KineticHeading({
  children,
  as = "h2",
  className,
  distance = 200,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        x: `-=${distance}`,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [distance]);

  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
