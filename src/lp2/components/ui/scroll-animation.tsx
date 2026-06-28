import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

const ScrollAnimation = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up" 
}: ScrollAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px", amount: 0.1 });

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 50, x: 0 };
      case "down":
        return { y: -50, x: 0 };
      case "left":
        return { x: 50, y: 0 };
      case "right":
        return { x: -50, y: 0 };
      default:
        return { y: 50, x: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
