import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
}

export const HstyleLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showSubtitle = true
}) => {
  const iconSizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 3D Glossy Emblem SVG matching IMG_3536.jpeg */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_4px_10px_rgba(124,58,237,0.18)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Circular Tube Gradient (Red -> Pink -> Violet -> Cyan) */}
            <linearGradient id="mainRingGrad" x1="20" y1="140" x2="180" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF4500" />
              <stop offset="20%" stopColor="#FF007F" />
              <stop offset="50%" stopColor="#A820E6" />
              <stop offset="85%" stopColor="#00A2FF" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>

            {/* Top Hook Gradient (Orange / Amber) */}
            <linearGradient id="topHookGrad" x1="60" y1="50" x2="110" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFA000" />
              <stop offset="50%" stopColor="#FF6D00" />
              <stop offset="100%" stopColor="#FF3D00" />
            </linearGradient>

            {/* Magenta Center Stroke Gradient */}
            <linearGradient id="magentaStroke" x1="60" y1="70" x2="110" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF007F" />
              <stop offset="70%" stopColor="#D81B60" />
              <stop offset="100%" stopColor="#8E24AA" />
            </linearGradient>

            {/* Purple Leg Gradient */}
            <linearGradient id="purpleLeg" x1="100" y1="40" x2="80" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#BA68C8" />
              <stop offset="40%" stopColor="#9C27B0" />
              <stop offset="100%" stopColor="#6A1B9A" />
            </linearGradient>

            {/* Cyan Crossbar Gradient */}
            <linearGradient id="cyanBar" x1="70" y1="80" x2="190" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF2A90" />
              <stop offset="35%" stopColor="#7C4DFF" />
              <stop offset="70%" stopColor="#00B0FF" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>

            {/* Bubble 1 (Orange-Pink Ring) */}
            <linearGradient id="bubble1Grad" x1="30" y1="95" x2="70" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF3D00" />
              <stop offset="60%" stopColor="#FF007F" />
              <stop offset="100%" stopColor="#E040FB" />
            </linearGradient>

            {/* Bubble 2 (Purple Glossy Sphere) */}
            <radialGradient id="bubble2Sphere" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#E1BEE7" />
              <stop offset="30%" stopColor="#AB47BC" />
              <stop offset="85%" stopColor="#7B1FA2" />
              <stop offset="100%" stopColor="#4A148C" />
            </radialGradient>

            {/* Bubble 3 (Cyan Ring) */}
            <linearGradient id="bubble3Grad" x1="55" y1="135" x2="85" y2="165" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0288D1" />
            </linearGradient>

            {/* Soft drop shadow for 3D realism */}
            <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" floodColor="#7C3AED" />
            </filter>
          </defs>

          {/* 1. Main Circular Outer Tube */}
          <path
            d="M 46 95 A 64 64 0 1 1 82 153"
            stroke="url(#mainRingGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />

          {/* 2. Three Decorative Bubbles on Bottom-Left */}
          {/* Bubble 1: Large Orange-Pink Ring */}
          <circle
            cx="52"
            cy="118"
            r="16"
            stroke="url(#bubble1Grad)"
            strokeWidth="6"
            filter="url(#logoGlow)"
          />

          {/* Bubble 2: Solid Glossy Purple Bead */}
          <circle
            cx="78"
            cy="130"
            r="8.5"
            fill="url(#bubble2Sphere)"
            filter="url(#logoGlow)"
          />

          {/* Bubble 3: Cyan Ring below */}
          <circle
            cx="68"
            cy="151"
            r="10.5"
            stroke="url(#bubble3Grad)"
            strokeWidth="5"
            filter="url(#logoGlow)"
          />

          {/* 3. Center Abstract Emblem: H / 7 / ligature */}
          {/* Top Hook (Orange/Amber) */}
          <path
            d="M 68 59 Q 80 54 102 55 Q 106 55 105 60 L 98 75"
            stroke="url(#topHookGrad)"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#logoGlow)"
          />

          {/* Purple Diagonal Leg */}
          <path
            d="M 125 47 L 88 116"
            stroke="url(#purpleLeg)"
            strokeWidth="7"
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />

          {/* Magenta Diagonal and Loop */}
          <path
            d="M 98 75 L 65 91 C 61 93 63 99 68 98 L 92 88 L 75 110"
            stroke="url(#magentaStroke)"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#logoGlow)"
          />

          {/* Cyan Horizontal Crossbar Extending Right */}
          <path
            d="M 64 88 Q 110 80 186 82"
            stroke="url(#cyanBar)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />

          {/* "style" text in cyan italic cursive */}
          <text
            x="108"
            y="102"
            fill="#00B4D8"
            fontSize="18"
            fontFamily="sans-serif"
            fontStyle="italic"
            fontWeight="600"
            letterSpacing="-0.5"
            className="select-none"
          >
            style
          </text>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-right">
          <div className={`font-black tracking-tight leading-tight flex items-center gap-1.5 ${textSizes[size]}`}>
            <span className="text-slate-900 font-extrabold">Hstyle</span>
            <span className="bg-gradient-to-l from-cyan-600 to-blue-600 bg-clip-text text-transparent font-black">
              Decode
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] md:text-xs font-semibold text-slate-400 -mt-0.5 tracking-wide">
              فكّ شيفرة السلوك
            </span>
          )}
        </div>
      )}
    </div>
  );
};
