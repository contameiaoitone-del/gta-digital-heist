import logoImage from "@/assets/real-life-academy-logo.png";

export const GTALogo = () => {
  return (
    <div className="gta-logo-wrapper inline-block animate-slide-up">
      <div className="gta-logo-shape">
        <div className="logo-border-top"></div>
        <div className="logo-border-left"></div>
        <div className="logo-border-right"></div>
        
        <img 
          src={logoImage} 
          alt="Real Life Academy" 
          className="w-full h-auto max-w-[600px] mx-auto relative z-10 drop-shadow-[0_0_40px_rgba(255,105,180,0.7)] drop-shadow-[0_0_80px_rgba(138,43,226,0.5)]"
        />
      </div>
    </div>
  );
};
