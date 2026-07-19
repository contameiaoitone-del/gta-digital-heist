import { useEffect } from "react";
import HeroMentoriaTemp from "@/lp2/components/landing/HeroMentoriaTemp";
import Problem from "@/lp2/components/landing/Problem";
import AboutFounder from "@/lp2/components/landing/AboutFounder";
import TestimonialsMentoria from "@/lp2/components/landing/TestimonialsMentoria";
import FinalCTAMentoriaTemp from "@/lp2/components/landing/FinalCTAMentoriaTemp";
import FAQMentoriaTemp from "@/lp2/components/landing/FAQMentoriaTemp";
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
      <TestimonialsMentoria subtitle="Resultados reais de quem já passou pela mentoria em grupo:" />
      <FinalCTAMentoriaTemp />
      <FAQMentoriaTemp />
      <Footer />
    </div>
  );
};

export default IndexMentoriaTemp;
