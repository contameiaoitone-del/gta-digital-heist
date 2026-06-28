import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RowProps {
  title: string;
  children: ReactNode;
}

const Row = ({ title, children }: RowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="group/row relative">
      <div className="flex items-center gap-2 mb-3 px-4 md:px-12">
        <h2
          className="text-xl md:text-2xl font-bold tracking-wide"
          style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.04em" }}
        >
          {title}
        </h2>
      </div>
      <div className="relative">
        {canPrev && (
          <button
            aria-label="Anterior"
            onClick={() => scroll(-1)}
            className="hidden md:flex items-center justify-center absolute left-0 top-0 bottom-0 z-30 w-12 bg-black/60 hover:bg-black/80 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}
        {canNext && (
          <button
            aria-label="Próximo"
            onClick={() => scroll(1)}
            className="hidden md:flex items-center justify-center absolute right-0 top-0 bottom-0 z-30 w-12 bg-black/60 hover:bg-black/80 opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}
        <div
          ref={ref}
          className="flex gap-2 md:gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 md:px-12 pb-8 pt-2"
          style={{ scrollbarWidth: "none" }}
        >
          <style>{`.row-scroll::-webkit-scrollbar{display:none}`}</style>
          {children}
        </div>
      </div>
    </section>
  );
};

export default Row;
