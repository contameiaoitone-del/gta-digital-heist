import { ReactNode } from "react";
import { AnimatedGridPattern } from "./ui/animated-grid-pattern";

interface NetflixLayoutProps {
  children: ReactNode;
}

const NetflixLayout = ({ children }: NetflixLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] fill-primary/20 stroke-primary/10"
      />
      <div className="pt-16 pb-8 relative z-10">
        {children}
      </div>
    </div>
  );
};

export default NetflixLayout;
