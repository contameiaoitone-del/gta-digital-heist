import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { WhatYouLearn } from "@/components/WhatYouLearn";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { SimplePricing } from "@/components/SimplePricing";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import gtaTheme from "@/assets/gta-theme-loading.mp3";

const Index = () => {
  useBackgroundMusic(gtaTheme, 0.35);
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <About />
      <WhatYouLearn />
      <TestimonialsSection />
      <SimplePricing />
      <GuaranteeSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
