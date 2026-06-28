import { useEffect } from "react";
import HeroMentoria from "@/lp2/components/landing/HeroMentoria";
import Problem from "@/lp2/components/landing/Problem";
import AboutFounder from "@/lp2/components/landing/AboutFounder";
import TestimonialsMentoria from "@/lp2/components/landing/TestimonialsMentoria";
import FinalCTAMentoria from "@/lp2/components/landing/FinalCTAMentoria";
import FAQMentoria from "@/lp2/components/landing/FAQMentoria";
import Footer from "@/lp2/components/landing/Footer";

const IndexMentoria = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroMentoria />
      <Problem />
      <AboutFounder />
      <TestimonialsMentoria />
      <FinalCTAMentoria />
      <FAQMentoria />
      <Footer />
    </div>
  );
};

export default IndexMentoria;