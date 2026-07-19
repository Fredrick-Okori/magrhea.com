import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Philosophy from "@/components/Philosophy";
import Shape from "@/components/Shape";
import Visual from "@/components/Visual";
import Gallery from "@/components/Gallery";
import Testimonial from "@/components/Testimonial";
import ProcessSection from "@/components/Process";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Clients />
        <Philosophy />
        <Shape />
        <Visual
          src="/download.png"
          eyebrow="Systems at scale"
          heading="One system. Every touchpoint, unmistakably you."
        />
        <Gallery />
        <Testimonial />
        <ProcessSection />
        <Visual
          src="/videoframe_10387.png"
          eyebrow="Built to last"
          heading="Designed for the long view, not the next trend cycle."
        />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}