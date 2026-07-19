"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function WorkTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const ctx = gsap.context(() => {
      gsap.to(title, {
        x: "-=200",
        ease: "none",
        scrollTrigger: {
          trigger: title,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, title);
    return () => ctx.revert();
  }, []);

  return (
    <h2
      ref={titleRef}
      className="font-display text-[clamp(32px,4.6vw,54px)] font-medium leading-[1.05]"
    >
      Selected work.
    </h2>
  );
}
