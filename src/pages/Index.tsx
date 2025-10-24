import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Modules } from "@/components/Modules";
import { Testimonials } from "@/components/Testimonials";
import { Results } from "@/components/Results";
import { Pricing } from "@/components/Pricing";
import { MoneyBackGuarantee } from "@/components/MoneyBackGuarantee";
import { FAQ } from "@/components/FAQ";
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
      <Testimonials />
      <Results />
      <Pricing />
      <Guarantee />
      <WhoShouldNotJoin />
      <CTA />
      <MoneyBackGuarantee />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
