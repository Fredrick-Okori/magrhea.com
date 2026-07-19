"use client";

import { motion } from "framer-motion";
import SplitReveal from "@/components/SplitReveal";
import ParallaxImage from "@/components/ParallaxImage";

export default function Philosophy() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-paper px-6 py-[170px] text-ink md:px-10 md:py-[150px]">
      <ParallaxImage
        src="/accent-loop-large.png"
        mask
        maskColorClassName="bg-ink"
        speed={0.3}
        className="pointer-events-none absolute -right-[10%] -top-[15%] z-0 h-[70%] w-[55%] opacity-[0.06]"
      />

      <div className="relative z-10 mx-auto max-w-[880px] text-center">
        <SplitReveal
          as="p"
          type="words"
          stagger={0.025}
          className="font-display text-[clamp(28px,4.2vw,50px)] font-normal leading-[1.25] tracking-tight"
        >
          Trend is easy to buy. <em className="italic">Conviction</em> has to
          be built — from the real material of who you are.
        </SplitReveal>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.19, 1, 0.22, 1] }}
          className="mx-auto mt-7 max-w-[560px] text-base leading-[1.7] text-ink/60"
        >
          Most identity work sands a brand down until it&apos;s inoffensive.
          We do the opposite — we find the specific, unrepeatable point of
          view in a business and build the whole system around it.
        </motion.p>
      </div>
    </section>
  );
}
