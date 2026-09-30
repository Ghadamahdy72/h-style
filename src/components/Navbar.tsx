import React, { useState } from 'react';
import { HstyleLogo } from './HstyleLogo';
import { ChevronRight, Share2, Check } from 'lucide-react';
import { MoodLog } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  todayMood?: MoodLog | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  showBack,
  onBack,
  title,
  todayMood
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: 'Hstyle Decode - محرك فكّ الشيفرة السلوكية',
      text: 'اكتب ما يزعجك… والمحرّك يفكّ شيفرته، وفق أحدث النظريات السلوكية وعلم النفس.',
      url: shareUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100/90 px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        {/* Left Side: «وعي، لا تشخيص» Pill or «رجوع >» Button */}
        <div>
          {showBack && onBack ? (
            <button
              onClick={onBack}
              aria-label="رجوع"
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE] text-sm font-extrabold transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              <span>رجوع</span>
            </button>
          ) : (
            <div
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black select-none shadow-xs"
              title="أداة وعي ذاتي وتفكيك أنماط وليست تشخيصاً طبياً"
            >
              <span>وعي، لا تشخيص</span>
            </div>
          )}
        </div>

        {/* Center: Brand Title & Subtitle */}
        <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => onNavigate('home')}>
          <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
            {title ? title : 'Hstyle Decode'}
          </span>
          <span className="text-xs text-slate-500 font-semibold -mt-0.5">
            فكّ شيفرة السلوك
          </span>
        </div>

        {/* Right Side: Share button & The Official Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            aria-label="مشاركة المنصة"
            title={copied ? 'تم نسخ الرابط!' : 'مشاركة أو نسخ الرابط'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              copied
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm scale-105'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:scale-105 shadow-2xs'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>

          <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <HstyleLogo size="sm" showText={false} />
          </div>
        </div>
      </div>
    </header>
  );
};
