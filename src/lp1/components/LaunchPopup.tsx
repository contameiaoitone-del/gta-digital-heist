
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lp1/components/ui/dialog";
import { useIsMobile } from "@/lp1/hooks/use-mobile";
import "../styles/animations.css";

interface LaunchPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LaunchPopup = ({ open, onOpenChange }: LaunchPopupProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-black border-gray-800 w-[95%] mx-auto p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-netflix text-red-600 mb-2 text-center">
            NOVOS LANÇAMENTOS
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-center text-white text-sm sm:text-base">
            Apresentamos nossos novos layouts!
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 justify-items-center">
            <div className="relative animate-pulse-button w-full max-w-[200px]">
              <a 
                href="https://raspadinhachinesa.flowtech.cloud/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img 
                  src="https://flowtech.cloud/RASPAKF.png" 
                  alt="Nova Plataforma RASPAKF" 
                  className="rounded-lg shadow-lg w-full transform transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute -top-2 -right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold rotate-12">
                  NOVO
                </div>
              </a>
            </div>

            <div className="relative animate-pulse-button w-full max-w-[200px]">
              <a 
                href="https://raspaslot.flowtech.cloud/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img 
                  src="https://flowtech.cloud/raspaslot.png" 
                  alt="Nova Plataforma Raspaslot" 
                  className="rounded-lg shadow-lg w-full transform transition-transform duration-300 hover:scale-105"
                />
              </a>
            </div>

            <div className="relative animate-pulse-button w-full max-w-[200px] col-span-2 sm:col-span-1 mx-auto">
              <a 
                href="https://bingo.flowtech.cloud/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <img 
                  src="https://flowtech.cloud/BINGO.png" 
                  alt="Nova Plataforma Bingo" 
                  className="rounded-lg shadow-lg w-full transform transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute -top-2 -right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold rotate-12">
                  NOVO
                </div>
              </a>
            </div>
          </div>
          
          <p className="text-center text-white text-xs sm:text-sm">
            CLIQUE PARA ACESSAR AGORA!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LaunchPopup;
