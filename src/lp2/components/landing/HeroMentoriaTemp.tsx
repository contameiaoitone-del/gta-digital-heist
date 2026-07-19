import { motion } from "framer-motion";
import { useEffect } from "react";
import MentoriaVideo from "@/lp2/components/landing/MentoriaVideo";

// Cabeçalho da página de mentoria (versão temp): sem vídeo de fundo, sem
// título/subtítulo antigos — apenas a headline e o VSL do VTurb logo abaixo.
const VTURB_ACCOUNT_ID = "574be7f8-d9bf-450a-9bfb-e024758a6c13";
const VTURB_VIDEO_ID = "6a57f37fc117205d639fbd9a";
const VTURB_M3U8_ID = "6a57f342aa981e9bb8a8c1b5";

const HeroMentoriaTemp = () => {
  useEffect(() => {
    // Otimização VTurb: _plt + preloads + dns-prefetch (o vídeo é o do topo,
    // então pré-carregamos já na montagem).
    const w = window as unknown as { _plt?: number };
    if (!w._plt) {
      const perf = performance as Performance & { timeOrigin?: number };
      w._plt = perf && perf.timeOrigin ? perf.timeOrigin + perf.now() : Date.now();
    }
    const addLink = (rel: string, href: string, asAttr?: string) => {
      const sel = `link[data-vturb-opt="1"][href="${href}"][rel="${rel}"]`;
      if (document.head.querySelector(sel)) return;
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (asAttr) link.setAttribute("as", asAttr);
      link.setAttribute("data-vturb-opt", "1");
      document.head.appendChild(link);
    };
    addLink("preload", `https://scripts.converteai.net/${VTURB_ACCOUNT_ID}/players/${VTURB_VIDEO_ID}/v4/player.js`, "script");
    addLink("preload", "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js", "script");
    addLink("preload", `https://cdn.converteai.net/${VTURB_ACCOUNT_ID}/${VTURB_M3U8_ID}/main.m3u8`, "fetch");
    addLink("dns-prefetch", "https://cdn.converteai.net");
    addLink("dns-prefetch", "https://scripts.converteai.net");
    addLink("dns-prefetch", "https://images.converteai.net");
    addLink("dns-prefetch", "https://license.vturb.com");
  }, []);

  return (
    <section className="relative overflow-hidden pt-10 md:pt-16 pb-6 md:pb-10">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.h1
            className="text-[1.9rem] sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-[1.15] tracking-tight px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Destrave suas Vendas no <span className="text-purple">WhatsApp</span>
          </motion.h1>

          <motion.div
            className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-glow border border-purple/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <MentoriaVideo videoId={VTURB_VIDEO_ID} accountId={VTURB_ACCOUNT_ID} className="w-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroMentoriaTemp;
