"use client";

import { motion } from "framer-motion";
import ParallaxImage from "@/components/ParallaxImage";

export default function Testimonial() {
  return (
    <section className="scroll-section relative overflow-hidden bg-ink px-6 py-[150px] text-paper md:px-10">
      <ParallaxImage
        src="/accent-loop-wide.png"
        speed={-0.25}
        className="pointer-events-none absolute -left-[15%] top-1/2 z-0 h-[60%] w-[70%] -translate-y-1/2 opacity-[0.09]"
      />

      <div className="relative z-10 mx-auto max-w-[900px] text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="font-display text-[clamp(24px,3.4vw,38px)] font-normal italic leading-[1.4] tracking-tight"
        >
          &ldquo;Magrhea didn&apos;t just design our identity — they told us
          what it was before we could say it ourselves. Every review felt
          less like a pitch and more like they&apos;d been inside the
          business for years.&rdquo;
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="mt-9 font-mono text-xs uppercase tracking-[0.12em] text-bone"
        >
          Elena Marsh — Founder, Petra Systems
        </motion.div>
      </div>
    </section>
  );
}
