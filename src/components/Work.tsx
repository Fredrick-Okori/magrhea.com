"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { categories, projects, type Category } from "@/lib/projects";
import ParallaxImage from "./ParallaxImage";
import WorkTitle from "./WorkTitle";

gsap.registerPlugin(Flip);

const filters: ("All" | Category)[] = ["All", ...categories];

export default function Work() {
  const [active, setActive] = useState<"All" | Category>("All");
  const gridRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const visible = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((p) => p.category === active),
    [active]
  );

  const movePill = (target: string) => {
    const pill = pillRef.current;
    const btn = btnRefs.current[target];
    const parent = pill?.parentElement;
    if (!pill || !btn || !parent) return;
    const parentRect = parent.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    pill.style.left = `${btnRect.left - parentRect.left}px`;
    pill.style.top = `${btnRect.top - parentRect.top}px`;
    pill.style.width = `${btnRect.width}px`;
    pill.style.height = `${btnRect.height}px`;
  };

  useLayoutEffect(() => {
    movePill("All");
  }, []);

  const handleFilter = (f: "All" | Category) => {
    if (f === active) return;

    const pillState = pillRef.current ? Flip.getState(pillRef.current) : null;
    const gridState = gridRef.current
      ? Flip.getState(gridRef.current.children)
      : null;

    flushSync(() => setActive(f));

    if (pillState) {
      movePill(f);
      Flip.from(pillState, { duration: 0.45, ease: "power3.out" });
    }

    if (gridState && gridRef.current) {
      Flip.from(gridState, {
        duration: 0.6,
        scale: true,
        ease: "power2.inOut",
        absolute: true,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
          ),
        onLeave: (elements) =>
          gsap.to(elements, {
            opacity: 0,
            scale: 0.85,
            duration: 0.3,
            ease: "power2.in",
          }),
      });
    }
  };

  return (
    <section
      id="work"
      className="border-b border-ink/10 bg-paper px-6 py-[150px] text-ink md:px-10"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[70px] flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-baseline gap-3">
            <WorkTitle />
            <span className="font-mono text-xs text-ink/40">
              {String(visible.length).padStart(2, "0")}
            </span>
          </div>

          <div className="relative flex flex-wrap gap-1 rounded-full border border-ink/10 p-1">
            <div
              ref={pillRef}
              aria-hidden
              className="absolute rounded-full bg-ink"
              style={{ left: 4, top: 4, width: 0, height: 0 }}
            />
            {filters.map((f) => (
              <button
                key={f}
                ref={(el) => {
                  btnRefs.current[f] = el;
                }}
                type="button"
                data-cursor-hover
                onClick={() => handleFilter(f)}
                className={`relative z-10 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.05em] transition-colors duration-300 ${
                  active === f
                    ? "text-paper"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          ref={gridRef}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className="relative grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {visible.map((project) => (
            <a
              key={project.slug}
              href="#contact"
              data-cursor-hover
              data-cursor-text="View"
              className="group relative block aspect-[4/3] cursor-none overflow-hidden rounded-md"
            >
              <ParallaxImage
                src={project.image}
                className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/5 to-transparent" />

              <div className="absolute inset-x-7 bottom-6 z-10 flex items-end justify-between gap-4">
                <h3 className="font-display text-2xl font-medium text-paper">
                  {project.name}
                </h3>
                <span className="translate-y-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {project.category} — {project.year}
                </span>
              </div>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
