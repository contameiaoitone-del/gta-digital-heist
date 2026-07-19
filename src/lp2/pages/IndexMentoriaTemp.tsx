import { useEffect } from "react";
import HeroMentoriaTemp from "@/lp2/components/landing/HeroMentoriaTemp";
import Problem from "@/lp2/components/landing/Problem";
import AboutFounder from "@/lp2/components/landing/AboutFounder";
import TestimonialsMentoria from "@/lp2/components/landing/TestimonialsMentoria";
import FinalCTAMentoriaTemp from "@/lp2/components/landing/FinalCTAMentoriaTemp";
import FAQMentoria from "@/lp2/components/landing/FAQMentoria";
import Footer from "@/lp2/components/landing/Footer";

const IndexMentoriaTemp = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroMentoriaTemp />
      <Problem />
      <AboutFounder />
      <TestimonialsMentoria />
      <FinalCTAMentoriaTemp />
      <FAQMentoria />
      <Footer />
    </div>
  );
};

export default IndexMentoriaTemp;
