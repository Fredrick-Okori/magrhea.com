"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}
function getServerSnapshot() {
  return false;
}

export default function Cursor() {
  const fine = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  const [cursorState, setCursorState] = useState<{
    type: "default" | "hover" | "text";
    text: string | null;
    visible: boolean;
  }>({
    type: "default",
    text: null,
    visible: false,
  });

  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  // IDENTICAL MATCHED PHYSICS REGISTER
  const springConfig = { stiffness: 1200, damping: 55, mass: 0.05 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  const speedX = useMotionValue(0);
  const textRotate = useSpring(speedX, { stiffness: 600, damping: 30 });

  useEffect(() => {
    if (!fine) return;
    let lastX = 0;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      const deltaX = e.clientX - lastX;
      speedX.set(Math.min(Math.max(deltaX * 0.2, -6), 6));
      lastX = e.clientX;

      if (!cursorState.visible) {
        setCursorState((prev) => ({ ...prev, visible: true }));
      }
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const textEl = target.closest<HTMLElement>("[data-cursor-text]");
      const isInteractive = target.closest("a, button, [data-cursor-hover]");

      if (textEl) {
        setCursorState((prev) => ({ ...prev, type: "text", text: textEl.dataset.cursorText ?? null }));
      } else if (isInteractive) {
        setCursorState((prev) => ({ ...prev, type: "hover", text: null }));
      } else {
        setCursorState((prev) => ({ ...prev, type: "default", text: null }));
      }
    };

    const leave = () => {
      setCursorState((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.body.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.body.removeEventListener("mouseleave", leave);
    };
  }, [mouseX, mouseY, cursorState.visible, fine, speedX]);

  if (!fine || !cursorState.visible) return null;

  const isHovered = cursorState.type === "hover";
  const isText = cursorState.type === "text";
  const targetScale = isText ? 2.25 : isHovered ? 1.5 : 1;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full will-change-transform select-none w-20 h-20
        bg-[radial-gradient(110%_110%_at_50%_0%,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0.03)_70%,rgba(255,255,255,0)_100%)]
        dark:bg-[radial-gradient(110%_110%_at_50%_0%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.01)_70%,rgba(255,255,255,0)_100%)]
        backdrop-blur-[24px]
        border border-white/40 dark:border-white/20
        shadow-[inset_0_1.5px_2px_0_rgba(255,255,255,0.4),
                inset_0_-1.5px_2px_0_rgba(0,0,0,0.15),
                0_16px_32px_-4px_rgba(0,0,0,0.12),
                0_32px_64px_-12px_rgba(0,0,0,0.18)]"
      style={{
        x: trailX,
        y: trailY,
        rotate: textRotate,
        translateX: "-50%",
        translateY: "-50%",
        transformStyle: "preserve-3d",
      }}
      animate={{ scale: targetScale }}
      transition={{ type: "spring", ...springConfig }}
    >
      <AnimatePresence mode="wait">
        {isText && cursorState.text && (
          <motion.span
            initial={{ opacity: 0, scale: 0.75, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 0.45, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.75, filter: "blur(6px)" }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.22em] text-ink/90 select-none antialiased
                       drop-shadow-[0_1.5px_1px_rgba(255,255,255,0.5)]
                       dark:drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.4)]"
          >
            {cursorState.text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}