import { Youtube } from "lucide-react";
import perfil from "@/lp1/assets/joao-perfil.jpg";
import bannerLow from "@/lp1/assets/banner-lowticket.webp";
import bannerX1Global from "@/lp1/assets/banner-x1global.webp";
import bannerZapdata from "@/lp1/assets/banner-zapdata.webp";

const YOUTUBE_URL = "https://www.youtube.com/@joaolucassps";

const banners = [
  { src: bannerLow, alt: "Destrave no lowticket no WhatsApp", href: "https://joaolucasps.co/lm-low" },
  { src: bannerX1Global, alt: "Venda sua oferta BR em todo o mundo", href: "https://joaolucasps.co/lm-x1global" },
  { src: bannerZapdata, alt: "Zapdata — automação para quem vende por mensagens", href: "https://zapdata.co/lp" },
];

// /lp1: página de links (estilo link na bio) em fundo preto.
const Index = () => (
  <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10 sm:py-14">
    <div className="w-full max-w-md flex flex-col items-center text-center">
      <img
        src={perfil}
        alt="João Lucas"
        className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4"
        style={{ borderColor: "#ff6a00" }}
      />

      <div className="mt-6 flex items-center gap-2">
        <span className="text-lg font-bold">@joaolucassps</span>
        <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" aria-label="Canal do João Lucas no YouTube">
          <Youtube className="w-7 h-7 text-red-600 hover:text-red-500 transition-colors" />
        </a>
      </div>

      <p className="mt-3 text-base sm:text-lg leading-relaxed text-white/75">
        Tenha acesso a estratégia que me mantém no mercado de{" "}
        <strong className="font-bold text-white">Vendas no X1</strong> por{" "}
        <strong className="font-bold" style={{ color: "#ff6a00" }}>
          mais de 6 anos seguidos.
        </strong>
      </p>

      <div className="mt-8 w-full flex flex-col gap-5">
        {banners.map((b) => (
          <a
            key={b.href}
            href={b.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99]"
          >
            <img src={b.src} alt={b.alt} className="w-full h-auto block" loading="lazy" decoding="async" />
          </a>
        ))}
      </div>
    </div>
  </main>
);

export default Index;
