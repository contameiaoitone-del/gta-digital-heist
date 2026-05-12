import "@/lp2/index.css";
import IndexMentoria from "@/lp2/pages/IndexMentoria";

/**
 * Página de mentoria — herda o layout da LP2 mas substitui o tom roxo
 * pelo laranja #FF6A00 via override das CSS variables no escopo
 * `.mentoria-root`.
 */
const MentoriaApp = () => (
  <div className="lp2-root mentoria-root bg-background text-foreground min-h-screen">
    <style>{`
      .mentoria-root {
        --purple-glow: 24 100% 50%;
        --purple-light: 24 100% 60%;
        --purple-dark: 24 100% 40%;
        --accent: 24 100% 50%;
        --ring: 24 100% 50%;
        --gradient-purple: linear-gradient(135deg, hsl(24 100% 50%) 0%, hsl(24 100% 60%) 100%);
        --gradient-glow: radial-gradient(ellipse at center, hsl(24 100% 50% / 0.18) 0%, transparent 70%);
        --shadow-glow: 0 0 40px hsl(24 100% 50% / 0.3);
      }
    `}</style>
    <IndexMentoria />
  </div>
);

export default MentoriaApp;