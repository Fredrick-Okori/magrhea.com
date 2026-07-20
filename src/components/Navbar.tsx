"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import { useScramble } from "@/lib/useScramble";

const links = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Process", href: "#process" },
];

function NavLink({ label, href }: { label: string; href: string }) {
  const { display, scramble } = useScramble(label);

  return (
    <a
      href={href}
      data-cursor-hover
      onMouseEnter={scramble}
      className="group relative pb-1 text-ink transition-opacity hover:opacity-100"
    >
      {display}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-6 py-6 md:px-10 md:py-7">
        <div className="flex items-center justify-between text-paper">
          {/* Main Logo Mark */}
          <a
            href="#top"
            data-cursor-hover
            className="font-display text-lg font-medium tracking-tight text-paper"
          >
            MAGRHEA<span>®</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-9 text-sm tracking-wide md:flex">
            {links.map((l) => (
              <NavLink key={l.label} label={l.label} href={l.href} />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Primary Action Button (bg-ink applied) */}
            <Magnetic strength={0.4}>
              <a
                href="#contact"
                data-cursor-hover
                className="hidden rounded-full bg-ink px-[20px] py-[10px] font-mono text-xs uppercase tracking-[0.06em] text-paper transition-all duration-300 hover:bg-ink/90 sm:inline-block"
              >
                Start a project
              </a>
            </Magnetic>

            {/* Menu Trigger Button (bg-ink applied) */}
            <button
              type="button"
              data-cursor-hover
              onClick={() => setOpen(true)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-ink text-paper transition-all duration-300 hover:bg-ink/90"
              aria-label="Open menu"
            >
              <span className="flex flex-col items-center gap-[4px]">
                <span className="h-px w-4 bg-paper" />
                <span className="h-px w-4 bg-paper" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] as const }}
            className="fixed inset-0 z-[65] flex flex-col bg-ink px-6 py-6 md:px-10 md:py-8"
          >
            <div className="flex items-center justify-between text-paper">
              <span className="font-display text-lg font-medium tracking-tight">
                MAGRHEA<span>®</span>
              </span>
              <button
                type="button"
                data-cursor-hover
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper hover:bg-paper/10 transition-colors"
                aria-label="Close menu"
              >
                <span className="relative block h-4 w-4">
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 -rotate-45 bg-current" />
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-2">
              {[...links, { label: "Contact", href: "#contact" }].map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  data-cursor-hover
                  onClick={() => setOpen(false)}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5 }}
                  className="font-display text-[13vw] leading-[0.95] text-paper transition-colors hover:text-paper/70 md:text-[7vw]"
                >
                  {l.label}
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-1 font-mono text-xs uppercase tracking-[0.05em] text-paper/60 md:flex-row md:items-center md:justify-between">
              <span>hello@magrhea.studio</span>
              <span>Bristol — London</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}