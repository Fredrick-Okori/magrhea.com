"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "How long does a typical project take?",
    a: "Most identity projects run six to ten weeks from kickoff to launch. Larger systems that include digital product work usually run twelve to sixteen. We'll give you a real timeline in the first call, not a range designed to sound safe.",
  },
  {
    q: "Do you work with early-stage founders?",
    a: "Yes, alongside more established teams. What matters isn't your stage — it's whether there's a real point of view underneath the business worth building a system around.",
  },
  {
    q: "What do you need from us to get started?",
    a: "Access to the people who actually know the business — founders, early customers, whoever holds the real history. Decks and mood boards are optional. Candor isn't.",
  },
  {
    q: "Can you work with our existing brand instead of starting over?",
    a: "Often, yes. Some projects are a full rebuild; more are an evolution — keeping what already works and rebuilding the parts that don't hold up anymore.",
  },
  {
    q: "Do you take on retained or ongoing work?",
    a: "Selectively. A handful of clients keep us on for quarterly reviews and new campaign work once the core system ships. We'll talk about it once the first project is done, not before.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-ink/10 bg-paper px-6 py-[150px] text-ink md:px-10">
      <div className="mx-auto max-w-[880px]">
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="font-display mb-16 text-[clamp(32px,4.6vw,54px)] font-medium leading-[1.05]"
        >
          Questions, answered plainly.
        </motion.h2>

        <div className="flex flex-col">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
                className={`border-t border-ink/10 ${
                  i === faqs.length - 1 ? "border-b" : ""
                }`}
              >
                <button
                  type="button"
                  data-cursor-hover
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-7 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-xl font-medium md:text-2xl">
                    {item.q}
                  </span>
                  <span
                    className={`relative h-4 w-4 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink" />
                    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[640px] pb-8 text-[15px] leading-[1.7] text-ink/60">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
