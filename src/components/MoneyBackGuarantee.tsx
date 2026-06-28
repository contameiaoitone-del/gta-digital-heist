import { Shield, Clock, DollarSign, CheckCircle, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const MoneyBackGuarantee = () => {
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
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider">
              Risco Zero Para Você
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
            <span className="text-neon-pink neon-glow">GARANTIA</span>{" "}
            <span className="text-foreground">INCONDICIONAL DE</span>{" "}
            <span className="text-neon-cyan neon-glow">7 DIAS</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Você não corre nenhum risco. Todo o risco é nosso. Experimente por 7 dias completos.
          </p>
        </div>

        {/* Main Guarantee Card */}
        <div className="max-w-5xl mx-auto mb-12 sm:mb-16">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-card/50 to-accent/20 backdrop-blur-sm border-4 border-primary shadow-soft-pink p-6 sm:p-8 md:p-12">
            {/* Decorative Shield */}
            <div className="absolute -top-10 -right-10 w-40 h-40 sm:w-60 sm:h-60 opacity-10">
              <Shield className="w-full h-full text-primary" />
            </div>

            <div className="relative z-10">
              {/* Title */}
              <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-primary/20 border-4 border-primary mb-4 sm:mb-6 shadow-soft-pink">
                  <Shield className="w-10 h-10 sm:w-14 sm:h-14 text-primary" />
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                  100% do Seu Dinheiro de Volta
                </h3>
                <p className="text-lg sm:text-xl md:text-2xl text-primary font-bold">
                  Sem Perguntas. Sem Enrolação. Sem Burocracia.
                </p>
              </div>

              {/* How It Works */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent/20 border-2 border-accent mb-3 sm:mb-4">
                    <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                    1. Teste por 7 Dias
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Acesse todo o conteúdo, participe da comunidade, teste tudo
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary/20 border-2 border-secondary mb-3 sm:mb-4">
                    <Star className="w-7 h-7 sm:w-8 sm:h-8 text-secondary" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                    2. Decida Se É Pra Você
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Se não gostar por qualquer motivo, é só avisar
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 border-2 border-primary mb-3 sm:mb-4">
                    <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                    3. Devolução Imediata
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    100% do seu investimento de volta na hora
                  </p>
                </div>
              </div>

              {/* Why We Offer This */}
              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-border">
                <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4 sm:mb-6 text-center">
                  Por Que Oferecemos Isso?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <span className="font-bold text-foreground">Confiamos no método.</span> Sabemos que funciona e queremos provar pra você.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <span className="font-bold text-foreground">97% de aprovação.</span> Menos de 3% pedem reembolso.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-secondary flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <span className="font-bold text-foreground">Queremos alunos satisfeitos.</span> Não adianta você entrar insatisfeito.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      <span className="font-bold text-foreground">Zero risco pra você.</span> O único jeito de não funcionar é não tentar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12 sm:mb-16">
          <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/30 text-center hover:border-primary/50 transition-all duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">+5.000</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Alunos Satisfeitos</div>
          </Card>
          <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-2 border-accent/30 text-center hover:border-accent/50 transition-all duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">97%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Taxa de Aprovação</div>
          </Card>
          <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-2 border-secondary/30 text-center hover:border-secondary/50 transition-all duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">&lt;3%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Pedem Reembolso</div>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-card/50 to-accent/10 backdrop-blur-sm border-2 border-primary/50">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Você Não Tem NADA a Perder
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Ou você transforma sua vida nos próximos 90 dias, ou você recebe seu dinheiro de volta. Simples assim.
            </p>
            <Button
              size="xl"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft-pink hover:shadow-soft-cyan transition-all duration-300 hover:scale-105"
            >
              <Shield className="w-5 h-5 mr-2" />
              QUERO TESTAR SEM RISCO POR 7 DIAS
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4">
              🔒 Compra 100% segura e protegida
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
