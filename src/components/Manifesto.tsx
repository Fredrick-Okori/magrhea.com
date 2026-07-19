"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "09", label: "Years in business" },
  { value: "64", label: "Projects shipped" },
  { value: "12", label: "Awards won" },
  { value: "20+", label: "Clients worldwide" },
];

export default function Manifesto() {
  return (
    <section id="studio" className="bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.8 }}
        className="font-display max-w-4xl text-3xl font-medium leading-tight tracking-tight md:text-5xl"
      >
        We&apos;re a small studio that partners closely with founders and
        creative leads to make work that feels{" "}
        <span className="italic">considered</span>, not decorative —
        design with a point of view, built to hold up under scrutiny.
      </motion.p>

      <div className="mt-20 grid grid-cols-2 gap-8 border-t border-paper/10 pt-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <div className="font-display text-4xl font-semibold text-paper md:text-5xl">
              {s.value}
            </div>
            <div className="mt-2 text-sm text-bone">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
