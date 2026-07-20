"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { projects } from "@/lib/projects";
import WorkTitle from "./WorkTitle";

gsap.registerPlugin(ScrollTrigger, Draggable);

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardWidthRef = useRef<number>(0);
  const totalWidthRef = useRef<number>(0);
  const draggableInstanceRef = useRef<any>(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const cards = gsap.utils.toArray<HTMLElement>(".work-card");
    if (cards.length === 0) return;

    // 1. Setup exact structural sizes & seamless clone buffers
    const cardWidth = cards[0].offsetWidth + 24; // Width + gap-6
    cardWidthRef.current = cardWidth;
    const totalWidth = cardWidth * cards.length;
    totalWidthRef.current = totalWidth;

    // Build infinite cloning deck seamlessly
    cards.forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      track.appendChild(clone);
    });
    // Double duplicate to pad left/right edges elegantly during center tracking
    cards.forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      track.insertBefore(clone, track.firstChild);
    });
    
    gsap.set(track, { width: totalWidth * 3, x: -totalWidth });

    // 2. Dynamic multi-card scaling based on physical screen coordinates
    const updateCardScales = () => {
      const allDomCards = track.querySelectorAll(".work-card");
      const viewportCenter = window.innerWidth / 2;
      
      let closestCardIndex = 0;
      let minDistance = Infinity;

      allDomCards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distanceFromCenter = Math.abs(viewportCenter - cardCenter);

        // Continuous interpolation formula for ultra-smooth focus transition
        const maxDistance = 400; 
        const normDistance = Math.min(distanceFromCenter / maxDistance, 1);
        
        // Symmetrical curve scaling values matching your screenshot look
        const scale = 1.25 - normDistance * 0.45; // Center scales to 1.25, edges down to 0.8
        const opacity = 1.0 - normDistance * 0.7;  // Center is sharp, sides drop out softly
        
        gsap.set(card, { 
          scale: scale, 
          opacity: opacity,
          zIndex: Math.round((1 - normDistance) * 100) 
        });

        // Track closest center item to correctly set structural data arrays
        if (distanceFromCenter < minDistance) {
          minDistance = distanceFromCenter;
          closestCardIndex = idx % cards.length;
        }
      });

      setActiveIndex(closestCardIndex);
    };

    // 3. Setup core manual-only Draggable layer with custom boundary loop wrap tracking
    const dragInstance = Draggable.create(track, {
      type: "x",
      trigger: container,
      inertia: true,
      onDrag: () => {
        // Continuous wrapping logic so it never hits hard layout boundaries
        let currentX = dragInstance.x;
        if (currentX < -totalWidth * 2) currentX += totalWidth;
        if (currentX > -cardWidth) currentX -= totalWidth;
        gsap.set(track, { x: currentX });
        updateCardScales();
      },
      onThrowUpdate: () => {
        let currentX = gsap.getProperty(track, "x") as number;
        if (currentX < -totalWidth * 2) currentX += totalWidth;
        if (currentX > -cardWidth) currentX -= totalWidth;
        gsap.set(track, { x: currentX });
        updateCardScales();
      },
      onRelease: function() {
        // Snap directly onto card increments relative to layout center lines
        const currentX = this.x;
        const targetX = Math.round(currentX / cardWidth) * cardWidth;
        gsap.to(track, {
          x: targetX,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: updateCardScales
        });
      }
    })[0];

    draggableInstanceRef.current = dragInstance;

    // Init display values on bootup frame execution loop
    gsap.ticker.add(updateCardScales);
    updateCardScales();

    return () => {
      dragInstance.kill();
      gsap.ticker.remove(updateCardScales);
    };
  }, []);

  // 4. Exact navigation jump triggers to push precise card intervals directly into view centers
  const handleNav = (direction: "next" | "prev") => {
    const track = trackRef.current;
    if (!track || !cardWidthRef.current || !totalWidthRef.current) return;

    const currentX = gsap.getProperty(track, "x") as number;
    const step = direction === "next" ? -cardWidthRef.current : cardWidthRef.current;
    let targetX = Math.round((currentX + step) / cardWidthRef.current) * cardWidthRef.current;

    // Boundaries reset wraps
    if (targetX < -totalWidthRef.current * 2) targetX += totalWidthRef.current;
    if (targetX > -cardWidthRef.current) targetX -= totalWidthRef.current;

    gsap.to(track, {
      x: targetX,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        const allDomCards = track.querySelectorAll(".work-card");
        const viewportCenter = window.innerWidth / 2;
        allDomCards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distanceFromCenter = Math.abs(viewportCenter - cardCenter);
          const maxDistance = 400;
          const normDistance = Math.min(distanceFromCenter / maxDistance, 1);
          
          gsap.set(card, { 
            scale: 1.25 - normDistance * 0.45, 
            opacity: 1.0 - normDistance * 0.7,
            zIndex: Math.round((1 - normDistance) * 100)
          });
        });
      },
      onComplete: () => {
        // Sync raw internal positions inside draggable registers
        if (draggableInstanceRef.current) {
          draggableInstanceRef.current.update();
        }
      }
    });
  };

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative w-full border-b border-ink/10 bg-paper py-[130px] text-ink overflow-hidden select-none"
    >
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 mb-[60px] flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <WorkTitle />
          <span className="font-mono text-xs text-ink/40">
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        <span className="font-mono text-xs tracking-widest text-ink/40 uppercase hidden sm:inline-block">
          [ {activeIndex + 1} / {projects.length} ]
        </span>
      </div>

      {/* Viewport (Center-aligned perspective view) */}
      <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing h-[450px] flex items-center justify-center">
        {/* Continuous track string wrapper offset */}
        <div 
          ref={trackRef} 
          className="absolute flex gap-6 items-center will-change-transform"
        >
          {projects.map((project) => (
            <div
              key={project.slug}
              className="work-card relative shrink-0 w-[55vw] sm:w-[30vw] md:w-[22vw] lg:w-[16vw] aspect-[3/4] overflow-hidden rounded-xl border border-ink/5 bg-paper will-change-transform"
            >
              {/* Media Container */}
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 55vw, 16vw"
                  className="object-cover"
                />
              </div>

              {/* Text Information Blocks */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent pointer-events-none" />

              <div className="absolute inset-x-5 bottom-5 z-10 flex flex-col justify-end gap-0.5 pointer-events-none">
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/60">
                  {project.category}
                </span>
                <h3 className="font-display text-base font-medium text-paper tracking-tight">
                  {project.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solid Nav Action Toggles */}
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => handleNav("prev")}
          data-cursor-hover
          className="flex items-center justify-center h-12 px-6 rounded-full border border-ink text-ink bg-transparent font-mono text-xs uppercase tracking-wider transition-all hover:bg-ink hover:text-paper"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => handleNav("next")}
          data-cursor-hover
          className="flex items-center justify-center h-12 px-6 rounded-full border border-ink text-ink bg-transparent font-mono text-xs uppercase tracking-wider transition-all hover:bg-ink hover:text-paper"
        >
          Next
        </button>
      </div>
    </section>
  );
}