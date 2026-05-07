import { useEffect } from "react";
import Hero from "@/lp2/components/landing/Hero";
import Problem from "@/lp2/components/landing/Problem";
import WhatYouGet from "@/lp2/components/landing/WhatYouGet";
import Features from "@/lp2/components/landing/Features";
import AboutFounder from "@/lp2/components/landing/AboutFounder";
import Testimonials from "@/lp2/components/landing/Testimonials";
import FinalCTA from "@/lp2/components/landing/FinalCTA";
import FAQ from "@/lp2/components/landing/FAQ";
import Footer from "@/lp2/components/landing/Footer";

const Index = () => {
  useEffect(() => {
    // Scroll to top on page load, ignoring hash
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <Problem />
      <WhatYouGet />
      <Features />
      <AboutFounder />
      <Testimonials />
      <FinalCTA />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
