"use client";

import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!containerRef.current || !headRef.current || !liquidWrapperRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const gap = 12;
    const dotRadius = 1.1;

    let isVisible = false;
    let visibilityOpacity = 0;
    let inactivityTimer: NodeJS.Timeout;

    // Smooth head movement towards pointer
    const headXTo = gsap.quickTo(headRef.current, "x", {
      duration: 0.35,
      ease: "power2.out",
    });
    const headYTo = gsap.quickTo(headRef.current, "y", {
      duration: 0.35,
      ease: "power2.out",
    });

    let mouseX = -1000;
    let mouseY = -1000;
    let lastX = 0;
    let lastY = 0;

    // Smooth Ease-In
    const showFollower = () => {
      if (!isVisible && liquidWrapperRef.current) {
        isVisible = true;
        gsap.to(liquidWrapperRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(
          { val: visibilityOpacity },
          {
            val: 1,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: function () {
              visibilityOpacity = this.targets()[0].val;
            },
          }
        );
      }
    };

    // Soft, organic dissipation (fade out)
    const hideFollower = () => {
      if (liquidWrapperRef.current) {
        isVisible = false;

        gsap.to(liquidWrapperRef.current, {
          opacity: 0,
          scale: 0.85,
          duration: 1.4,
          ease: "power2.out",
          overwrite: "auto",
        });

        gsap.to(
          { val: visibilityOpacity },
          {
            val: 0,
            duration: 1.4,
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
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic Render Loop
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

      // Track active follower nodes for dot canvas calculations
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

        gsap.set(segRef, {
          x: currX,
          y: currY,
        });

        nodesToTrack.push({ x: currX, y: currY, r: 50 - idx * 4 });

        prevX = node.x;
        prevY = node.y;
      });

      followerNodesRef.current = nodesToTrack;

      // Update SVG turbulence for the follower
      if (turbulenceRef.current) {
        const freqX = 0.012 + Math.sin(waveStep * 0.15) * 0.004;
        const freqY = 0.018 + Math.cos(waveStep * 0.15) * 0.004;
        turbulenceRef.current.setAttribute("baseFrequency", `${freqX} ${freqY}`);
      }

      // --- Draw Dynamic Wavy Water Canvas Dot Grid ---
      ctx.clearRect(0, 0, width, height);

      const trackedNodes = followerNodesRef.current;
      const baseWaveAmplitude = 6.0;

      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          let extraDistortion = 0;
          let isOverlapping = false;

          // Check proximity to any node of the follower
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

          // Rolling water surface formula influenced by follower movement
          const currentAmplitude = baseWaveAmplitude + extraDistortion * 8.0;
          const angleX = (x + y) * 0.008 + waterTime + extraDistortion * Math.PI;
          const angleY = (x - y) * 0.008 + waterTime * 1.2;

          const renderX = x + Math.sin(angleX) * currentAmplitude;
          const renderY = y + Math.cos(angleY) * currentAmplitude;

          ctx.beginPath();
          ctx.arc(renderX, renderY, dotRadius, 0, Math.PI * 2);

          // Blend color transition based on visibilityOpacity
          if (isOverlapping && visibilityOpacity > 0.001) {
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
      {/* --- SVG Gooey Liquid Merger Filter --- */}
      <svg className="hidden">
        <defs>
          <filter id="gooey-sperm-cell">
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

      {/* --- Sperm Cell Follower Container (z-0) --- */}
      <div
        ref={liquidWrapperRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transform-gpu"
        style={{ filter: "url(#gooey-sperm-cell)" }}
      >
        {/* Big Rounded Cell Head */}
        <div
          ref={headRef}
          className="absolute top-0 left-0 w-[70px] h-[95px] bg-[#f43f5e] -translate-x-1/2 -translate-y-1/2 transform-gpu"
          style={{
            borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%",
            willChange: "transform",
          }}
        />

        {/* Tapered Trailing Tail Segments */}
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

      {/* --- Dynamic Wavy Canvas Dot Grid (z-10) --- */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 opacity-90"
      />

      {/* --- Soft Radial Edge Vignette --- */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,#e3ded8_100%)] z-10" />

      {/* --- Main Hero Typography Content Stack --- */}
      <main className="relative z-20 flex flex-col items-center justify-center text-center max-w-6xl mx-auto py-12 pointer-events-auto">
        <p className="font-mono text-xs sm:text-sm md:text-base tracking-[0.25em] text-[#2B1B17]/70 font-semibold uppercase mb-8 md:mb-10">
          1X WEBBY AWARD &nbsp;·&nbsp; 5X FWA &nbsp;·&nbsp; 18X AWWWARDS &nbsp;·&nbsp; 21X CSSDA
        </p>

        <h1 className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[125px] font-medium leading-[0.90] tracking-tight text-[#2B1B17] max-w-5xl">
          Creative development team for agencies that can&apos;t afford to miss
        </h1>
      </main>
    </section>
  );
}