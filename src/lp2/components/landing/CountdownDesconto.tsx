import { useEffect, useState } from "react";

/**
 * Contador regressivo do desconto da /mentoria-temp.
 *
 * O alvo é um instante absoluto (fim de quarta 22/07/2026, 23:59:59 em
 * Brasília) e não uma data "local": se fosse local, quem acessasse de outro
 * fuso veria o desconto acabar em hora diferente.
 */
const DEADLINE = new Date("2026-07-23T00:00:00-03:00").getTime();

const restante = () => Math.max(0, DEADLINE - Date.now());

const partes = (ms: number) => ({
  dias: Math.floor(ms / 86400000),
  horas: Math.floor((ms % 86400000) / 3600000),
  minutos: Math.floor((ms % 3600000) / 60000),
  segundos: Math.floor((ms % 60000) / 1000),
});

const Bloco = ({ valor, label }: { valor: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-full min-w-[3.25rem] sm:min-w-[4rem] rounded-lg bg-background/70 border border-purple/30 px-2 py-2 sm:py-2.5">
      <span className="block text-2xl sm:text-3xl font-bold text-foreground tabular-nums leading-none">
        {String(valor).padStart(2, "0")}
      </span>
    </div>
    <span className="mt-1.5 text-[0.65rem] sm:text-xs uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  </div>
);

const CountdownDesconto = () => {
  const [ms, setMs] = useState(restante);

  useEffect(() => {
    const id = setInterval(() => setMs(restante()), 1000);
    return () => clearInterval(id);
  }, []);

  const { dias, horas, minutos, segundos } = partes(ms);
  const acabou = ms === 0;

  return (
    <div className="mb-6">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-2.5">
        {acabou ? "Desconto encerrado" : "O desconto acaba em"}
      </span>
      <div className="flex items-start justify-center gap-2 sm:gap-3">
        <Bloco valor={dias} label="dias" />
        <Bloco valor={horas} label="horas" />
        <Bloco valor={minutos} label="min" />
        <Bloco valor={segundos} label="seg" />
      </div>
    </div>
  );
};

export default CountdownDesconto;
