interface UrbanSkylineProps {
  variant?: 'day' | 'night' | 'sunset';
  className?: string;
}

export const UrbanSkyline = ({ variant = 'night', className = '' }: UrbanSkylineProps) => {
  const gradientColors = {
    day: 'hsl(185 70% 60%)',
    night: 'hsl(270 60% 30%)',
    sunset: 'hsl(330 85% 45%)'
  };

  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id={`skylineGradient-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[variant]} stopOpacity="0.6"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        
        {/* Building 1 - Tall */}
        <rect x="50" y="100" width="80" height="300" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="60" y="120" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.3"/>
        <rect x="75" y="120" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.4"/>
        <rect x="90" y="140" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.3"/>
        <rect x="60" y="180" width="8" height="8" fill="hsl(185 85% 70%)" opacity="0.3"/>
        <rect x="90" y="200" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.4"/>
        
        {/* Building 2 - Medium */}
        <rect x="150" y="180" width="100" height="220" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="165" y="200" width="10" height="10" fill="hsl(45 100% 75%)" opacity="0.4"/>
        <rect x="185" y="210" width="10" height="10" fill="hsl(185 85% 70%)" opacity="0.3"/>
        <rect x="210" y="200" width="10" height="10" fill="hsl(45 100% 75%)" opacity="0.3"/>
        
        {/* Building 3 - Short */}
        <rect x="270" y="250" width="70" height="150" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="285" y="270" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.4"/>
        <rect x="305" y="280" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.3"/>
        
        {/* Building 4 - Very Tall */}
        <rect x="360" y="50" width="90" height="350" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="375" y="80" width="8" height="8" fill="hsl(185 85% 70%)" opacity="0.4"/>
        <rect x="395" y="100" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.3"/>
        <rect x="415" y="120" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.4"/>
        <rect x="375" y="160" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.3"/>
        
        {/* Building 5 - Medium-Tall */}
        <rect x="470" y="140" width="85" height="260" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="485" y="165" width="10" height="10" fill="hsl(45 100% 75%)" opacity="0.3"/>
        <rect x="510" y="175" width="10" height="10" fill="hsl(185 85% 70%)" opacity="0.4"/>
        
        {/* Building 6 - Short Wide */}
        <rect x="580" y="270" width="120" height="130" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="600" y="290" width="10" height="10" fill="hsl(45 100% 75%)" opacity="0.4"/>
        <rect x="630" y="295" width="10" height="10" fill="hsl(45 100% 75%)" opacity="0.3"/>
        <rect x="660" y="290" width="10" height="10" fill="hsl(185 85% 70%)" opacity="0.3"/>
        
        {/* Building 7 - Tall Slim */}
        <rect x="720" y="120" width="60" height="280" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="735" y="145" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.4"/>
        <rect x="755" y="165" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.3"/>
        
        {/* Building 8 - Medium */}
        <rect x="800" y="200" width="95" height="200" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="820" y="225" width="10" height="10" fill="hsl(185 85% 70%)" opacity="0.4"/>
        <rect x="850" y="235" width="10" height="10" fill="hsl(45 100% 75%)" opacity="0.3"/>
        
        {/* Building 9 - Short */}
        <rect x="920" y="260" width="75" height="140" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="940" y="280" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.3"/>
        
        {/* Building 10 - Very Tall */}
        <rect x="1020" y="80" width="85" height="320" fill={`url(#skylineGradient-${variant})`}/>
        <rect x="1035" y="110" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.4"/>
        <rect x="1060" y="130" width="8" height="8" fill="hsl(185 85% 70%)" opacity="0.3"/>
        <rect x="1080" y="150" width="8" height="8" fill="hsl(45 100% 75%)" opacity="0.3"/>
      </svg>
    </div>
  );
};
