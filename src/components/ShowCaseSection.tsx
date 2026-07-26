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

  // Right Quote Card & Sperm Follower Refs
  const rightCardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liquidWrapperRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const tailSegmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const followerNodesRef = useRef<{ x: number; y: number; r: number }[]>([]);

  // Lower Row Ref
  const bottomRowRef = useRef<HTMLDivElement>(null);

  // Modal State Architecture
  const [isVideoActive, setIsVideoActive] = useState(false);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Independent Video Lifecycle
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

  // 2. Main ScrollTrigger Entrance + Stack Animation
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

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      ctx.revert();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 3. Sperm-Like Wavy Cursor Follower Engine
  useEffect(() => {
    if (!rightCardRef.current || !headRef.current || !liquidWrapperRef.current || !canvasRef.current) return;

    const rightCard = rightCardRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = rightCard.clientWidth);
    let height = (canvas.height = rightCard.clientHeight);

    const gap = 12;
    const dotRadius = 1.1;

    let isVisible = false;
    let visibilityOpacity = 0;
    let inactivityTimer: NodeJS.Timeout;

    const headXTo = gsap.quickTo(headRef.current, "x", { duration: 0.35, ease: "power2.out" });
    const headYTo = gsap.quickTo(headRef.current, "y", { duration: 0.35, ease: "power2.out" });

    let mouseX = -1000;
    let mouseY = -1000;
    let lastX = 0;
    let lastY = 0;

    const showFollower = () => {
      if (!isVisible && liquidWrapperRef.current) {
        isVisible = true;
        gsap.to(liquidWrapperRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        gsap.to({ val: visibilityOpacity }, {
          val: 1, duration: 0.5, ease: "power2.out",
          onUpdate: function () { visibilityOpacity = this.targets()[0].val; },
        });
      }
    };

    const hideFollower = () => {
      if (liquidWrapperRef.current) {
        isVisible = false;
        gsap.to(liquidWrapperRef.current, { opacity: 0, scale: 0.85, duration: 1.4, ease: "power2.out", overwrite: "auto" });
        gsap.to({ val: visibilityOpacity }, {
          val: 0, duration: 1.4, ease: "power2.out",
          onUpdate: function () { visibilityOpacity = this.targets()[0].val; },
        });
      }
    };

    const tailNodes = Array.from({ length: 7 }, () => ({ x: -1000, y: -1000 }));

    const handleMouseMove = (e: MouseEvent) => {
      showFollower();
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(hideFollower, 700);

      const rect = rightCard.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      headXTo(mouseX);
      headYTo(mouseY);
    };

    const handleResize = () => {
      if (!canvas || !rightCard) return;
      width = canvas.width = rightCard.clientWidth;
      height = canvas.height = rightCard.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    let waveStep = 0;
    let waterTime = 0;
    let currentSpeed = 0;

    const render = () => {
      waveStep += 0.12;
      waterTime += 0.035;

      const deltaX = mouseX - lastX;
      const deltaY = mouseY - lastY;
      const targetSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      currentSpeed += (targetSpeed - currentSpeed) * 0.1;
      const moveAngle = Math.atan2(deltaY, deltaX);

      lastX = mouseX;
      lastY = mouseY;

      if (headRef.current && currentSpeed > 0.2) {
        gsap.to(headRef.current, {
          rotation: (moveAngle * 180) / Math.PI + 90,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      let prevX = mouseX;
      let prevY = mouseY;

      const nodesToTrack: { x: number; y: number; r: number }[] = [
        { x: mouseX, y: mouseY, r: 70 },
      ];

      tailNodes.forEach((node, idx) => {
        const segRef = tailSegmentRefs.current[idx];
        if (!segRef) return;

        const waveFreq = waveStep - idx * 0.35;
        const waveAmplitude = Math.min(16, 3 + currentSpeed * 0.3) * ((idx + 1) / 7);

        const perpAngle = moveAngle + Math.PI / 2;
        const waveOffsetX = Math.cos(perpAngle) * Math.sin(waveFreq) * waveAmplitude;
        const waveOffsetY = Math.sin(perpAngle) * Math.sin(waveFreq) * waveAmplitude;

        node.x += (prevX - node.x) * (0.28 - idx * 0.025);
        node.y += (prevY - node.y) * (0.28 - idx * 0.025);

        const currX = node.x + waveOffsetX;
        const currY = node.y + waveOffsetY;

        gsap.set(segRef, { x: currX, y: currY });
        nodesToTrack.push({ x: currX, y: currY, r: 50 - idx * 4 });

        prevX = node.x;
        prevY = node.y;
      });

      followerNodesRef.current = nodesToTrack;

      if (turbulenceRef.current) {
        const freqX = 0.012 + Math.sin(waveStep * 0.15) * 0.004;
        const freqY = 0.018 + Math.cos(waveStep * 0.15) * 0.004;
        turbulenceRef.current.setAttribute("baseFrequency", `${freqX} ${freqY}`);
      }

      ctx.clearRect(0, 0, width, height);

      const trackedNodes = followerNodesRef.current;
      const baseWaveAmplitude = 6.0;

      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          let extraDistortion = 0;
          let isOverlapping = false;

          if (visibilityOpacity > 0.001) {
            for (let i = 0; i < trackedNodes.length; i++) {
              const node = trackedNodes[i];
              const dx = x - node.x;
              const dy = y - node.y;
              const distSq = dx * dx + dy * dy;
              const radiusSq = node.r * node.r;

              if (distSq < radiusSq) {
                isOverlapping = true;
                const factor = (1 - Math.sqrt(distSq) / node.r) * visibilityOpacity;
                extraDistortion = Math.max(extraDistortion, factor);
              }
            }
          }

          const currentAmplitude = baseWaveAmplitude + extraDistortion * 8.0;
          const angleX = (x + y) * 0.008 + waterTime + extraDistortion * Math.PI;
          const angleY = (x - y) * 0.008 + waterTime * 1.2;

          const renderX = x + Math.sin(angleX) * currentAmplitude;
          const renderY = y + Math.cos(angleY) * currentAmplitude;

          ctx.beginPath();
          ctx.arc(renderX, renderY, dotRadius, 0, Math.PI * 2);

          if (isOverlapping && visibilityOpacity > 0.001) {
            ctx.fillStyle = `rgba(${244 * visibilityOpacity + 255 * (1 - visibilityOpacity)}, ${
              63 * visibilityOpacity + 255 * (1 - visibilityOpacity)
            }, ${94 * visibilityOpacity + 255 * (1 - visibilityOpacity)}, 0.4)`;
          } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
          }

          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    rightCard.addEventListener("mousemove", handleMouseMove);
    rightCard.addEventListener("mouseleave", hideFollower);

    return () => {
      rightCard.removeEventListener("mousemove", handleMouseMove);
      rightCard.removeEventListener("mouseleave", hideFollower);
      window.removeEventListener("resize", handleResize);
      clearTimeout(inactivityTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Open Sequence Hook
  const handleOpenVideo = () => {
    setIsVideoActive(true);
    document.body.style.overflow = "hidden";

    gsap.set(modalOverlayRef.current, { visibility: "visible" });

    const tl = gsap.timeline();
    tl.fromTo(modalOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
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
      },
    });

    tl.to(modalContentRef.current, { scale: 0.94, y: 20, opacity: 0, duration: 0.35, ease: "power2.in" });
    tl.to(modalOverlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.2");
  };

  return (
    <>
      {/* SVG Gooey Liquid Merger Filter for Card Follower */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-sperm-cell-card">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="25"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -8"
            />
          </filter>
        </defs>
      </svg>

      <section
        ref={containerRef}
        className="mx-auto  px-4 py-12 md:px-10 flex flex-col gap-6 select-none bg-paper"
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

          {/* Right Column: Quote Trigger with Wavy Liquid Sperm Follower */}
          <div
            ref={rightCardRef}
            className="relative flex h-[520px] w-full flex-col justify-between rounded-[24px] bg-[#1a1a1a] p-10 md:p-12 text-paper overflow-hidden isolate"
          >
            {/* Liquid Sperm Cell Wrapper */}
            <div
              ref={liquidWrapperRef}
              className="pointer-events-none absolute inset-0 z-0 opacity-0 transform-gpu"
              style={{ filter: "url(#gooey-sperm-cell-card)" }}
            >
              {/* Head */}
              <div
                ref={headRef}
                className="absolute top-0 left-0 w-[50px] h-[70px] bg-[#f43f5e] -translate-x-1/2 -translate-y-1/2 transform-gpu"
                style={{
                  borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%",
                  willChange: "transform",
                }}
              />

              {/* Trailing Tail Segments */}
              {[
                { size: 38, color: "bg-[#f43f5e]" },
                { size: 30, color: "bg-[#f43f5e]" },
                { size: 24, color: "bg-[#f43f5e]" },
                { size: 18, color: "bg-[#f43f5e]" },
                { size: 14, color: "bg-[#f43f5e]" },
                { size: 10, color: "bg-[#f43f5e]" },
                { size: 6, color: "bg-[#f43f5e]" },
              ].map((segment, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    tailSegmentRefs.current[idx] = el;
                  }}
                  className={`absolute top-0 left-0 rounded-full ${segment.color} -translate-x-1/2 -translate-y-1/2 transform-gpu`}
                  style={{
                    width: `${segment.size}px`,
                    height: `${segment.size}px`,
                    willChange: "transform",
                  }}
                />
              ))}
            </div>

            {/* Dynamic Wavy Water Canvas Dot Grid */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-80" />

            {/* Overlay Quote Content */}
            <span className="relative z-10 font-display text-[9rem] leading-[0] tracking-tight text-paper/20 select-none block h-0 mt-8 -ml-3 pointer-events-none">
              “
            </span>

            <div className="relative z-10 flex-1 flex items-center max-w-lg mt-4 pointer-events-none">
              <p className="font-display text-[clamp(2.1rem,3.8vw,3.2rem)] font-normal leading-[1.05] tracking-tight text-[#f5f5f5] antialiased">
                Clean, well-finished work with a true creative eye, always flexible and quick to respond.
              </p>
            </div>

            <div className="relative z-10 font-sans text-sm tracking-wide text-paper/50 pointer-events-none">
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