"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxImage({
  src,
  className,
  speed = 0.25,
  mask = false,
  maskColorClassName = "bg-ink",
  sizes = "50vw",
}: {
  src: string;
  className?: string;
  speed?: number;
  mask?: boolean;
  maskColorClassName?: string;
  sizes?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const ctx = gsap.context(() => {
      gsap.to(inner, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <div ref={innerRef} className="relative h-full w-full">
        {mask ? (
          <div
            className={`absolute inset-0 ${maskColorClassName}`}
            style={{
              maskImage: `url(${src})`,
              maskSize: "contain",
              maskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskImage: `url(${src})`,
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
        ) : (
          <Image src={src} alt="" fill sizes={sizes} className="object-contain" />
        )}
      </div>
    </div>
  );
}
