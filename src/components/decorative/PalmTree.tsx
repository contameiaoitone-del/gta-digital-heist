interface PalmTreeProps {
  size?: 'small' | 'medium' | 'large';
  position?: 'left' | 'right';
  opacity?: number;
  className?: string;
  gradientId?: string;
  gradientColor?: string;
}

export const PalmTree = ({ 
  size = 'medium', 
  position = 'left',
  opacity = 0.15,
  className = '',
  gradientId = 'palmGradient',
  gradientColor = 'hsl(270, 60%, 30%)'
}: PalmTreeProps) => {
  const sizeMap = {
    small: 'w-48 h-72',
    medium: 'w-64 h-96',
    large: 'w-72 h-[28rem]'
  };

  return (
    <div 
      className={`absolute bottom-0 ${position === 'left' ? 'left-0' : 'right-0'} ${sizeMap[size]} hidden md:block ${className}`}
      style={{ opacity }}
    >
      <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientColor} stopOpacity="0.8"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        {/* Trunk */}
        <path 
          d="M100 300 L105 200 Q108 180 110 160 L108 140 Q107 120 105 100" 
          stroke={`url(#${gradientId})`} 
          strokeWidth={size === 'large' ? '5' : size === 'medium' ? '4' : '3'} 
          fill="none"
        />
        {/* Fronds */}
        <path d="M105 120 Q80 100 60 90 Q40 85 20 85" stroke={`url(#${gradientId})`} strokeWidth="3" fill="none"/>
        <path d="M105 125 Q90 110 75 105 Q60 102 45 105" stroke={`url(#${gradientId})`} strokeWidth="3" fill="none"/>
        <path d="M105 115 Q120 95 140 85 Q160 80 180 82" stroke={`url(#${gradientId})`} strokeWidth="3" fill="none"/>
        <path d="M105 120 Q115 105 125 100 Q140 95 155 98" stroke={`url(#${gradientId})`} strokeWidth="3" fill="none"/>
        <path d="M105 130 Q95 145 85 155 Q75 165 65 175" stroke={`url(#${gradientId})`} strokeWidth="3" fill="none"/>
        <path d="M105 130 Q115 145 125 155 Q135 165 145 175" stroke={`url(#${gradientId})`} strokeWidth="3" fill="none"/>
        {size === 'large' && (
          <path d="M105 108 Q100 90 105 80 Q110 70 115 65" stroke={`url(#${gradientId})`} strokeWidth="3" fill="none"/>
        )}
      </svg>
    </div>
  );
};
