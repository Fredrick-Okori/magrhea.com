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
  
  // Separate filter controls for independent scaling pipelines
  const bgTurbRef = useRef<SVGFETurbulenceElement>(null);
  const bgDispMapRef = useRef<SVGFEDisplacementMapElement>(null);
  
  const textTurbRef = useRef<SVGFETurbulenceElement>(null);
  const textDispMapRef = useRef<SVGFEDisplacementMapElement>(null);

  // --- Dynamic Mouse Coordinate Processing --- //
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { stiffness: 1200, damping: 55, mass: 0.05 };
  const smoothMouseX = useSpring(rawMouseX, springConfig);
  const smoothMouseY = useSpring(rawMouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6]);

  const contentTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);
  const contentTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [-12, 12]);

  const bgTranslateX = useTransform(smoothMouseX, [-0.5, 0.5], [15, -15]);
  const bgTranslateY = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);

  useEffect(() => {
    const handleTracking = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) - 0.5;
      const normalizedY = (e.clientY / window.innerHeight) - 0.5;
      
      rawMouseX.set(normalizedX);
      rawMouseY.set(normalizedY);
    };

    window.addEventListener("mousemove", handleTracking, { passive: true });
    return () => window.removeEventListener("mousemove", handleTracking);
  }, [rawMouseX, rawMouseY]);

  const handleMouseLeave = () => {
    setIsHovering(false);
    rawMouseX.set(0);
    rawMouseY.set(0);
  };

  // --- Lenis Scroll Sync --- //
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // High-Frequency Liquid FX Wave Loop Animation
  useEffect(() => {
    let frame: number;
    let start = 0;
    
    const animate = (now: number) => {
      if (!start) start = now;
      const t = (now - start) / 1000;

      // Heavy Liquid configuration parameters for the background layer
      const bgFx = 0.03 + Math.sin(t * 1.8) * 0.006;
      const bgFy = 0.06 + Math.cos(t * 1.4) * 0.012;
      
      // Fine-grain, fast micro-ripple parameters for text legibility
      const textFx = 0.01 + Math.sin(t * 2.5) * 0.002;
      const textFy = 0.02 + Math.cos(t * 2.0) * 0.003;
      
      if (bgTurbRef.current) bgTurbRef.current.setAttribute("baseFrequency", `${bgFx} ${bgFy}`);
      if (textTurbRef.current) textTurbRef.current.setAttribute("baseFrequency", `${textFx} ${textFy}`);
      
      frame = requestAnimationFrame(animate);
    };
    
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const [isHovering, setIsHovering] = useState(false);
  const hoverProgress = useMotionValue(0);
  const hoverSpring = useSpring(hoverProgress, { stiffness: 100, damping: 25, mass: 0.5 });
  
  const bgScale = useTransform(hoverSpring, [0, 1], [1.05, 1.1]);

  useEffect(() => {
    hoverProgress.set(isHovering ? 1 : 0);
  }, [isHovering, hoverProgress]);

  useMotionValueEvent(hoverSpring, "change", (v) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    // Dynamic boost for the background remains highly interactive
    if (bgDispMapRef.current) {
      bgDispMapRef.current.setAttribute("scale", String(8 + 24 * v));
    }
    // Dynamic boost for text layer is severely dampened to prioritize legibility
    if (textDispMapRef.current) {
      textDispMapRef.current.setAttribute("scale", String(2 + 4 * v));
    }
  });

  return (
    <section
      ref={sectionRef}
      id="top"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-paper select-none"
      style={{ perspective: 1200 }}
    >
      {/* PIPELINE A: Heavy Background Water Distortion */}
      <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
        <filter id="hero-bg-water-lens" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            ref={bgTurbRef}
            type="fractalNoise"
            baseFrequency="0.03 0.06"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            ref={bgDispMapRef}
            in="SourceGraphic"
            in2="noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* PIPELINE B: Subtle, Micro-Dampened Typography Distortion */}
      <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
        <filter id="hero-text-water-lens" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            ref={textTurbRef}
            type="fractalNoise"
            baseFrequency="0.01 0.02"
            numOctaves="1" // Reduced octaves for cleaner, smooth text boundaries
            result="noise"
          />
          <feDisplacementMap
            ref={textDispMapRef}
            in="SourceGraphic"
            in2="noise"
            scale="2" // Dropped starting baseline scale down significantly
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Background Graphic Mesh */}
      <motion.div
        className="absolute -inset-10 z-0 will-change-transform"
        style={{ 
          filter: "url(#hero-bg-water-lens)", // Links into the heavy warp pipeline
          scale: bgScale,
          rotateX,
          rotateY,
          x: bgTranslateX,
          y: bgTranslateY,
          transformStyle: "preserve-3d"
        }}
      >
        <Image
          src="/bg.webp"
          alt=""
          fill
          unoptimized
          priority
          className="object-cover opacity-95 pointer-events-none"
        />
      </motion.div>

      {/* Content Canvas */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pb-24 md:px-10 md:pb-28 will-change-transform"
        style={{
          filter: "url(#hero-text-water-lens)", // Intercepts with typography-safe low-frequency warp filter
          rotateX,
          rotateY,
          x: contentTranslateX,
          y: contentTranslateY,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div 
          variants={fadeUpVariants}
          className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-paper/60"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink/40 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-paper" />
          </span>
          Creative Studio
        </motion.div>

        <motion.div
          style={{
            scale: textScale,
            opacity: textOpacity,
            y: textY,
            transformOrigin: "bottom left",
            transform: "translateZ(60px)",
          }}
          className="will-change-transform"
        >
          <h1 className="font-display max-w-5xl leading-[0.95] tracking-tight text-paper">
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
                className="inline-block text-[5.5vw] font-light tracking-tight text-paper/90 md:text-[2.6vw]"
              >
                Unforgettably <em className="serif font-serif italic text-ink/100">unseen</em>.
              </motion.span>
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={fadeUpVariants}
          className="mt-8 max-w-md text-base md:text-[17px] leading-relaxed text-paper/70 font-normal antialiased"
          style={{ transform: "translateZ(40px)" }}
        >
          Magrhea is an independent studio building brands, digital products
          and motion for founders who&apos;d rather be understood than liked.
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          className="mt-12 flex flex-wrap items-center gap-6"
          style={{ transform: "translateZ(50px)" }}
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
            href="#work"
            data-cursor-hover
            className="relative border-b border-ink/10 pb-2 font-mono text-[13px] uppercase tracking-[0.06em] text-ink/50 transition-all duration-300 hover:border-ink hover:text-ink"
          >
            See the work
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40 md:right-10 pointer-events-none"
      >
        <div className="relative h-10 w-px overflow-hidden bg-ink/10">
          <motion.span 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-x-0 h-1/2 w-full bg-ink/60"
          />
        </div>
        Scroll
      </motion.div>
    </section>
  );
}