import { useEffect } from "react";

// Dígito em formato de placar (flip card): argolas no topo, divisão no meio.
const Digit = ({ value }: { value: string }) => (
  <div className="relative w-16 h-24 sm:w-24 sm:h-36 md:w-28 md:h-40 rounded-xl bg-gradient-to-b from-[#2a2a2a] to-[#161616] border border-white/10 shadow-lg shadow-black/60 flex items-center justify-center">
    <div className="absolute -top-2 inset-x-0 flex justify-around px-3 sm:px-5">
      <span className="w-2.5 h-4 sm:w-3 sm:h-5 rounded-full border-2 border-[#ff6a00]" />
      <span className="w-2.5 h-4 sm:w-3 sm:h-5 rounded-full border-2 border-[#ff6a00]" />
    </div>
    <span
      className="text-6xl sm:text-8xl md:text-9xl leading-none text-white"
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      aria-hidden="true"
    >
      {value}
    </span>
    <div className="absolute inset-x-0 top-1/2 h-px bg-black/80 shadow-[0_1px_0_rgba(255,255,255,0.08)]" />
  </div>
);

// /mentoria encerrada: só aviso, timer zerado (placar) e CTA para o Zapdata.
const IndexMentoria = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Mentoria encerrada";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-10 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold">
          Mentoria <span className="text-red-500">encerrada</span>
        </h1>
        <p className="text-sm sm:text-base font-light text-white/60">Talvez volte ano que vem :)</p>
      </div>

      <div role="timer" aria-label="00:00" className="flex items-center gap-1">
        <Digit value="0" />
        <Digit value="0" />
        <span className="text-4xl sm:text-6xl font-bold text-white/70 -mx-0.5" aria-hidden="true">:</span>
        <Digit value="0" />
        <Digit value="0" />
      </div>

      <a
        href="https://zapdata.co/lp/"
        className="rounded-xl px-8 py-4 text-lg font-bold text-white"
        style={{ backgroundColor: "#ff6a00" }}
      >
        Teste o Zapdata
      </a>
    </div>
  );
};

export default IndexMentoria;
