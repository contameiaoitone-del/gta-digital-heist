import { Button } from "@/lp2/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

const VslHero = () => {
  const scrollToCTA = () => {
    document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (document.querySelector('script[data-vturb="6a19e1419450495a8b53d4eb"]')) return;
    const s = document.createElement("script");
    s.src =
      "https://scripts.converteai.net/574be7f8-d9bf-450a-9bfb-e024758a6c13/players/6a19e1419450495a8b53d4eb/v4/player.js";
    s.async = true;
    s.setAttribute("data-vturb", "6a19e1419450495a8b53d4eb");
    document.head.appendChild(s);
  }, []);

  return (
    <section className="relative pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Faça de <span className="text-purple">R$100</span> a{" "}
            <span className="text-purple">R$300</span> de lucro com WhatsApp
          </h1>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-500">
              Sem Bloqueios
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-1.5 text-sm font-semibold text-green-500">
              100% Automático
            </span>
          </div>

          <div
            className="w-full"
            dangerouslySetInnerHTML={{
              __html:
                '<vturb-smartplayer id="vid-6a19e1419450495a8b53d4eb" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer>',
            }}
          />

          <Button
            size="xl"
            onClick={scrollToCTA}
            className="group mt-8 w-full max-w-md text-lg whitespace-normal h-auto py-5 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25"
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