import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { appendUtmToUrl, trackPixelEvent } from "@/lp1/lib/utm";

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  isLocked?: boolean;
  externalLink?: string;
}

const ProductCard = ({ title, description, imageUrl, link, isLocked = false, externalLink }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isLocked) {
      trackPixelEvent('ViewContent', { content_name: title });
      if (externalLink) {
        window.open(appendUtmToUrl(externalLink), '_blank');
      } else {
        navigate(link);
      }
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`w-full max-w-4xl mx-auto overflow-hidden group relative ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
    >
      <img 
        src={imageUrl} 
        alt={title}
        className={`w-full h-auto object-cover rounded-xl transition-all duration-300 ${
          isLocked 
            ? 'opacity-40 grayscale' 
            : 'group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary/20'
        }`}
      />
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <Lock className="w-16 h-16 md:w-24 md:h-24 text-foreground/80 mx-auto mb-4" />
            <p className="text-xl md:text-3xl font-bold text-foreground uppercase tracking-wide">
              EM BREVE
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
