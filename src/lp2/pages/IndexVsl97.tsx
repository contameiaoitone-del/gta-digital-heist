import { useEffect } from "react";
import VslHero from "@/lp2/components/landing/VslHero";
import Features from "@/lp2/components/landing/Features";
import AboutFounder from "@/lp2/components/landing/AboutFounder";
import Testimonials from "@/lp2/components/landing/Testimonials";
import FinalCTA97 from "@/lp2/components/landing/FinalCTA97";
import FAQ from "@/lp2/components/landing/FAQ";
import Footer from "@/lp2/components/landing/Footer";

const IndexVsl97 = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <VslHero />
      <Features />
      <AboutFounder />
      <Testimonials />
      <FinalCTA97 />
      <FAQ />
      <Footer />
    </div>
  );
};

export default IndexVsl97;