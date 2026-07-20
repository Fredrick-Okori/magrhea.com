import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Philosophy from "@/components/Philosophy";
import Shape from "@/components/Shape";
import Visual from "@/components/Visual";
import Work from "@/components/Work";
import Gallery from "@/components/Gallery";
import Testimonial from "@/components/Testimonial";
import ProcessSection from "@/components/Process";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ShowcaseSection from "@/components/ShowCaseSection";
import StartProjectSection from "@/components/StartProjectSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="flex-1">
            <Hero />
            {/* <Clients /> */}
            <Philosophy />
            <ShowcaseSection/>
            <Shape />
         
            <Work />
            {/* <Gallery />
            <Testimonial /> */}
            <ProcessSection />

            <FAQ />
            <StartProjectSection/>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
