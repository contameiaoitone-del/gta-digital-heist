import { motion } from "framer-motion";
import { Users, GraduationCap, Video, Wrench } from "lucide-react";

const benefits = [
  {
    id: 1,
    icon: Users,
    title: "Grupo de Networking",
    description: "Players do mercado de X1 que estão ali para se ajudar mutuamente, trocar experiências e crescer juntos.",
  },
  {
    id: 2,
    icon: GraduationCap,
    title: "Treinamento Completo de X1",
    description: "Mais de 50 aulas completas sobre X1, do básico ao avançado, para você dominar todas as estratégias.",
  },
  {
    id: 3,
    icon: Video,
    title: "Calls",
    description: "Acesso às calls ao vivo e gravadas, para você tirar dúvidas e acompanhar as estratégias em tempo real.",
  },
  {
    id: 4,
    icon: Wrench,
    title: "Zapdata",
    description: "A única ferramenta com diversos sistemas que vai impulsionar sua operação de X1 e automatizar seus processos.",
  },
];

const BenefitsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {benefits.map((benefit, index) => {
        const IconComponent = benefit.icon;
        return (
          <motion.div
            key={benefit.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-secondary/50 transition-colors"
          >
            <div className="p-3 rounded-lg bg-secondary/20 text-secondary shrink-0">
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-foreground uppercase tracking-wide mb-1">
                {benefit.title}
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BenefitsCards;
