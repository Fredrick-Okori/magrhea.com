export type Category = "Branding" | "Digital" | "Motion" | "Experiment";

export type Project = {
  slug: string;
  name: string;
  client: string;
  category: Category;
  year: string;
  gradient: string;
  image: string;
};

export const categories: Category[] = [
  "Branding",
  "Digital",
  "Motion",
  "Experiment",
];

export const projects: Project[] = [
  {
    slug: "halo-audio",
    name: "Halo Audio",
    client: "Consumer electronics",
    category: "Branding",
    year: "2026",
    gradient: "from-[#9caa7c] via-[#5f6f45] to-[#0a0a0a]",
    image: "/img/studio-corridor.jpg",
  },
  {
    slug: "ferro",
    name: "Ferro",
    client: "Fintech platform",
    category: "Digital",
    year: "2025",
    gradient: "from-[#3f4bff] via-[#7a3fff] to-[#0a0a0a]",
    image: "/img/studio-dark.jpg",
  },
  {
    slug: "night-market",
    name: "Night Market",
    client: "Hospitality group",
    category: "Motion",
    year: "2025",
    gradient: "from-[#ff5a3c] via-[#ff8a3c] to-[#0a0a0a]",
    image: "/img/studio-desk.jpg",
  },
  {
    slug: "polymer",
    name: "Polymer",
    client: "Material science",
    category: "Branding",
    year: "2025",
    gradient: "from-[#f4f2ec] via-[#b3b0a6] to-[#0a0a0a]",
    image: "/img/studio-room.jpg",
  },
  {
    slug: "signal-one",
    name: "Signal One",
    client: "Broadcast network",
    category: "Digital",
    year: "2024",
    gradient: "from-[#3fffe0] via-[#3fb0ff] to-[#0a0a0a]",
    image: "/img/studio-texture.jpg",
  },
  {
    slug: "afterglow",
    name: "Afterglow",
    client: "Independent film",
    category: "Motion",
    year: "2024",
    gradient: "from-[#ff3fb0] via-[#ff3f6a] to-[#0a0a0a]",
    image: "/img/studio-corridor.jpg",
  },
  {
    slug: "specimen",
    name: "Specimen",
    client: "Self-initiated",
    category: "Experiment",
    year: "2024",
    gradient: "from-[#8f8f8f] via-[#3f3f3f] to-[#0a0a0a]",
    image: "/img/studio-dark.jpg",
  },
  {
    slug: "kilo",
    name: "Kilo",
    client: "Logistics startup",
    category: "Digital",
    year: "2023",
    gradient: "from-[#ffd93f] via-[#ff9d3f] to-[#0a0a0a]",
    image: "/img/studio-desk.jpg",
  },
];
