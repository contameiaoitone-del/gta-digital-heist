import { Check, X, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Pricing = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/20 via-background to-card/20" />
      <div className="atmospheric-haze" />
      <div className="god-rays" />
      <div className="noise-texture" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full border-2 border-primary/30 bg-primary/5 backdrop-blur-sm mb-4 sm:mb-6">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider">
              Oferta Exclusiva
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-neon-pink neon-glow">INVISTA</span>{" "}
            <span className="text-foreground">EM</span>{" "}
            <span className="text-neon-cyan neon-glow">VOCÊ</span>{" "}
            <span className="text-foreground">HOJE</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            O mesmo treinamento que custa milhares agora está ao seu alcance
          </p>
        </div>

        {/* Pricing Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16">
          {/* Other Courses */}
          <Card className="p-6 sm:p-8 bg-card/30 backdrop-blur-sm border-2 border-border relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-muted via-muted to-muted" />
            
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-muted-foreground mb-2">
                Outros Cursos
              </h3>
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-muted-foreground line-through mb-2">
                R$5.997
              </div>
              <p className="text-sm text-muted-foreground">Preço médio do mercado</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-muted-foreground">
                  Conteúdo genérico e ultrapassado
                </span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-muted-foreground">
                  Sem suporte individual
                </span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-muted-foreground">
                  Resultados demorados ou inexistentes
                </span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-muted-foreground">
                  Comunidade morta
                </span>
              </div>
            </div>
          </Card>

          {/* Real Life Academy */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-card/50 to-accent/10 backdrop-blur-sm border-2 border-primary relative overflow-hidden shadow-soft-pink animate-glow-pulse">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
            
            {/* Popular Badge */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center shadow-soft-pink rotate-12">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                Real Life Academy
              </h3>
              <div className="text-2xl sm:text-3xl text-muted-foreground line-through mb-2">
                De R$1.997
              </div>
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2">
                <span className="text-primary neon-glow">R$397</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs sm:text-sm font-bold text-primary">
                  80% DE DESCONTO - SOMENTE HOJE
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm sm:text-base text-foreground font-medium">
                  +300 aulas atualizadas toda semana
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm sm:text-base text-foreground font-medium">
                  Suporte VIP 24/7 via WhatsApp
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm sm:text-base text-foreground font-medium">
                  Resultados comprovados em 30-90 dias
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm sm:text-base text-foreground font-medium">
                  Comunidade VIP de +5.000 alunos
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm sm:text-base text-foreground font-medium">
                  Garantia de 7 dias - 100% do dinheiro de volta
                </span>
              </div>
            </div>

            <Button
              size="xl"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft-pink hover:shadow-soft-cyan transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              QUERO GARANTIR POR R$397
            </Button>

            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4">
              🔒 Compra 100% segura • Acesso imediato
            </p>
          </Card>
        </div>

        {/* Value Stack */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 bg-card/50 backdrop-blur-sm border-2 border-accent/30">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">
              <span className="text-accent neon-glow">BÔNUS EXCLUSIVOS</span>{" "}
              <span className="text-foreground">INCLUSOS</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base sm:text-lg font-bold text-foreground">
                      Templates de Anúncios Matadores
                    </h4>
                    <span className="text-sm sm:text-base font-bold text-primary">R$497</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Copy pronta que gera resultados desde o primeiro dia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base sm:text-lg font-bold text-foreground">
                      Acesso VIP ao Grupo de Mentorias
                    </h4>
                    <span className="text-sm sm:text-base font-bold text-accent">R$997</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lives semanais com especialistas milionários
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base sm:text-lg font-bold text-foreground">
                      Planilhas de Gestão Financeira
                    </h4>
                    <span className="text-sm sm:text-base font-bold text-secondary">R$297</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Controle total do seu faturamento
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between text-xl sm:text-2xl md:text-3xl font-bold">
                <span className="text-foreground">Valor Total:</span>
                <div className="text-right">
                  <div className="text-muted-foreground line-through text-lg sm:text-xl">R$3.788</div>
                  <div className="text-primary neon-glow">R$397</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-12 sm:mt-16">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">7 Dias</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Garantia Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">SSL</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Compra Segura</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-secondary mb-1">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Suporte VIP</div>
          </div>
        </div>
      </div>
    </section>
  );
};
