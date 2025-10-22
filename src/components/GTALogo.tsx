import logoImage from "@/assets/real-life-academy-logo.png";

export const GTALogo = () => {
  return (
    <img 
      src={logoImage} 
      alt="Real Life Academy Logo" 
      className="w-full h-auto max-w-[700px] mx-auto block relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
    />
  );
};