import NetflixLayout from "@/lp1/components/NetflixLayout";
import Header from "@/lp1/components/Header";
import { Button } from "@/lp1/components/ui/button";
import VturbPlayer from "@/lp1/components/VturbPlayer";
import VideoWrapper from "@/lp1/components/VideoWrapper";
import TestimonialsCarousel from "@/lp1/components/TestimonialsCarousel";
import BenefitsCards from "@/lp1/components/BenefitsCards";
import ToolsCarousel from "@/lp1/components/ToolsCarousel";
import PricingCard from "@/lp1/components/PricingCard";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Caminho1 = () => {
  const pricingRef = useRef<HTMLDivElement>(null);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load main video script
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/574be7f8-d9bf-450a-9bfb-e024758a6c13/players/69398b2c7e9567dff5c8ac9f/v4/player.js";
    script.async = true;
    document.head.appendChild(script);

    // Load free tool video script
    const script2 = document.createElement("script");
    script2.src = "https://scripts.converteai.net/574be7f8-d9bf-450a-9bfb-e024758a6c13/players/693992617e9567dff5c8b619/v4/player.js";
    script2.async = true;
    document.head.appendChild(script2);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
    };
  }, []);

  return (
    <NetflixLayout>
      <Header showBackButton />
      
      <section className="bg-background min-h-screen relative">
        {/* Blur effects for modern look */}
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Page Title */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground pt-6 pb-4 relative z-10"
        >
          Comunidade x1 no pix
        </motion.h1>
        
        {/* Video at top */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="pt-2 px-4 max-w-4xl mx-auto">
            <VideoWrapper>
              <VturbPlayer videoId="vid-69398b2c7e9567dff5c8ac9f" />
            </VideoWrapper>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 max-w-4xl py-8 relative z-10">
          {/* CTA Button - scrolls to pricing */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-12"
          >
            <Button 
              onClick={scrollToPricing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-6 py-3 h-auto uppercase tracking-wide font-bold transition-all rounded-lg inline-flex items-center gap-2"
            >
              COMECE AGORA
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Testimonials Carousel */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <TestimonialsCarousel />
          </motion.div>

          {/* Benefits Section */}
          <div className="mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-2xl font-bold text-secondary mb-6 text-center uppercase tracking-wide"
            >
              O Que Você Vai Ter Acesso
            </motion.h2>
            <BenefitsCards />
          </div>

          {/* Tools Carousel Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-base sm:text-lg md:text-2xl font-bold text-secondary mb-6 text-center uppercase tracking-wide leading-relaxed px-2">
              <span className="block sm:inline">Algumas das Ferramentas <span className="text-primary">Gratuitas</span></span>{" "}
              <span className="block sm:inline">que Você Terá Acesso</span>
            </h3>
            <ToolsCarousel />
          </motion.div>

          {/* Inside Look Video */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-xl md:text-2xl font-bold text-secondary mb-6 text-center uppercase tracking-wide leading-relaxed">
              Veja Por Dentro
            </h3>
            <VideoWrapper>
              <VturbPlayer videoId="vid-693992617e9567dff5c8b619" />
            </VideoWrapper>
          </motion.div>

          {/* Pricing Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <PricingCard ref={pricingRef} id="pricing-section" />
          </motion.div>
        </div>
      </section>
    </NetflixLayout>
  );
};

export default Caminho1;
