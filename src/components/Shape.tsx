"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "@/components/SplitReveal";
import ParallaxImage from "@/components/ParallaxImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const cards = [
  {
    num: "01",
    mark: "IDENTITY",
    title: "Naming & mark",
    body: "Naming, logotype, and a visual language built to survive a hundred applications you haven't thought of yet.",
  },
  {
    num: "02",
    mark: "WORLD",
    title: "Brand world",
    body: "Art direction, photography language, and campaign systems that keep a brand recognisable at any volume.",
  },
  {
    num: "03",
    mark: "DIGITAL",
    title: "Digital expression",
    body: "Sites, product interfaces, and motion systems that carry the identity into the places people actually use it.",
  },
];

export default function Shape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      const calculateScrollWidth = () => track.scrollWidth - window.innerWidth;

      // 1. Primary Master Timeline setup
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 0.8, // Slightly tighter scrub factor for responsive tactile feedback
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          invalidateOnRefresh: true,
        },
      });

      // Slide translation
      tl.to(track, {
        x: () => -calculateScrollWidth(),
        ease: "none",
      });

      // 2. Premium Effect: Kinetic Scroll Skew Interception
      let proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(track, "skewX", "deg");
      const clamp = gsap.utils.clamp(-8, 8); // Keeps the lean elegant without clipping bounds

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${track.scrollWidth}`,
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -250);
          // Only update if skew changes to prevent setting properties unnecessarily
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
              onUpdate: () => skewSetter(proxy.skew),
            });
          }
        },
      });

      // 3. Premium Effect: Fluid Parallax Counter-Pull & 3D Depth
      const cardsArray = gsap.utils.toArray<HTMLElement>(".gsap-card");
      
      cardsArray.forEach((card) => {
        const title = card.querySelector(".card-title");
        const body = card.querySelector(".card-body");
        const num = card.querySelector(".card-num");

        if (title && body) {
          // Counter-pull child items to create deep multi-layered parallax
          gsap.fromTo(
            [title, body],
            { x: 45, opacity: 0.6 },
            {
              x: -45,
              opacity: 1,
              stagger: 0.05,
              ease: "power1.out",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tl,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }

        if (num) {
          // Subtle individual parallax shift for structural markers
          gsap.fromTo(
            num,
            { x: 20 },
            {
              x: -20,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tl,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="approach"
      className="relative h-screen w-full overflow-hidden bg-paper py-16 text-ink select-none"
    >
      <ParallaxImage
        src="/img/work-visual-branding_converted.avif"
        mask
        maskColorClassName="bg-ink"
        speed={0.2}
        className="pointer-events-none absolute -right-[5%] -top-[10%] z-0 h-[50%] w-[35%] opacity-[0.07]"
      />

      <div className="relative z-10 flex h-full w-full flex-col justify-between">
        {/* Editorial Header Section */}
        <div className="mx-auto w-full max-w-[1240px] px-6 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-end">
            <SplitReveal
              as="h2"
              type="words"
              className="font-display max-w-[650px] text-[clamp(36px,4.5vw,56px)] font-bold leading-[1.02] tracking-tight"
            >
              What we shape when a brand comes to us.
            </SplitReveal>
            
            <div className="max-w-[280px] font-sans text-[14px] leading-relaxed text-ink/60 antialiased">
              Three ways in — usually all three, in whatever order the work
              actually needs.
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Track Wrapper */}
        <div className="relative flex flex-1 items-center overflow-hidden">
          <div 
            ref={trackRef} 
            className="flex flex-nowrap gap-8 px-6 will-change-transform md:px-[15vw]"
          >
            {cards.map((card) => (
              <div
                key={card.mark}
                className="gsap-card group relative flex h-[440px] w-[320px] shrink-0 flex-col justify-between border border-ink/10 bg-paper/50 p-8 backdrop-blur-[2px] transition-all duration-500 hover:border-ink/30 hover:bg-ink/[0.01] md:w-[420px] md:p-10"
              >
                {/* Background Progress Highlight Accent Line */}
                <div className="absolute top-0 left-0 h-[2px] w-0 bg-ink transition-all duration-700 ease-out group-hover:w-full" />

                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-semibold tracking-[0.2em] text-ink/40 transition-colors duration-300 group-hover:text-ink">
                    {card.mark}
                  </span>
                  <span className="card-num font-mono text-sm font-light text-ink/20 transition-colors duration-300 group-hover:text-ink/40 will-change-transform">
                    {card.num}
                  </span>
                </div>

                <div className="overflow-hidden py-2">
                  <h3 className="card-title font-display text-2xl font-medium tracking-tight text-ink md:text-3xl will-change-transform">
                    {card.title}
                  </h3>
                  <p className="card-body mt-4 font-sans text-[14.5px] leading-[1.6] text-ink/60 antialiased transition-colors duration-500 group-hover:text-ink/80 will-change-transform">
                    {card.body}
                  </p>
                </div>

                <div className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink/30 transition-transform duration-500 group-hover:translate-x-2 group-hover:text-ink">
                  Explore Core Track ↗
                </div>
              </div>
            ))}
            
            {/* Safe ending padding spacer */}
            <div className="w-[15vw] shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}