import MasterLayout from "./MasterLayout";
import { ExternalLink } from "lucide-react";

const PAGES = [
  { label: "LP1", path: "/lp1", desc: "Landing page principal 1" },
  { label: "LP2", path: "/lp2", desc: "Landing page principal 2" },
  { label: "Obrigado", path: "/obrigado", desc: "Página de pós-compra" },
  { label: "Termos", path: "/termos", desc: "Termos de uso" },
  { label: "Privacidade", path: "/privacidade", desc: "Política de privacidade" },
  { label: "Contato", path: "/contato", desc: "Página de contato" },
];

export default function LandingPages() {
  return (
    <MasterLayout>
      <div className="p-4 md:p-6 space-y-4 max-w-4xl">
        <div>
          <h1 className="font-gta text-2xl tracking-wide">Landing pages</h1>
          <p className="text-sm text-gray-400">Suas páginas públicas atuais.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PAGES.map((p) => (
            <a
              key={p.path}
              href={p.path}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 bg-[#0a0a0a] p-4 hover:border-[#00ff88] transition flex items-center justify-between"
            >
              <div>
                <div className="font-gta text-lg">{p.label}</div>
                <div className="text-xs text-gray-400">{p.desc}</div>
                <div className="text-[11px] text-gray-600 mt-1">{p.path}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </a>
          ))}
        </div>
      </div>
    </MasterLayout>
  );
}