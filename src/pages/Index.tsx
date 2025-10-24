import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Modules } from "@/components/Modules";
import { Guarantee } from "@/components/Guarantee";
import { WhoShouldNotJoin } from "@/components/WhoShouldNotJoin";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <Modules />
      <Guarantee />
      <WhoShouldNotJoin />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
