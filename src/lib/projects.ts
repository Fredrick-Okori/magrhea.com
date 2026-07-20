export type Category = "Branding" | "Digital";

export type Project = {
  slug: string;
  name: string;
  client: string;
  category: Category;
  year: string;
  image: string;
};

export const categories: Category[] = ["Branding", "Digital"];

export const projects: Project[] = [
  {
    slug: "jd-muskoka",
    name: "JD Muskoka",
    client: "Real estate",
    category: "Digital",
    year: "2025",
    image: "/img/work-jd-muskoka.jpg",
  },
  {
    slug: "record-planet",
    name: "Record Planet",
    client: "Events & retail",
    category: "Digital",
    year: "2025",
    image: "/img/work-record-planet.jpg",
  },
  {
    slug: "z3-data",
    name: "Z3 Data",
    client: "Sustainability platform",
    category: "Digital",
    year: "2024",
    image: "/img/work-z3-data.jpg",
  },
  {
    slug: "snowdrop-services",
    name: "Snowdrop Services",
    client: "Commercial cleaning",
    category: "Digital",
    year: "2024",
    image: "/img/work-snowdrop.jpg",
  },
  {
    slug: "prosite-plan-africa",
    name: "Prosite Plan Africa",
    client: "Architecture & project management",
    category: "Branding",
    year: "2024",
    image: "/img/work-prosite-plan.jpg",
  },
  {
    slug: "digital-two-way",
    name: "Digital Two-Way Communications",
    client: "Telecommunications",
    category: "Branding",
    year: "2023",
    image: "/img/work-digital-twoway.jpg",
  },
  {
    slug: "mogharebi",
    name: "Mogharebi",
    client: "Property development",
    category: "Branding",
    year: "2023",
    image: "/img/work-mogharebi.jpg",
  },
];
