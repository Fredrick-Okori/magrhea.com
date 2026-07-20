"use client";

import { motion } from "framer-motion";
import SplitReveal from "@/components/SplitReveal";

const steps = [
  {
    num: "01",
    title: "Discover",
    body: "Two weeks inside the business — its history, its ambition, and the raw material most brands smooth away.",
  },
  {
    num: "02",
    title: "Shape",
    body: "We build the system in the open: mark, type, colour, voice — reviewed with you at every real decision point.",
  },
  {
    num: "03",
    title: "Release",
    body: "The identity ships into the world, and we stay close through the first year while it's put under pressure.",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="scroll-section border-b border-ink/10 bg-paper px-6 py-[150px] text-ink md:px-10"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-20 max-w-[600px]">
          <SplitReveal
            as="h2"
            type="words"
            className="font-display text-[clamp(32px,4.6vw,54px)] font-medium leading-[1.05]"
          >
            How a project actually runs.
          </SplitReveal>
        </div>

        <div className="flex flex-col">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
              className={`group grid grid-cols-1 items-baseline gap-3 border-t border-ink/10 px-4 py-9 -mx-4 transition-colors duration-300 hover:bg-ink/[0.03] md:grid-cols-[100px_1fr_1fr] md:gap-8 md:py-[38px] ${
                i === steps.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="font-mono text-[13px] text-ink/60 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink">
                {step.num}
              </div>
              <h3 className="font-display text-2xl font-medium">{step.title}</h3>
              <p className="text-[15px] leading-[1.7] text-ink/60">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
