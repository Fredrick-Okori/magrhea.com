"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const offices = [{ city: "Addis Ababa", tz: "Africa/Addis_Ababa" }];

const socials = ["Instagram", "LinkedIn", "X", "Behance"];

function useClock(tz: string) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: tz,
        }).format(new Date())
      );
    };
    update();
    const id = setInterval(update, 1000 * 30);
    return () => clearInterval(id);
  }, [tz]);

  return time;
}

function OfficeRow({ city, tz }: { city: string; tz: string }) {
  const time = useClock(tz);
  return (
    <div className="flex items-baseline justify-between border-b border-paper/10 py-4 text-sm md:text-base">
      <span>{city}</span>
      <span className="text-bone">{time}</span>
    </div>
  );
}

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  // 1. Track the exact scroll boundary progression of the footer frame
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // 2. Map the scroll progress to a clipping percentage (revealing from the top down)
  const rawClip = useTransform(scrollYProgress, [0, 0.95], [0, 100]);
  
  // 3. Smooth the path with a slightly dampened spring for liquid physical feedback
  const smoothClip = useSpring(rawClip, {
    stiffness: 140,
    damping: 22,
    mass: 0.6,
  });

  // 4. Interpolate the numerical path into a valid CSS polygon rule
  const clipPath = useTransform(
    smoothClip,
    (value) => `polygon(0% 0%, 100% 0%, 100% ${value}%, 0% ${value}%)`
  );

  return (
    <motion.footer
      ref={containerRef}
      style={{ clipPath }}
      className="bg-ink px-6 pb-8 pt-16 text-paper md:px-10 will-change-[clip-path]"
    >
      <div className="grid grid-cols-1 gap-12 border-t border-paper/10 pt-14 md:grid-cols-3">
        <div>
          <span className="font-display text-2xl font-medium tracking-tight">
            MAGRHEA<span className="text-bone">®</span>
          </span>
          <p className="mt-4 max-w-xs text-sm text-bone">
            An independent studio for brands, digital products and motion.
            Addis Ababa, Ethiopia.
          </p>
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-bone">
            Studio
          </span>
          <div className="mt-4">
            {offices.map((o) => (
              <OfficeRow key={o.city} city={o.city} tz={o.tz} />
            ))}
          </div>
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-bone">
            Elsewhere
          </span>
          <div className="mt-4 flex flex-col gap-3">
            {socials.map((s) => (
              <a
                key={s}
                href="#"
                data-cursor-hover
                className="w-fit text-sm transition-colors hover:text-paper"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-paper/10 pt-6 font-mono text-xs text-bone md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} Magrhea. All rights reserved.</span>
        <a href="#top" data-cursor-hover className="hover:text-paper">
          Back to top ↑
        </a>
      </div>
    </motion.footer>
  );
}