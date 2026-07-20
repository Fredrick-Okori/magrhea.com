"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const clients = [
  "Corvin Group",
  "Halden & Rye",
  "Marrow Studio",
  "Petra Systems",
  "Vantage Post",
  "Loom & Co",
  "Frameworks",
  "Nordbridge",
];

function ClientRow() {
  return (
    <div className="flex shrink-0 items-center gap-x-12 pr-12">
      {clients.map((client) => (
        <span
          key={client}
          className="font-display whitespace-nowrap text-xl text-ink/35 transition-colors duration-300 hover:text-ink md:text-2xl"
        >
          {client}
        </span>
      ))}
    </div>
  );
}

export default function Clients() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      const onEnter = () => tween.timeScale(0.25);
      const onLeave = () => tween.timeScale(1);
      track.addEventListener("mouseenter", onEnter);
      track.addEventListener("mouseleave", onLeave);

      return () => {
        track.removeEventListener("mouseenter", onEnter);
        track.removeEventListener("mouseleave", onLeave);
      };
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section className="scroll-section overflow-hidden border-b border-ink/10 bg-paper py-16 text-ink">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 font-mono text-xs uppercase tracking-[0.15em] text-ink/50"
        >
          Trusted by teams building for the long run
        </motion.p>
      </div>

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex w-max">
          <ClientRow />
          <ClientRow />
        </div>
      </div>
    </section>
  );
}
