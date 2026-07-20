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
    image: "/img/work-jd-muskoka_converted.avif",
  },
  {
    slug: "record-planet",
    name: "Record Planet",
    client: "Events & retail",
    category: "Digital",
    year: "2025",
    image: "/img/work-record-planet_converted.avif",
  },
  {
    slug: "z3-data",
    name: "Z3 Data",
    client: "Sustainability platform",
    category: "Digital",
    year: "2024",
    image: "/img/work-z3-data_converted.avif",
  },
  {
    slug: "snowdrop-services",
    name: "Snowdrop Services",
    client: "Commercial cleaning",
    category: "Digital",
    year: "2024",
    image: "/img/work-snowdrop_converted.avif",
  },
  {
    slug: "prosite-plan-africa",
    name: "Prosite Plan Africa",
    client: "Architecture & project management",
    category: "Branding",
    year: "2024",
    image: "/img/work-prosite-plan_converted.avif",
  },
  {
    slug: "digital-two-way",
    name: "Digital Two-Way Communications",
    client: "Telecommunications",
    category: "Branding",
    year: "2023",
    image: "/img/work-digital-twoway_converted.avif",
  },
  {
    slug: "mogharebi",
    name: "Mogharebi",
    client: "Property development",
    category: "Branding",
    year: "2023",
    image: "/img/work-mogharebi_converted.avif",
  },
];
