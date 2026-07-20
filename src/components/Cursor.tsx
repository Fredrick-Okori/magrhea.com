"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence, useTransform } from "framer-motion";

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

  const coreConfig = { stiffness: 1400, damping: 60, mass: 0.03 };
  const coreX = useSpring(mouseX, coreConfig);
  const coreY = useSpring(mouseY, coreConfig);

  const speedX = useMotionValue(0);
  const textRotate = useSpring(speedX, { stiffness: 600, damping: 30 });

  const targetScaleValue = useMotionValue(1);
  const scaleSpring = useSpring(targetScaleValue, {
    stiffness: 100,
    damping: 25,
    mass: 0.5,
  });

  const coreScale = useTransform(scaleSpring, [1, 2, 3], [1, 3.5, 5.0]);

  useEffect(() => {
    if (cursorState.type === "text") {
      targetScaleValue.set(3);
    } else if (cursorState.type === "hover") {
      targetScaleValue.set(2);
    } else {
      targetScaleValue.set(1);
    }
  }, [cursorState.type, targetScaleValue]);

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

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full will-change-transform select-none w-6 h-6
        bg-[radial-gradient(100%_100%_at_50%_0%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.05)_80%)]
        dark:bg-[radial-gradient(100%_100%_at_50%_0%,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0.01)_80%)]
        backdrop-blur-[8px]
        border border-white/50 dark:border-white/20
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_16px_rgba(0,0,0,0.08)]"
      style={{
        x: coreX,
        y: coreY,
        scale: coreScale,
        rotate: textRotate,
        translateX: "-50%",
        translateY: "-50%",
        transformStyle: "preserve-3d",
      }}
    >
      <AnimatePresence mode="wait">
        {cursorState.type === "text" && cursorState.text && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 0.18, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
            transition={{ duration: 0.12 }}
            className="whitespace-nowrap font-mono text-[42px] font-bold uppercase tracking-[0.25em] text-ink select-none antialiased"
          >
            {cursorState.text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}