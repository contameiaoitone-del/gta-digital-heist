import { ReactNode } from "react";

interface VideoWrapperProps {
  children: ReactNode;
  className?: string;
}

const VideoWrapper = ({ children, className = "" }: VideoWrapperProps) => {
  return (
    <div className={`relative rounded-2xl p-[1px] overflow-hidden ${className}`}>
      {/* Animated border */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from var(--angle, 0deg), transparent 60%, hsl(var(--primary) / 0.3) 80%, hsl(var(--primary) / 0.5) 90%, transparent 100%)`,
          animation: 'rotate-border 4s linear infinite',
        }}
      />
      {/* Inner container */}
      <div className="relative rounded-2xl overflow-hidden bg-background">
        {children}
      </div>
      <style>{`
        @keyframes rotate-border {
          0% {
            --angle: 0deg;
          }
          100% {
            --angle: 360deg;
          }
        }
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>
    </div>
  );
};

export default VideoWrapper;
