"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stackItems = [
  { id: 1, src: "/img/work-snowdrop_converted.avif" },
  { id: 2, src: "/img/work-digital-twoway_converted.avif" },
  { id: 3, src: "/img/work-jd-muskoka_converted.avif" },
  { id: 4, src: "/img/work-mogharebi_converted.avif" },
  { id: 5, src: "/img/work-prosite-plan_converted.avif" },
  { id: 6, src: "/img/work-z3-data_converted.avif" },
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

  // Modal State Architecture
  const [isVideoActive, setIsVideoActive] = useState(false);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Independent Video Lifecycle (Completely separate from GSAP)
  useEffect(() => {
    if (!videoRef.current) return;

    if (isVideoActive) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.warn("Native video playback auto-start handled:", err);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isVideoActive]);

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

    let animationFrameId: number;
    const leftItemPositions = stackItems.map(() => ({ x: 0, y: 0 }));
    const rightFollowerPos = { x: 0, y: 0 };

    const tick = () => {
      const lerpFactor = 0.12;

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
            x: pos.x - 70,
            y: pos.y - 85,
            rotate: (idx - stackItems.length / 2) * 4 + (pos.x - targetX) * 0.05,
          });
        }
      });

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

  // Open Sequence Hook (GSAP solely affects modal frames)
  const handleOpenVideo = () => {
    setIsVideoActive(true);
    document.body.style.overflow = "hidden";

    gsap.set(modalOverlayRef.current, { visibility: "visible" });

    const tl = gsap.timeline();
    
    tl.fromTo(
      modalOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );

    tl.fromTo(
      modalContentRef.current,
      { scale: 0.88, y: 40, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.65, ease: "back.out(1.4)" },
      "-=0.25"
    );
  };

  // Close Sequence Hook
  const handleCloseVideo = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVideoActive(false);
        document.body.style.overflow = "";
        gsap.set(modalOverlayRef.current, { visibility: "hidden" });
      }
    });

    tl.to(modalContentRef.current, {
      scale: 0.94,
      y: 20,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in"
    });

    tl.to(modalOverlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in"
    }, "-=0.2");
  };

  return (
    <>
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
                  />
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
              <Image src="/img/mouse_follower_converted.avif" alt="" fill sizes="320px" className="object-cover rounded-full filter blur-[12px]" />
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
          <div 
            onClick={handleOpenVideo}
            className="group relative h-[250px] md:h-auto w-full min-h-[240px] rounded-[24px] bg-ink overflow-hidden flex items-center justify-center border border-ink cursor-pointer"
          >
            <Image
              src="/img/work-record-planet_converted.avif"
              alt="Showreel Background"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            <button className="relative z-10 px-5 py-2.5 rounded-xl border border-paper/30 font-mono text-[11px] font-semibold tracking-wider uppercase text-paper bg-ink/20 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-paper group-hover:text-ink group-hover:border-paper pointer-events-none">
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

      {/* ================= EDITORIAL CINEMATIC MODAL PLAYER ================= */}
      <div 
        ref={modalOverlayRef}
        onClick={handleCloseVideo}
        style={{ visibility: "hidden" }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl opacity-0 will-change-opacity ${
          isVideoActive ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button 
          onClick={handleCloseVideo}
          className="absolute top-6 right-6 font-mono text-[11px] font-bold text-paper/60 hover:text-paper tracking-widest uppercase z-50 bg-white/5 border border-white/10 rounded-full px-4 py-2 cursor-pointer"
        >
          Close ✕
        </button>

        <div 
          ref={modalContentRef}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl aspect-video rounded-[20px] bg-black border border-white/10 overflow-hidden shadow-2xl opacity-0 will-change-transform"
        >
          <video 
            ref={videoRef}
            src="/img/office_launch.mp4" 
            controls
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
}