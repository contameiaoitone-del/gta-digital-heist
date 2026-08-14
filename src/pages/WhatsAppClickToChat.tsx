const PHONE = "5531973504913";
const PHONE_DISPLAY = "+55 31 97350-4913";
const MESSAGE = "¡Quiero sesiones de fotos profesionales sin salir de casa!";
const REDIRECT_MESSAGE = "Hola, vengo de TikTok, ¡estoy interesada en sesiones de fotos!";

const redirectLink = `https://wa.me/${PHONE}?text=${encodeURIComponent(REDIRECT_MESSAGE)}`;
const appLink = redirectLink;
const webLink = redirectLink;
const downloadLink = "https://www.whatsapp.com/download";

const WhatsAppLogo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 2C8.28 2 2 8.28 2 16c0 2.61.71 5.05 1.94 7.15L2 30l7.06-1.9A13.9 13.9 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2Z"
      stroke="#25D366"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M11.5 10.5c.3-.6.6-.6.9-.6h.7c.2 0 .5 0 .7.6.3.6 1 2.2 1.1 2.4.1.2.2.4 0 .7-.1.3-.2.4-.4.6-.2.2-.4.5-.6.6-.2.2-.4.4-.2.8.2.4 1 1.7 2.2 2.7 1.5 1.3 2.7 1.7 3.1 1.9.4.2.6.1.8-.1.2-.2.9-1 1.1-1.4.2-.4.5-.3.8-.2.3.1 2.1 1 2.5 1.2.4.2.6.3.7.4.1.2.1 1-.2 1.9-.3.9-1.9 1.7-2.6 1.8-.7.1-1.5.2-4.9-1-3.9-1.5-6.4-5.3-6.6-5.5-.2-.3-1.6-2.1-1.6-4 0-1.9 1-2.8 1.4-3.2Z"
      fill="#25D366"
    />
  </svg>
);

const CtaButton = ({ href, variant, children }: { href: string; variant: "solid" | "outline"; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={
      variant === "solid"
        ? "block w-full max-w-[360px] rounded-full py-3 text-center font-semibold text-white transition-colors"
        : "block w-full max-w-[360px] rounded-full py-3 text-center font-semibold border transition-colors"
    }
    style={
      variant === "solid"
        ? { backgroundColor: "#25D366" }
        : { borderColor: "#111", color: "#111" }
    }
  >
    {children}
  </a>
);

const footerColumns = [
  {
    title: "O que fazemos",
    links: ["Recursos", "Blog", "Segurança", "Para empresas"],
  },
  {
    title: "Quem somos",
    links: ["Quem somos", "Carreiras", "Central de marcas", "Privacidade"],
  },
  {
    title: "Use o WhatsApp",
    links: ["Android", "iPhone", "Mac/PC", "WhatsApp Web"],
  },
  {
    title: "Precisa de ajuda?",
    links: ["Fale conosco", "Central de Ajuda", "Apps", "Alertas de Segurança"],
  },
];

const WhatsAppClickToChat = () => {
  return (
    <div className="min-h-screen bg-white text-[#111] flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <a
          href={redirectLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold flex items-center gap-2"
        >
          Baixar
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v13m0 0 5-5m-5 5-5-5M4 21h16" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div className="flex items-center gap-2 font-semibold text-lg">
          <WhatsAppLogo size={26} />
          WhatsApp
        </div>

        <button aria-label="Menu" className="flex flex-col gap-1.5">
          <span className="block w-6 h-0.5 bg-[#111]" />
          <span className="block w-6 h-0.5 bg-[#111]" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10 text-center">
        <p className="text-lg text-gray-800 mb-8">
          Conversar com {PHONE_DISPLAY} no WhatsApp
        </p>

        <div className="w-full max-w-[520px] mb-10">
          <div className="bg-gray-100 rounded-2xl px-6 py-6 text-gray-500 text-left">
            {MESSAGE}
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <CtaButton href={appLink} variant="solid">
            Abrir app
          </CtaButton>
          <CtaButton href={webLink} variant="outline">
            Continuar para o WhatsApp Web
          </CtaButton>
        </div>

        <p className="mt-8 flex items-center gap-2 text-sm">
          <WhatsAppLogo size={18} />
          Não tem o app?{" "}
          <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            Baixar agora
          </a>
        </p>
      </main>

      <footer className="bg-[#111b21] text-gray-300 px-6 py-12 mt-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-white font-semibold text-xl mb-10">
            <WhatsAppLogo size={26} />
            WhatsApp
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="text-xs text-gray-500 mb-4">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white text-sm hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WhatsAppClickToChat;
