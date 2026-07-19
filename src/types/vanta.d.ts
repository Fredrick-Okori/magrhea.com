declare module "vanta/dist/vanta.net.min" {
  import type * as THREE from "three";

  export interface VantaNetOptions {
    el: HTMLElement;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
    showDots?: boolean;
  }

  export interface VantaEffect {
    destroy: () => void;
    resize: () => void;
  }

  export default function NET(options: VantaNetOptions): VantaEffect;
}

declare module "vanta/dist/vanta.dots.min" {
  import type * as THREE from "three";
  import type { VantaEffect } from "vanta/dist/vanta.net.min";

  export interface VantaDotsOptions {
    el: HTMLElement;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    color2?: number;
    backgroundColor?: number;
    size?: number;
    spacing?: number;
    showLines?: boolean;
  }

  export default function DOTS(options: VantaDotsOptions): VantaEffect;
}

declare module "vanta/dist/vanta.topology.min" {
  import type * as THREE from "three";
  import type P5 from "p5";
  import type { VantaEffect } from "vanta/dist/vanta.net.min";

  export interface VantaTopologyOptions {
    el: HTMLElement;
    THREE?: typeof THREE;
    p5: typeof P5;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
  }

  export default function TOPOLOGY(options: VantaTopologyOptions): VantaEffect;
}
