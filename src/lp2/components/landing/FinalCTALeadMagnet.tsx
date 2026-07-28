import { useState, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import ScrollAnimation from "@/lp2/components/ui/scroll-animation";
import EntrarMentoriaButton from "@/lp2/components/landing/EntrarMentoriaButton";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

// CTA final genérico para páginas de lead magnet (aula avulsa): mesmo visual
// do FinalCTAMentoriaTemp, mas preço fixo (R$20, vitalício) e checkout via
// popup EFI (CheckoutModal, igual à /lp97-vsl) em vez de link de redirect.
const PRICE_CENTS = 2000;

interface AccessItem {
  icon: LucideIcon;
  label: string;
}

interface FinalCTALeadMagnetProps {
  headline: ReactNode;
  subtitle: string;
  accessItems: AccessItem[];
  product: "lm_x1global" | "lm_fotoia";
  productLabel: string;
  productSubtitle: string;
  buttonLabel: string;
}

const FinalCTALeadMagnet = ({
  headline,
  subtitle,
  accessItems,
  product,
  productLabel,
  productSubtitle,
  buttonLabel,
}: FinalCTALeadMagnetProps) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const isOdd = accessItems.length % 2 === 1;

  return (
    <section id="final-cta" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              {headline}
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-2 leading-relaxed">
              {subtitle}
            </p>

            <div className="bg-gradient-to-br from-purple/20 to-purple/5 border-2 border-purple rounded-2xl p-6 sm:p-8 mb-8 max-w-lg mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple/10 rounded-full blur-[60px]" />
              <div className="relative z-10">
                <span className="text-sm text-purple font-semibold uppercase tracking-wider">{productLabel}</span>

                <h3 className="text-base font-semibold mt-3 mb-5">O que você vai ter acesso:</h3>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                  {accessItems.map((item, index) => (
                    <div
                      key={index}
                      className={`bg-surface-elevated/50 border border-border/50 rounded-xl p-4 flex flex-col items-center text-center gap-3 ${
                        isOdd && index === accessItems.length - 1 ? "col-span-2" : ""
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-purple/15 flex items-center justify-center">
                        <item.icon className="w-7 h-7 text-purple" />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-foreground leading-snug">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-6 pt-5 border-t border-border/50">
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    Investimento
                  </span>
                  <span className="block text-4xl sm:text-5xl font-bold text-foreground leading-none">
                    R$ {PRICE_CENTS / 100}
                  </span>
                </div>

                <EntrarMentoriaButton onClick={() => setCheckoutOpen(true)} label={buttonLabel} />

                <p className="mt-3 text-xs sm:text-sm text-muted-foreground">Acesso vitalício</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        product={product}
        priceCents={PRICE_CENTS}
        productLabel={productLabel}
        productSubtitle={productSubtitle}
      />
    </section>
  );
};

export default FinalCTALeadMagnet;
