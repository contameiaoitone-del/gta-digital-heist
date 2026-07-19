import { ArrowRight } from "lucide-react";
import { cn } from "@/lp2/lib/utils";

/**
 * Botão de entrada da mentoria (/mentoria-temp). Usado em dois lugares com o
 * mesmo visual: abaixo do VSL (rola até a seção final) e na própria seção
 * final (abre o grupo). Por isso vive num componente só.
 */
const EntrarMentoriaButton = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "group relative w-full inline-flex items-center justify-center gap-3",
      "rounded-xl px-6 py-5 sm:py-6",
      "bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500",
      "text-white text-lg sm:text-xl font-extrabold uppercase tracking-wide",
      "shadow-lg shadow-green-600/30 hover:shadow-2xl hover:shadow-green-500/40",
      "ring-1 ring-inset ring-white/20",
      "transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className,
    )}
  >
    <span>Entrar na mentoria</span>
    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
  </button>
);

export default EntrarMentoriaButton;
