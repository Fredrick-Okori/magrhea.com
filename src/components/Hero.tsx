"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import Magnetic from "@/components/Magnetic";

// Motion presets for clean, high-end editorial feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const titleLetterVariants = {
  hidden: { opacity: 0, y: "40%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.19, 1, 0.22, 1] as const },
  },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispMapRef = useRef<SVGFEDisplacementMapElement>(null);

  // --- Lenis Driven Scroll Logic (Framer Motion) --- //
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // High-frequency active glass distortion loop
  useEffect(() => {
    let frame: number;
    let start = 0;
    
    const animate = (now: number) => {
      if (!start) start = now;
      const t = (now - start) / 1000;

      // CHANGE: Considerably accelerated the time coefficient and amplitude range for prominent fluid kinetic motion
      const fx = 0.009 + Math.sin(t * 0.8) * 0.002;
      const fy = 0.02 + Math.cos(t * 0.7) * 0.002;
      
      if (turbRef.current) {
        turbRef.current.setAttribute("baseFrequency", `${fx} ${fy}`);
      }
      frame = requestAnimationFrame(animate);
    };
    
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Cursor-hover-driven zoom + wave intensity: 0 at rest, 1 fully hovered
  const [isHovering, setIsHovering] = useState(false);
  const hoverProgress = useMotionValue(0);
  const hoverSpring = useSpring(hoverProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.5,
  });
  
  const bgScale = useTransform(hoverSpring, [0, 1], [1, 1.04]);

  useEffect(() => {
    hoverProgress.set(isHovering ? 1 : 0);
  }, [isHovering, hoverProgress]);

  // SVG displacement scale change on hover
  useMotionValueEvent(hoverSpring, "change", (v) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    const base = 4;
    const boost = 12;
    if (dispMapRef.current) {
      dispMapRef.current.setAttribute("scale", String(base + boost * v));
    }
  });

  return (
    <section
      ref={sectionRef}
      id="top"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-paper select-none"
    >
      {/* Liquid FX Filter - applies to the background container only */}
      <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
        <filter id="hero-wave" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency="0.009 0.02"
            numOctaves="1"
            seed="7"
            result="turbulence"
          />
          <feDisplacementMap
            ref={dispMapRef}
            in="SourceGraphic"
            in2="turbulence"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Background Media Container with SVG filter applied */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ filter: "url(#hero-wave)", scale: bgScale }}
      >
        <Image
          src="/img/studio-corridor.jpg"
          alt=""
          fill
          unoptimized
          priority
          className="object-cover opacity-95 pointer-events-none"
        />
        {/* Subtle vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent/10" />
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pb-24 md:px-10 md:pb-28"
      >
        {/* Subtitle / Status Tag */}
        <motion.div 
          variants={fadeUpVariants}
          className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-ink/60"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink/40 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ink" />
          </span>
          Creative Studio
        </motion.div>

        {/* Dynamic Typography - Zoom Effect Container */}
        <motion.div
          style={{
            scale: textScale,
            opacity: textOpacity,
            y: textY,
            translateZ: 0,
            transformOrigin: "bottom left",
          }}
          className="will-change-transform"
        >
          <h1 className="font-display max-w-5xl leading-[0.95] tracking-tight text-ink">
            <span className="flex flex-wrap overflow-hidden py-1">
              {"MAGRHEA.".split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={titleLetterVariants}
                  className="inline-block text-[clamp(2.75rem,14vw,6.5rem)] font-bold uppercase md:text-[8.5vw]"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            
            <span className="mt-4 block overflow-hidden">
              <motion.span
                variants={fadeUpVariants}
                className="inline-block text-[5.5vw] font-light tracking-tight text-ink/90 md:text-[2.6vw]"
              >
                Unforgettably <em className="serif font-serif italic text-ink/100">unseen</em>.
              </motion.span>
            </span>
          </h1>
        </motion.div>

        {/* Studio Pitch */}
        <motion.p
          variants={fadeUpVariants}
          className="mt-8 max-w-md text-base md:text-[17px] leading-relaxed text-ink/70 font-normal antialiased"
        >
          Magrhea is an independent studio building brands, digital products
          and motion for founders who&apos;d rather be understood than liked.
        </motion.p>

        {/* Interactive CTA Group */}
        <motion.div
          variants={fadeUpVariants}
          className="mt-12 flex flex-wrap items-center gap-6"
        >
          <Magnetic strength={0.25}>
            <a
              href="#contact"
              data-cursor-hover
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 font-mono text-[13px] uppercase tracking-[0.06em] text-paper transition-all duration-500 hover:bg-ink/90"
            >
              Start a project 
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>
          
          <a
            href="#approach"
            data-cursor-hover
            className="relative border-b border-ink/10 pb-2 font-mono text-[13px] uppercase tracking-[0.06em] text-ink/50 transition-all duration-300 hover:border-ink hover:text-ink"
          >
            See our approach
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40 md:right-10 pointer-events-none"
      >
        <div className="relative h-10 w-px overflow-hidden bg-ink/10">
          <motion.span 
            animate={{ 
              y: ["-100%", "100%"] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="absolute inset-x-0 h-1/2 w-full bg-ink/60"
          />
        </div>
        Scroll
      </motion.div>
    </section>
  );
}