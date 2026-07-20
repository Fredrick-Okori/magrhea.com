"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Updated stack items matching your image source paths
const stackItems = [
  { id: 1, src: "/img/work-snowdrop.jpg" },
  { id: 2, src: "/img/work-digital-twoway.jpg" },
  { id: 3, src: "/img/work-jd-muskoka.jpg" },
  { id: 4, src: "/img/work-mogharebi.jpg" },
  { id: 5, src: "/img/work-prosite-plan.jpg" },
  { id: 6, src: "/img/work-z3-data.jpg" },
];

const deliveries = [
  {
    text: "Landing page for an international product launch.",
    tags: ["Europe", "6 weeks", "NDA"],
  },
  {
    text: "Six pages b2b site for a sport investment company.",
    tags: ["US", "4 weeks"],
    hasLink: true,
  },
  {
    text: "Creative landing page for a DeFi startup.",
    tags: ["UK", "4 weeks"],
    hasLink: true,
  },
  {
    text: "Brochure site for a world-leading drinks solution company.",
    tags: ["Australia", "10 weeks"],
    hasLink: true,
  },
];

export default function ShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Upper Grid Refs
  const leftCardRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const leftMouseCoords = useRef({ x: 0, y: 0 });

  const rightCardRef = useRef<HTMLDivElement>(null);
  const rightFollowerRef = useRef<HTMLDivElement>(null);
  const [isRightHovered, setIsRightHovered] = useState(false);
  const rightMouseCoords = useRef({ x: 0, y: 0 });

  // Lower Row Ref
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [leftCardRef.current, rightCardRef.current, bottomRowRef.current],
        { y: 50, opacity: 0, scale: 0.99 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    // Dynamic RAF Render Cycle for cursor tracking
    let animationFrameId: number;
    const leftItemPositions = stackItems.map(() => ({ x: 0, y: 0 }));
    const rightFollowerPos = { x: 0, y: 0 };

    const tick = () => {
      const lerpFactor = 0.12;

      // Left Stack Logic
      leftItemPositions.forEach((pos, idx) => {
        const targetX = leftMouseCoords.current.x;
        const targetY = leftMouseCoords.current.y;

        if (idx === 0) {
          pos.x += (targetX - pos.x) * lerpFactor;
          pos.y += (targetY - pos.y) * lerpFactor;
        } else {
          const prevPos = leftItemPositions[idx - 1];
          const currentLerp = lerpFactor - idx * 0.012;
          pos.x += (prevPos.x - pos.x) * Math.max(currentLerp, 0.04);
          pos.y += (prevPos.y - pos.y) * Math.max(currentLerp, 0.04);
        }

        const element = itemsRef.current[idx];
        if (element) {
          gsap.set(element, {
            x: pos.x - 70, // Rebalanced anchor center offset for width adjustments
            y: pos.y - 85, // Rebalanced anchor center offset for height adjustments
            rotate: (idx - stackItems.length / 2) * 4 + (pos.x - targetX) * 0.05,
          });
        }
      });

      // Right Follower Logic
      const rTargetX = rightMouseCoords.current.x;
      const rTargetY = rightMouseCoords.current.y;
      rightFollowerPos.x += (rTargetX - rightFollowerPos.x) * 0.08;
      rightFollowerPos.y += (rTargetY - rightFollowerPos.y) * 0.08;

      if (rightFollowerRef.current) {
        gsap.set(rightFollowerRef.current, {
          x: rightFollowerPos.x - 160,
          y: rightFollowerPos.y - 160,
        });
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      ctx.revert();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-10 flex flex-col gap-6 select-none bg-paper"
    >
      {/* ================= UPPER GRID ROW ================= */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column: Stack Trigger */}
        <div
          ref={leftCardRef}
          onMouseMove={(e) => {
            const rect = leftCardRef.current?.getBoundingClientRect();
            if (rect) leftMouseCoords.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
          }}
          onMouseEnter={() => setIsLeftHovered(true)}
          onMouseLeave={() => setIsLeftHovered(false)}
          className="relative flex h-[520px] w-full flex-col justify-between overflow-hidden rounded-[24px] bg-[#f5f5f5] p-10 md:p-12 border border-black/[0.02]"
        >
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-medium leading-[0.92] tracking-tight text-ink max-w-[280px]">
            See for <br />yourself
          </h2>

          {/* Mouse Follower Layer: Render real background image sheets */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isLeftHovered ? "opacity-100" : "opacity-0"}`}>
            {stackItems.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => { if (el) itemsRef.current[index] = el; }}
                className="absolute left-0 top-0 h-[170px] w-[140px] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] bg-zinc-800 border border-black/10 overflow-hidden will-change-transform"
                style={{ zIndex: 10 + index }}
              >
                <Image
                  src={item.src}
                  alt={`Showcase card image ${item.id}`}
                  fill
                  sizes="140px"
                  className="object-cover"
                  priority={index > 3}
                />
                
                {/* Minimalist overlay layer over real image to match original framing aesthetic */}
                <div className="absolute inset-0 flex flex-col justify-between p-3.5 bg-gradient-to-b from-black/20 via-transparent to-black/40">
                  <div className="flex justify-between items-center opacity-70 text-paper">
                    <div className="h-[2px] w-4 rounded-full bg-current" />
                    <div className="h-1 w-1 rounded-full bg-current" />
                  </div>
                  <div className="h-7 w-full rounded-md bg-white/10 backdrop-blur-md border border-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quote Trigger */}
        <div
          ref={rightCardRef}
          onMouseMove={(e) => {
            const rect = rightCardRef.current?.getBoundingClientRect();
            if (rect) rightMouseCoords.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
          }}
          onMouseEnter={() => setIsRightHovered(true)}
          onMouseLeave={() => setIsRightHovered(false)}
          className="relative flex h-[520px] w-full flex-col justify-between rounded-[24px] bg-[#1a1a1a] p-10 md:p-12 text-paper overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        >
          <div 
            ref={rightFollowerRef}
            className={`absolute left-0 top-0 h-80 w-80 pointer-events-none z-0 will-change-transform transition-opacity duration-700 ${
              isRightHovered ? "opacity-30 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <Image src="/mouse_follower.webp" alt="" fill className="object-cover rounded-full filter blur-[12px]" />
          </div>

          <span className="relative z-10 font-serif text-[6rem] leading-[0] tracking-tight text-paper/20 select-none block h-0 mt-4 -ml-2">“</span>
          
          <div className="relative z-10 flex-1 flex items-center max-w-md mt-6">
            <p className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-normal leading-[1.1] tracking-tight text-[#e5e5e5] antialiased">
              Clean, well-finished work with a true creative eye, always flexible and quick to respond.
            </p>
          </div>

          <div className="relative z-10 font-sans text-xs tracking-wide text-paper/50">
            — Adrien Pin, founding partner <span className="text-paper/80 font-medium">@Merci-Michel</span>
          </div>
        </div>
      </div>

      {/* ================= LOWER LATEST DELIVERY ROW ================= */}
      <div 
        ref={bottomRowRef}
        className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 w-full items-stretch"
      >
        {/* Left Aspect: Showreel Anchor Frame */}
        <div className="group relative h-[250px] md:h-auto w-full min-h-[240px] rounded-[24px] bg-ink overflow-hidden flex items-center justify-center border border-ink">
          <Image 
            src="/img/work-record-planet.jpg" 
            alt="Showreel Background"
            fill
            className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          <button className="relative z-10 px-5 py-2.5 rounded-xl border border-paper/30 font-mono text-[11px] font-semibold tracking-wider uppercase text-paper bg-ink/20 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-paper hover:text-ink hover:border-paper">
            Showreel
          </button>
        </div>

        {/* Right Aspect: Continuous Delivery Flow Sub-Canvas */}
        <div className="rounded-[24px] bg-[#f5f5f5] border border-black/[0.02] p-8 md:p-10 flex flex-col lg:flex-row justify-between gap-8 items-start lg:items-center overflow-hidden">
          
          <div className="shrink-0 max-w-[200px]">
            <h3 className="font-display text-2xl font-medium tracking-tight text-ink">
              Latest delivery
            </h3>
            <p className="mt-2 font-sans text-xs text-ink/50 leading-relaxed">
              New projects typically start within 2 weeks.
            </p>
            <button className="mt-5 bg-ink text-paper font-mono text-[10px] font-bold tracking-widest uppercase px-4 py-3 rounded-lg transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
              Request a quote
            </button>
          </div>

          <div className="flex-1 w-full overflow-x-auto pb-2 scrollbar-none flex gap-4 items-stretch select-none">
            {deliveries.map((item, idx) => (
              <div 
                key={idx}
                className="w-[260px] md:w-[280px] shrink-0 bg-paper rounded-2xl p-6 flex flex-col justify-between border border-black/[0.01] shadow-[0_4px_20px_rgba(0,0,0,0.015)] group/card hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300"
              >
                <p className="font-sans text-[13.5px] font-normal leading-normal text-ink/80">
                  {item.text}
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-full tracking-wide ${
                          tag.includes("weeks") 
                            ? "bg-black/[0.04] text-ink/60" 
                            : tag === "NDA" 
                            ? "text-orange-600/70 font-semibold uppercase tracking-wider"
                            : "bg-black/[0.04] text-ink/80"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {item.hasLink && (
                    <span className="text-ink/20 group-hover/card:text-ink/60 font-mono text-xs transition-colors duration-300 transform group-hover/card:translate-x-0.5">
                      ↗
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}