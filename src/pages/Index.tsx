import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { WhatYouLearn } from "@/components/WhatYouLearn";
import { SimplePricing } from "@/components/SimplePricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <About />
      <WhatYouLearn />
      <SimplePricing />
      <Footer />
    </div>
  );
};

export default Index;
