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

  // Ref to hold offscreen pre-rendered static dot canvas
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Array to hold active node coordinates for dot grid color calculation
  const followerNodesRef = useRef<{ x: number; y: number; r: number }[]>([]);

  // 1. Offscreen Pre-rendering for Static Grid (Zero runtime overhead)
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

    // Build offscreen canvas once
    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext("2d");
    
    if (offCtx) {
      offCtx.scale(dpr, dpr);
      const gap = 8;
      const dotRadius = 0.95;
      offCtx.fillStyle = "#2B1B17";

      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          offCtx.beginPath();
          offCtx.arc(x, y, dotRadius, 0, Math.PI * 2);
          offCtx.fill();
        }
      }
    }

    offscreenCanvasRef.current = offscreen;
  }, []);

  // 2. High-Speed Low-Latency Responsive Engine
  useEffect(() => {
    if (!containerRef.current || !headRef.current || !liquidWrapperRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const gap = 8;
    const dotRadius = 0.95;

    let isVisible = false;
    let visibilityOpacity = 0;
    let inactivityTimer: NodeJS.Timeout;

    // Zero-lag instantaneous tracking (duration 0.01s)
    const headXTo = gsap.quickTo(headRef.current, "x", {
      duration: 0.01,
      ease: "none",
    });
    const headYTo = gsap.quickTo(headRef.current, "y", {
      duration: 0.01,
      ease: "none",
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
          duration: 0.15,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(
          { val: visibilityOpacity },
          {
            val: 1,
            duration: 0.15,
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
          scale: 0.9,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(
          { val: visibilityOpacity },
          {
            val: 0,
            duration: 0.4,
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
      inactivityTimer = setTimeout(hideFollower, 600);

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
      waveStep += 0.25;
      waterTime += 0.05;

      const deltaX = mouseX - lastX;
      const deltaY = mouseY - lastY;
      const targetSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      currentSpeed += (targetSpeed - currentSpeed) * 0.5; // Instantaneous speed tracking
      const moveAngle = Math.atan2(deltaY, deltaX);

      lastX = mouseX;
      lastY = mouseY;

      if (headRef.current && currentSpeed > 0.1) {
        gsap.set(headRef.current, {
          rotation: (moveAngle * 180) / Math.PI + 90,
        });
      }

      let prevX = mouseX;
      let prevY = mouseY;

      const nodesToTrack: { x: number; y: number; r: number }[] = [
        { x: mouseX, y: mouseY, r: 70 },
      ];

      // Tighter, immediate lerp speed for zero tail lag
      tailNodes.forEach((node, idx) => {
        const segRef = tailSegmentRefs.current[idx];
        if (!segRef) return;

        const waveFreq = waveStep - idx * 0.35;
        const waveAmplitude = Math.min(16, 2 + currentSpeed * 0.2) * ((idx + 1) / 7);

        const perpAngle = moveAngle + Math.PI / 2;
        const waveOffsetX = Math.cos(perpAngle) * Math.sin(waveFreq) * waveAmplitude;
        const waveOffsetY = Math.sin(perpAngle) * Math.sin(waveFreq) * waveAmplitude;

        const lerpRate = 0.82 - idx * 0.04;
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

      // Fast SVG turbulence calculation
      if (turbulenceRef.current) {
        const freqX = 0.012 + Math.sin(waveStep * 0.15) * 0.003;
        const freqY = 0.018 + Math.cos(waveStep * 0.15) * 0.003;
        turbulenceRef.current.setAttribute("baseFrequency", `${freqX} ${freqY}`);
      }

      // --- High-Speed Selective Canvas Rendering ---
      ctx.clearRect(0, 0, width, height);

      // 1. Stamp pre-rendered static canvas grid instantly
      if (offscreenCanvasRef.current) {
        ctx.drawImage(offscreenCanvasRef.current, 0, 0, width, height);
      }

      // 2. Only perform dynamic math for localized nodes in view
      const trackedNodes = followerNodesRef.current;
      const activeOpacity = visibilityOpacity > 0.01;

      if (activeOpacity && trackedNodes.length > 0) {
        // Calculate minimal bounding box around follower
        let minX = width;
        let maxX = 0;
        let minY = height;
        let maxY = 0;

        for (let i = 0; i < trackedNodes.length; i++) {
          const n = trackedNodes[i];
          minX = Math.max(0, Math.min(minX, n.x - n.r - 10));
          maxX = Math.min(width, Math.max(maxX, n.x + n.r + 10));
          minY = Math.max(0, Math.min(minY, n.y - n.r - 10));
          maxY = Math.min(height, Math.max(maxY, n.y + n.r + 10));
        }

        const startX = Math.floor((minX - (minX % gap)) / gap) * gap + gap / 2;
        const endX = Math.ceil(maxX / gap) * gap;
        const startY = Math.floor((minY - (minY % gap)) / gap) * gap + gap / 2;
        const endY = Math.ceil(maxY / gap) * gap;

        // Clear localized region from background static grid to draw displaced red dots
        ctx.clearRect(minX, minY, maxX - minX, maxY - minY);

        for (let x = startX; x < endX; x += gap) {
          for (let y = startY; y < endY; y += gap) {
            let extraDistortion = 0;
            let isOverlapping = false;

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

            const currentAmplitude = 3.5 + extraDistortion * 5.0;
            const angleX = (x + y) * 0.008 + waterTime + extraDistortion * Math.PI;
            const angleY = (x - y) * 0.008 + waterTime * 1.2;

            const renderX = x + Math.sin(angleX) * currentAmplitude;
            const renderY = y + Math.cos(angleY) * currentAmplitude;

            ctx.beginPath();
            ctx.arc(renderX, renderY, dotRadius, 0, Math.PI * 2);

            if (isOverlapping) {
              ctx.fillStyle = `rgba(${244 * visibilityOpacity + 43 * (1 - visibilityOpacity)}, ${
                63 * visibilityOpacity + 27 * (1 - visibilityOpacity)
              }, ${94 * visibilityOpacity + 23 * (1 - visibilityOpacity)}, 1)`;
            } else {
              ctx.fillStyle = "#2B1B17";
            }

            ctx.fill();
          }
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
      {/* --- Optimized Lightened SVG Filter --- */}
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
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -6"
            />
          </filter>
        </defs>
      </svg>

      {/* --- Cell Follower Container --- */}
      <div
        ref={liquidWrapperRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transform-gpu will-change-transform"
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

      {/* --- Dynamic Canvas Dot Grid --- */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 opacity-90 transform-gpu"
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