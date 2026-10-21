import { devGeo, devSandbox } from "@/lib/checkoutGeo";

// SÓ no ambiente local (vite dev). Escolhe o país simulado para testar o checkout de cada região.
// Em produção o import.meta.env.DEV é falso e este componente nem entra no build.
const GEOS: [string, string][] = [["", "Auto"], ["BR", "Brasil"], ["MX", "México"], ["CO", "Colômbia"], ["CL", "Chile"], ["US", "Outro (USDT)"]];

export default function DevGeoSwitch() {
  const cur = devGeo() || "";
  const sandbox = devSandbox();
  const apply = (geo: string, sb: boolean) => {
    try { sessionStorage.setItem("dev_geo", geo); sessionStorage.setItem("dev_sandbox", sb ? "1" : ""); } catch { /* noop */ }
    window.location.reload();
  };
  return (
    <div className="fixed bottom-3 left-3 z-[200] rounded-xl border border-yellow-400/40 bg-black/85 p-2 text-[11px] text-white shadow-xl backdrop-blur">
      <p className="mb-1 px-1 font-semibold text-yellow-300">DEV · país simulado</p>
      <div className="flex flex-wrap gap-1">
        {GEOS.map(([code, label]) => (
          <button key={label} onClick={() => apply(code, sandbox)}
            className={`rounded-md px-2 py-1 transition ${cur === code ? "bg-yellow-400 text-black" : "bg-white/10 hover:bg-white/20"}`}>{label}</button>
        ))}
      </div>
      <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 px-1 text-white/70">
        <input type="checkbox" checked={sandbox} onChange={(e) => apply(cur, e.target.checked)} /> sandbox Xpag (cobrança de teste + simular pagamento)
      </label>
    </div>
  );
}
