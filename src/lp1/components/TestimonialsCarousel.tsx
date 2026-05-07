import { useRef, useEffect } from "react";
import dep1 from "@/assets/testimonials/dep-1.png";
import dep2 from "@/assets/testimonials/dep-2.png";
import dep3 from "@/assets/testimonials/dep-3.png";
import dep4 from "@/assets/testimonials/dep-4.png";
import dep5 from "@/assets/testimonials/dep-5.png";
import dep6 from "@/assets/testimonials/dep-6.png";
import dep7 from "@/assets/testimonials/dep-7.png";
import dep8 from "@/assets/testimonials/dep-8.png";
import dep9 from "@/assets/testimonials/dep-9.png";
import dep10 from "@/assets/testimonials/dep-10.png";
import dep11 from "@/assets/testimonials/dep-11.png";
import dep12 from "@/assets/testimonials/dep-12.png";
import dep13 from "@/assets/testimonials/dep-13.png";
import dep14 from "@/assets/testimonials/dep-14.png";

const testimonials = [
  dep1, dep2, dep3, dep4, dep5, dep6, dep7,
  dep8, dep9, dep10, dep11, dep12, dep13, dep14
];

const TestimonialsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollSpeed = 1;

    const autoScroll = () => {
      if (!isHovering.current && container) {
        container.scrollLeft += scrollSpeed;
        
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScroll = scrollWidth - clientWidth;
        
        // Reset to start when reaching the end
        if (scrollLeft >= maxScroll - 5) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);

    const handleMouseEnter = () => { isHovering.current = true; };
    const handleMouseLeave = () => { isHovering.current = false; };
    const handleTouchStart = () => { isHovering.current = true; };
    const handleTouchEnd = () => { 
      setTimeout(() => { isHovering.current = false; }, 2000);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-8" />
      
      <h3 className="text-xl md:text-2xl font-bold text-secondary mb-6 text-center uppercase tracking-wide">
        Depoimentos dos Alunos
      </h3>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'thin' }}
      >
        {[...testimonials, ...testimonials].map((img, index) => (
          <div 
            key={index}
            className="flex-shrink-0 snap-center"
          >
            <img 
              src={img} 
              alt={`Depoimento ${(index % testimonials.length) + 1}`}
              className="w-64 md:w-80 h-auto rounded-2xl shadow-lg shadow-black/50 border border-primary/20"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mt-8" />
    </div>
  );
};

export default TestimonialsCarousel;
