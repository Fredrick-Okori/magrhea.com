"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const projectTypes = [
  { id: "brand", label: "Brand Identity & Systems" },
  { id: "digital", label: "Digital Product Design (UX/UI)" },
  { id: "motion", label: "Fullstack Web App Dev" },
];

const projectSizes = [
  { id: "mvp", label: "Early Stage MVP / Concept" },
  { id: "medium", label: "Midsize Refresh (Up to 15 views)" },
  { id: "enterprise", label: "Enterprise Ecosystem Blueprint" },
];

const designDirections = [
  { id: "clean", label: "Clean, minimal & utilitarian" },
  { id: "experimental", label: "High-fidelity interaction & motion" },
  { id: "brutalist", label: "Avant-garde, system-breaking" },
];

const timelines = [
  { id: "fast", label: "Accelerated (4-6 weeks)" },
  { id: "standard", label: "Standard (8-12 weeks)" },
  { id: "flexible", label: "Flexible Rolling Roadmap" },
];

export default function StartProjectSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [engagementType, setEngagementType] = useState<"fixed" | "retainer">("fixed");
  const [form, setForm] = useState({
    projectType: "",
    projectSize: "",
    creativity: "",
    timeline: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const selectOption = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section
      ref={sectionRef}
      id="start-project"
      className="mx-auto w-full max-w-[1440px] px-6 py-20 md:px-12 bg-paper grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 select-none text-ink overflow-hidden"
    >
      {/* LEFT COLUMN: Editorial Presentation */}
      <div className="flex flex-col justify-between py-2">
        <div>
          <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[0.92] tracking-tight text-ink">
            Start a<br />project
          </h2>
          <p className="mt-6 font-sans text-sm text-ink/60 leading-relaxed max-w-xs antialiased">
            Tell us about your objectives. We will generate a clear picture of execution phases, delivery timelines, and budget expectations.
          </p>
        </div>
        <div className="hidden lg:block font-mono text-[11px] text-ink/30 tracking-wide">
          MAGRHEA ONBOARDING ENGINE v1.2
        </div>
      </div>

      {/* RIGHT COLUMN: Field Canvas */}
      <div className="flex flex-col items-start w-full gap-6">
        
        {/* Pill Toggle Switch */}
        <div className="flex bg-[#f5f5f5] p-1.5 rounded-full border border-black/[0.02] w-fit relative z-10">
          <button
            onClick={() => setEngagementType("fixed")}
            className={`relative px-6 py-2.5 text-xs font-semibold tracking-wide rounded-full transition-colors duration-300 z-10 mix-blend-difference ${
              engagementType === "fixed" ? "text-paper" : "text-ink/40 hover:text-ink/70"
            }`}
          >
            Fixed Scope
            {engagementType === "fixed" && (
              <motion.div
                layoutId="activePillIndicator"
                className="absolute inset-0 bg-ink rounded-full -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
          
          <button
            onClick={() => setEngagementType("retainer")}
            className={`relative px-6 py-2.5 text-xs font-semibold tracking-wide rounded-full transition-colors duration-300 z-10 mix-blend-difference ${
              engagementType === "retainer" ? "text-paper" : "text-ink/40 hover:text-ink/70"
            }`}
          >
            Retainer Partnership
            {engagementType === "retainer" && (
              <motion.div
                layoutId="activePillIndicator"
                className="absolute inset-0 bg-ink rounded-full -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* Configuration Card Sheet Container with Horizontal Right-To-Left Sweep */}
        <div ref={cardRef} className="w-full relative min-h-[600px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={engagementType}
              // Configured to sweep in cleanly from the right side (+80px offset) and exit to the left (-80px offset)
              initial={{ opacity: 0, x: 80, scale: 0.99 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="w-full bg-[#fafafa] rounded-[28px] border border-black/[0.02] p-8 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.01)] overflow-hidden origin-center"
            >
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
                  {engagementType === "fixed" ? "Fixed Scope Project" : "Retainer Partnership"}
                </h3>
                <p className="mt-2 font-sans text-xs text-ink/50 leading-relaxed max-w-md">
                  {engagementType === "fixed" 
                    ? "Best suited for clearly mapped products, design systems, and visual transformations." 
                    : "Ideal for fast-moving startups looking for elastic design resources on tap."}
                </p>
              </div>

              {/* Form Fields Stack */}
              <div className="mt-12 flex flex-col gap-10">
                
                {/* FIELD 1: Project Type */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2 font-mono text-[10px] tracking-widest text-ink/30">
                    <span className="flex items-center gap-2"><b className="h-4 w-4 bg-ink/5 text-ink text-center rounded-sm flex items-center justify-center text-[9px]">1</b> METRIC</span>
                    <span>PROJECT TYPE</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {projectTypes.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => selectOption("projectType", opt.id)}
                        className={`relative px-5 py-3.5 rounded-xl text-xs font-medium border transition-all duration-200 overflow-hidden ${
                          form.projectType === opt.id
                            ? "border-ink text-paper bg-ink"
                            : "border-black/[0.06] bg-[#f2f2f2] text-ink/70 hover:border-black/20 hover:text-ink"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FIELD 2: Project Size */}
                <div className={`flex flex-col gap-4 transition-all duration-300 ${form.projectType ? "opacity-100" : "opacity-20 pointer-events-none filter blur-[1px]"}`}>
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2 font-mono text-[10px] tracking-widest text-ink/30">
                    <span className="flex items-center gap-2"><b className="h-4 w-4 bg-ink/5 text-ink text-center rounded-sm flex items-center justify-center text-[9px]">2</b> SCALE</span>
                    <span>PROJECT SIZE</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {projectSizes.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => selectOption("projectSize", opt.id)}
                        className={`px-5 py-3.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                          form.projectSize === opt.id
                            ? "border-ink text-paper bg-ink"
                            : "border-black/[0.06] bg-[#f2f2f2] text-ink/70 hover:border-black/20 hover:text-ink"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FIELD 3: Design Direction */}
                <div className={`flex flex-col gap-4 transition-all duration-300 ${form.projectSize ? "opacity-100" : "opacity-20 pointer-events-none filter blur-[1px]"}`}>
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2 font-mono text-[10px] tracking-widest text-ink/30">
                    <span className="flex items-center gap-2"><b className="h-4 w-4 bg-ink/5 text-ink text-center rounded-sm flex items-center justify-center text-[9px]">3</b> CRITERIA</span>
                    <span>VISUAL PROFILE</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {designDirections.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => selectOption("creativity", opt.id)}
                        className={`px-5 py-3.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                          form.creativity === opt.id
                            ? "border-ink text-paper bg-ink"
                            : "border-black/[0.06] bg-[#f2f2f2] text-ink/70 hover:border-black/20 hover:text-ink"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FIELD 4: Project Timeline */}
                <div className={`flex flex-col gap-4 transition-all duration-300 ${form.creativity ? "opacity-100" : "opacity-20 pointer-events-none filter blur-[1px]"}`}>
                  <div className="flex items-center justify-between border-b border-ink/5 pb-2 font-mono text-[10px] tracking-widest text-ink/30">
                    <span className="flex items-center gap-2"><b className="h-4 w-4 bg-ink/5 text-ink text-center rounded-sm flex items-center justify-center text-[9px]">4</b> HORIZON</span>
                    <span>PROJECT TIMELINE</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {timelines.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => selectOption("timeline", opt.id)}
                        className={`px-5 py-3.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                          form.timeline === opt.id
                            ? "border-ink text-paper bg-ink"
                            : "border-black/[0.06] bg-[#f2f2f2] text-ink/70 hover:border-black/20 hover:text-ink"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Callout Actions */}
              <div className="mt-14 pt-6 border-t border-ink/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-center md:text-left">
                <span className="font-sans text-[11px] text-ink/40 tracking-normal leading-relaxed max-w-xs">
                  Complete all fields to generate an optimized roadmap schedule and price estimate.
                </span>
                <button 
                  disabled={!form.timeline}
                  className={`w-full md:w-auto px-6 py-4 rounded-xl font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                    form.timeline 
                      ? "bg-ink text-paper hover:scale-[1.02] active:scale-[0.98]" 
                      : "bg-ink/10 text-ink/30 cursor-not-allowed"
                  }`}
                >
                  Analyze Configuration ↗
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}