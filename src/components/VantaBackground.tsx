"use client";

import { useEffect, useRef } from "react";
import type { VantaEffect } from "vanta/dist/vanta.net.min";

export default function VantaBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffect | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Deliberately do NOT provide a THREE reference (via options or
    // window.THREE): vanta's shared base class conditionally spins up a
    // THREE.WebGLRenderer whenever one is available, even for a p5-based
    // effect like Topology that never uses it — and that renderer fights
    // p5's own canvas for the context type, crashing init.
    Promise.all([
      import("vanta/dist/vanta.topology.min"),
      import("p5"),
    ]).then(([{ default: TOPOLOGY }, { default: P5Ctor }]) => {
      if (cancelled || !hostRef.current) return;
      // guard against a stray canvas left behind by a superseded effect run
      // (e.g. React StrictMode's double-invoke of effects in dev)
      hostRef.current.innerHTML = "";
      effectRef.current = TOPOLOGY({
        el: hostRef.current,
        p5: P5Ctor,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0xd4d4d4,
        backgroundColor: 0xddd9ce,
      });
    });

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="absolute inset-0" />;
}
