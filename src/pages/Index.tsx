import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { WhatYouLearn } from "@/components/WhatYouLearn";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { VideoResults } from "@/components/VideoResults";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { SimplePricing } from "@/components/SimplePricing";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <About />
      <WhatYouLearn />
      <TestimonialsSection />
      <VideoResults />
      <SimplePricing />
      <GuaranteeSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
