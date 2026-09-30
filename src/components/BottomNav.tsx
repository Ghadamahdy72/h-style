import React from 'react';
import { Home, PenLine, BookOpen, Moon, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  hasDraft?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  hasDraft
}) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'write', label: 'الكتابة', icon: PenLine, badge: hasDraft ? 'مسودة' : undefined },
    { id: 'library', label: 'المكتبة', icon: BookOpen },
    { id: 'mood', label: 'المزاج', icon: Moon },
    { id: 'profile', label: 'ملفّي', icon: User }
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 max-w-sm sm:max-w-md mx-auto">
      <div className="bg-white/95 text-slate-700 rounded-[28px] p-2 px-3 shadow-[0_12px_36px_rgba(132,78,206,0.16)] border border-purple-200/90 backdrop-blur-xl grid grid-cols-5 gap-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-purple-700 font-black'
                  : 'text-slate-500 hover:text-purple-700'
              }`}
            >
              {/* Highlight subtle indicator */}
              {isActive && (
                <div className="absolute inset-0 bg-purple-100/80 rounded-2xl border border-purple-200" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform ${isActive ? 'scale-110 text-purple-700' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.5 bg-pink-500 text-white text-[10px] rounded-full font-bold shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-xs mt-1 relative tracking-tight ${isActive ? 'text-purple-800 font-black' : 'text-slate-600 font-semibold'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
