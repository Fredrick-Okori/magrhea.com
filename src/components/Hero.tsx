"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Wrapper for showing/hiding the cell follower smoothly
  const liquidWrapperRef = useRef<HTMLDivElement>(null);

  // Cell components
  const headRef = useRef<HTMLDivElement>(null);
  const tailSegmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);

  // Array to hold active node coordinates for dot grid color calculation
  const followerNodesRef = useRef<{ x: number; y: number; r: number }[]>([]);

  // 1. Synchronous Canvas Sizing & Immediate Initial Draw
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    const gap = 6;
    const dotRadius = 0.9;
    ctx.fillStyle = "#2B1B17";

    for (let x = gap / 2; x < width; x += gap) {
      for (let y = gap / 2; y < height; y += gap) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  // 2. High-Speed Responsive Animation Engine
  useEffect(() => {
    if (!containerRef.current || !headRef.current || !liquidWrapperRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const gap = 6;
    const dotRadius = 0.9;

    let isVisible = false;
    let visibilityOpacity = 0;
    let inactivityTimer: NodeJS.Timeout;

    // Ultra-snappy response time for cursor position
    const headXTo = gsap.quickTo(headRef.current, "x", {
      duration: 0.08,
      ease: "power3.out",
    });
    const headYTo = gsap.quickTo(headRef.current, "y", {
      duration: 0.08,
      ease: "power3.out",
    });

    let mouseX = -1000;
    let mouseY = -1000;
    let lastX = 0;
    let lastY = 0;

    const showFollower = () => {
      if (!isVisible && liquidWrapperRef.current) {
        isVisible = true;
        gsap.to(liquidWrapperRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(
          { val: visibilityOpacity },
          {
            val: 1,
            duration: 0.25,
            ease: "power2.out",
            onUpdate: function () {
              visibilityOpacity = this.targets()[0].val;
            },
          }
        );
      }
    };

    const hideFollower = () => {
      if (liquidWrapperRef.current) {
        isVisible = false;

        gsap.to(liquidWrapperRef.current, {
          opacity: 0,
          scale: 0.85,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(
          { val: visibilityOpacity },
          {
            val: 0,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: function () {
              visibilityOpacity = this.targets()[0].val;
            },
          }
        );
      }
    };

    const tailNodes = Array.from({ length: 7 }, () => ({ x: -1000, y: -1000 }));

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      showFollower();

      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(hideFollower, 700);

      const rect = containerRef.current.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      headXTo(mouseX);
      headYTo(mouseY);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    let waveStep = 0;
    let waterTime = 0;
    let currentSpeed = 0;

    const render = () => {
      waveStep += 0.2; // Faster wave frequency for tighter response
      waterTime += 0.04;

      const deltaX = mouseX - lastX;
      const deltaY = mouseY - lastY;
      const targetSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      currentSpeed += (targetSpeed - currentSpeed) * 0.35; // Instantaneous speed tracking
      const moveAngle = Math.atan2(deltaY, deltaX);

      lastX = mouseX;
      lastY = mouseY;

      if (headRef.current && currentSpeed > 0.1) {
        gsap.to(headRef.current, {
          rotation: (moveAngle * 180) / Math.PI + 90,
          duration: 0.1,
          ease: "power1.out",
          overwrite: "auto",
        });
      }

      let prevX = mouseX;
      let prevY = mouseY;

      const nodesToTrack: { x: number; y: number; r: number }[] = [
        { x: mouseX, y: mouseY, r: 70 },
      ];

      // Dynamic distance-based snake tail logic
      tailNodes.forEach((node, idx) => {
        const segRef = tailSegmentRefs.current[idx];
        if (!segRef) return;

        const waveFreq = waveStep - idx * 0.35;
        const waveAmplitude = Math.min(18, 2 + currentSpeed * 0.2) * ((idx + 1) / 7);

        const perpAngle = moveAngle + Math.PI / 2;
        const waveOffsetX = Math.cos(perpAngle) * Math.sin(waveFreq) * waveAmplitude;
        const waveOffsetY = Math.sin(perpAngle) * Math.sin(waveFreq) * waveAmplitude;

        // Significantly tighter lerp speed so tail stays attached to the pointer
        const lerpRate = 0.52 - idx * 0.035;
        node.x += (prevX - node.x) * lerpRate;
        node.y += (prevY - node.y) * lerpRate;

        const currX = node.x + waveOffsetX;
        const currY = node.y + waveOffsetY;

        gsap.set(segRef, { x: currX, y: currY });

        nodesToTrack.push({ x: currX, y: currY, r: 50 - idx * 4 });

        prevX = node.x;
        prevY = node.y;
      });

      followerNodesRef.current = nodesToTrack;

      // Update SVG turbulence at fixed rate
      if (turbulenceRef.current) {
        const freqX = 0.012 + Math.sin(waveStep * 0.15) * 0.004;
        const freqY = 0.018 + Math.cos(waveStep * 0.15) * 0.004;
        turbulenceRef.current.setAttribute("baseFrequency", `${freqX} ${freqY}`);
      }

      // --- Fast Canvas Rendering ---
      ctx.clearRect(0, 0, width, height);

      const trackedNodes = followerNodesRef.current;
      const baseWaveAmplitude = 3.5;
      const activeOpacity = visibilityOpacity > 0.001;

      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          let extraDistortion = 0;
          let isOverlapping = false;

          if (activeOpacity) {
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

          const currentAmplitude = baseWaveAmplitude + extraDistortion * 6.0;
          const angleX = (x + y) * 0.008 + waterTime + extraDistortion * Math.PI;
          const angleY = (x - y) * 0.008 + waterTime * 1.2;

          const renderX = x + Math.sin(angleX) * currentAmplitude;
          const renderY = y + Math.cos(angleY) * currentAmplitude;

          ctx.beginPath();
          ctx.arc(renderX, renderY, dotRadius, 0, Math.PI * 2);

          if (isOverlapping && activeOpacity) {
            ctx.fillStyle = `rgba(${244 * visibilityOpacity + 43 * (1 - visibilityOpacity)}, ${
              63 * visibilityOpacity + 27 * (1 - visibilityOpacity)
            }, ${94 * visibilityOpacity + 23 * (1 - visibilityOpacity)}, 1)`;
          } else {
            ctx.fillStyle = "#2B1B17";
          }

          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", hideFollower);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", hideFollower);
      window.removeEventListener("resize", handleResize);
      clearTimeout(inactivityTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#e3ded8] text-[#2B1B17] overflow-hidden flex flex-col justify-center items-center p-6 md:p-12 select-none isolate"
    >
      {/* --- Lightened SVG Gooey Filter for Better Performance --- */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-sperm-cell">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="1"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            />
          </filter>
        </defs>
      </svg>

      {/* --- Cell Follower Container --- */}
      <div
        ref={liquidWrapperRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transform-gpu"
        style={{ filter: "url(#gooey-sperm-cell)" }}
      >
        <div
          ref={headRef}
          className="absolute top-0 left-0 w-[70px] h-[95px] bg-[#f43f5e] -translate-x-1/2 -translate-y-1/2 transform-gpu"
          style={{
            borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%",
            willChange: "transform",
          }}
        />

        {[
          { size: 52, color: "bg-[#f43f5e]" },
          { size: 42, color: "bg-[#f43f5e]" },
          { size: 34, color: "bg-[#f43f5e]" },
          { size: 26, color: "bg-[#f43f5e]" },
          { size: 20, color: "bg-[#f43f5e]" },
          { size: 14, color: "bg-[#f43f5e]" },
          { size: 8, color: "bg-[#f43f5e]" },
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

      {/* --- Dynamic Wavy Canvas Dot Grid --- */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 opacity-90"
      />

      {/* --- Soft Radial Edge Vignette --- */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,#e3ded8_100%)] z-10" />

      {/* --- Main Hero Typography Content Stack --- */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center max-w-6xl mx-auto py-12 pointer-events-auto">
        <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[125px] font-medium leading-[0.90] tracking-tight text-[#2B1B17] max-w-5xl">
          Creative development team for agencies that can&apos;t afford to miss
        </h1>
      </main>
    </section>
  );
}