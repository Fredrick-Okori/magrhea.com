"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function SplitReveal({
  children,
  as = "div",
  className,
  type = "words",
  stagger = 0.03,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  type?: "words" | "chars" | "lines";
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let split: SplitText;
    const ctx = gsap.context(() => {
      split = SplitText.create(el, {
        type,
        autoSplit: true,
        mask: type === "lines" ? "lines" : undefined,
      });
      const targets =
        type === "chars" ? split.chars : type === "lines" ? split.lines : split.words;

      gsap.from(targets, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [type, stagger]);

  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
