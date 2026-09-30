import React, { useEffect, useState } from 'react';
import { HstyleLogo } from './HstyleLogo';
import { Sparkles } from 'lucide-react';

interface SplashProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashProps> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 450);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      onClick={() => {
        setFade(true);
        setTimeout(onFinish, 200);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#FAF8FF] via-[#F4EEFF] to-[#EBE3FF] px-6 transition-opacity duration-500 cursor-pointer ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient glows */}
      <div className="absolute w-72 h-72 rounded-full bg-purple-400/25 blur-3xl -top-10 -right-10 pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl -bottom-10 -left-10 pointer-events-none" />

      <div className="relative flex flex-col items-center text-center max-w-sm">
        <HstyleLogo size="xl" />

        <div className="mt-6 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-purple-200/80 text-purple-700 text-xs font-bold shadow-sm backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
          <span>محرّك فكّ الشيفرة النفسية والسلوكية</span>
        </div>

        <p className="mt-4 text-slate-700 text-sm font-semibold leading-relaxed">
          اكتب ما يزعجك… والمحرّك يفكّ شيفرته
        </p>

        {/* Loading dots */}
        <div className="mt-8 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
