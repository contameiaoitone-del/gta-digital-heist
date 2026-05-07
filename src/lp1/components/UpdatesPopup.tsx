
import { useEffect, useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/lp1/components/ui/dialog";

interface UpdatesPopupProps {
  onClose?: () => void;
}

const UpdatesPopup = ({ onClose }: UpdatesPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup only on page load/reload
    setIsOpen(true);
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-black border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-netflix text-red-600 mb-2">
            Atualizações Flow
          </DialogTitle>
          <DialogDescription className="text-base">
            CONFIRA AS ÚLTIMAS ATUALIZAÇÕES DO NOSSO SISTEMA
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <h3 className="text-xl font-netflix text-green-500 mb-2">NOVAS ATUALIZAÇÕES</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Bônus por Montante para Afiliados</li>
              <li>Nova Função de Manipular Apostas Válidas</li>
              <li>Aplicativo de Sinais GRÁTIS</li>
              <li>Plataforma de Jogos Retro</li>
              <li>Nova Função de Pular CPA</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-netflix text-green-500 mb-2">Últimas atualizações</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Painel Exclusivo para Afiliado</li>
              <li>Sistema de Subafiliado</li>
              <li>Pagamento de comissão por %</li>
              <li>Notificações Flow</li>
              <li>Função de ocultar cota premiada (RIFA)</li>
              <li>Jogos com GGR</li>
              <li>Pixel de Trackeamento Facebook</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatesPopup;
