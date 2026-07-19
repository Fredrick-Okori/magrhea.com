"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "@/components/SplitReveal";

gsap.registerPlugin(ScrollTrigger);

export default function Visual({
  src,
  eyebrow,
  heading,
}: {
  src: string;
  eyebrow: string;
  heading: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1.15, yPercent: -8 },
        {
          scale: 1,
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[80vh] items-center justify-center overflow-hidden bg-ink text-paper"
    >
      <div ref={imgRef} className="absolute inset-0">
        <Image src={src} alt="" fill className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/55" />

      <div className="relative z-10 mx-auto max-w-[880px] px-6 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-bone">
          {eyebrow}
        </p>
        <SplitReveal
          as="h2"
          type="words"
          className="font-display text-[clamp(28px,5vw,58px)] font-medium leading-[1.1] text-paper"
        >
          {heading}
        </SplitReveal>
      </div>
    </section>
  );
}
