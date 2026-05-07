import { useState } from "react";
import { appendUtmToUrl, trackPixelEvent } from "@/lp1/lib/utm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lp1/components/ui/dialog";
import { Button } from "@/lp1/components/ui/button";

interface ConsultoriaQuizPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConsultoriaQuizPopup = ({ open, onOpenChange }: ConsultoriaQuizPopupProps) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    jaRodaX1: "",
    intuito: "",
    deAcordo: "",
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleAnswer = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });
    
    if (field === "deAcordo") {
      if (value === "nao") {
        // Close popup if user says no
        onOpenChange(false);
        resetQuiz();
      } else if (value === "sim") {
        // Redirect to WhatsApp
        const message = encodeURIComponent("Opa, tenho interesse em agendar uma call");
        trackPixelEvent('Lead', { content_name: 'Call 1 Hora' });
        window.open(appendUtmToUrl(`https://wa.me/5531998284929?text=${message}`), '_blank');
        onOpenChange(false);
        resetQuiz();
      }
    } else {
      handleNext();
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ jaRodaX1: "", intuito: "", deAcordo: "" });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetQuiz();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-xl border-primary/30 shadow-2xl shadow-primary/10">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-foreground">
            {step === 1 && "Pergunta 1 de 3"}
            {step === 2 && "Pergunta 2 de 3"}
            {step === 3 && "Pergunta 3 de 3"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-center text-lg font-medium text-foreground">
                Hoje você já roda x1?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  className={`min-w-24 transition-all ${
                    answers.jaRodaX1 === "sim" 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
                  }`}
                  onClick={() => handleAnswer("jaRodaX1", "sim")}
                >
                  Sim
                </Button>
                <Button
                  className={`min-w-24 transition-all ${
                    answers.jaRodaX1 === "nao" 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
                  }`}
                  onClick={() => handleAnswer("jaRodaX1", "nao")}
                >
                  Não
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-center text-lg font-medium text-foreground">
                Qual seu intuito de fazer a Consultoria comigo?
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  className={`min-w-32 transition-all ${
                    answers.intuito === "destravar" 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
                  }`}
                  onClick={() => handleAnswer("intuito", "destravar")}
                >
                  Destravar
                </Button>
                <Button
                  className={`min-w-32 transition-all ${
                    answers.intuito === "aprender" 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
                  }`}
                  onClick={() => handleAnswer("intuito", "aprender")}
                >
                  Aprender do 0
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <p className="text-center text-base font-medium text-foreground leading-relaxed px-2">
                A call é no valor de R$497, sem hora para acabar, só acaba quando tiver sem dúvidas, e ela não te da direito a suporte individual no WhatsApp, apenas suporte normal na DM do Instagram, está de acordo?
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  className="min-w-24 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => handleAnswer("deAcordo", "sim")}
                >
                  Sim
                </Button>
                <Button
                  className="min-w-24 bg-transparent border-2 border-primary text-primary hover:bg-primary/10"
                  onClick={() => handleAnswer("deAcordo", "nao")}
                >
                  Não
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 pb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                s === step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultoriaQuizPopup;
