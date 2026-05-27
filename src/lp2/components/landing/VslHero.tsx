import { Button } from "@/lp2/components/ui/button";
import { ArrowRight } from "lucide-react";

const VslHero = () => {
  const scrollToCTA = () => {
    document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* VSL VTurb Placeholder - cole o código da VTurb aqui dentro */}
          <div className="w-full rounded-2xl overflow-hidden border border-border shadow-2xl bg-black">
            {/* INSIRA AQUI O CÓDIGO DA VTURB */}
          </div>

          <Button
            variant="hero"
            size="xl"
            className="group mt-8 whitespace-normal h-auto"
            onClick={scrollToCTA}
          >
            Quero fazer parte agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VslHero;