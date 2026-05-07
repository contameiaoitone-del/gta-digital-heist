import { useEffect } from "react";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import WhatYouGet from "@/components/landing/WhatYouGet";
import Features from "@/components/landing/Features";
import AboutFounder from "@/components/landing/AboutFounder";
import Testimonials from "@/components/landing/Testimonials";
import FinalCTA from "@/components/landing/FinalCTA";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

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
