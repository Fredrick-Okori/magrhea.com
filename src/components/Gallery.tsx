"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    src: "/img/studio-corridor.jpg",
    num: "01",
    label: "Where the work gets reviewed, line by line.",
  },
  {
    src: "/img/studio-texture.jpg",
    num: "02",
    label: "Every system starts as paper.",
  },
  {
    src: "/img/studio-dark.jpg",
    num: "03",
    label: "Some ideas only work in the dark.",
  },
  {
    src: "/img/studio-desk.jpg",
    num: "04",
    label: "The studio, on a Tuesday morning.",
  },
  {
    src: "/img/studio-room.jpg",
    num: "05",
    label: "Space to think before we design.",
  },
  {
    src: "/img/studio-interior.jpg",
    num: "06",
    label: "Natural light, kept for the long meetings.",
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const setupPin = () => {
        const distance = track.scrollWidth - window.innerWidth;
        return gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance}`,
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      };

      setupPin();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ink text-paper"
    >
      <div ref={trackRef} className="flex h-screen w-max">
        <div className="flex h-full w-[85vw] shrink-0 flex-col items-start justify-center px-8 md:w-[45vw] md:px-16">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-bone">
            Inside the studio
          </p>
          <h2 className="font-display max-w-md text-[clamp(28px,4.5vw,52px)] font-medium leading-[1.1]">
            A handful of rooms where the work actually happens.
          </h2>
        </div>

        {panels.map((panel) => (
          <div
            key={panel.num}
            className="relative h-full w-[85vw] shrink-0 md:w-[42vw]"
          >
            <Image
              src={panel.src}
              alt=""
              fill
              sizes="85vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <div className="absolute inset-x-7 bottom-8 md:inset-x-9">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-bone">
                {panel.num}
              </span>
              <p className="font-display mt-2 max-w-sm text-xl leading-tight text-paper md:text-2xl">
                {panel.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
