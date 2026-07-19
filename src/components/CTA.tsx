"use client";

import { motion } from "framer-motion";
import SplitReveal from "@/components/SplitReveal";

export default function CTA() {
  return (
    <section
      id="contact"
      className="bg-paper px-6 py-[170px] text-center text-ink md:px-10 md:py-[150px]"
    >
      <div className="mx-auto max-w-[880px]">
        <SplitReveal
          as="h2"
          type="chars"
          stagger={0.012}
          className="font-display text-[clamp(36px,6.5vw,78px)] font-medium leading-[1.05] tracking-tight"
        >
          Got a brand with <em className="italic">something</em> to say?
        </SplitReveal>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.19, 1, 0.22, 1] }}
          className="mt-6 text-base text-ink/60"
        >
          Tell us what you&apos;re building. We reply within two days.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: 0.16, ease: [0.19, 1, 0.22, 1] }}
          className="mt-12"
        >
          <a
            href="mailto:hello@magrhea.studio"
            data-cursor-hover
            className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 font-mono text-[13px] uppercase tracking-[0.05em] text-paper transition-all duration-300 hover:-translate-y-1 hover:bg-ink/85"
          >
            hello@magrhea.studio
          </a>
        </motion.div>
      </div>
    </section>
  );
}
