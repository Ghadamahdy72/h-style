import React from 'react';
import {
  ChevronRight,
  Sparkles,
  Repeat,
  Zap,
  Activity,
  Smile,
  Brain,
  Users
} from 'lucide-react';
import { BehaviorCategory, Perspective } from '../types';
import { TILE_QUESTIONS_DATA } from '../data/tileQuestionsData';
import { HstyleLogo } from '../components/HstyleLogo';

interface TileDetailViewProps {
  category: BehaviorCategory;
  onBack: () => void;
  onSelectQuestion: (text: string, category: BehaviorCategory, perspective: Perspective) => void;
}

export const TileDetailView: React.FC<TileDetailViewProps> = ({
  category,
  onBack,
  onSelectQuestion
}) => {
  const tileData = TILE_QUESTIONS_DATA[category] || TILE_QUESTIONS_DATA['habit'];

  const iconMap: Record<string, any> = {
    Repeat,
    Zap,
    Activity,
    Smile,
    Brain,
    Users
  };

  const Icon = iconMap[tileData.iconName] || Sparkles;

  const selfQuestions = tileData.questions.filter(q => q.targetType === 'self');
  const otherQuestions = tileData.questions.filter(q => q.targetType === 'other');

  // Question emoji map
  const questionEmojis: Record<string, string> = {
    'hab-self-1': '🍔',
    'hab-self-2': '📱',
    'hab-self-3': '👀',
    'hab-self-4': '⏰',
    'hab-self-5': '🛒',
    'hab-self-6': '🔄',
    'reac-self-1': '⚡',
    'reac-self-2': '💬',
    'reac-self-3': '😢',
    'reac-self-4': '🚗',
    'reac-self-5': '🤐',
    'reac-self-6': '🧊',
    'beh-self-1': '🛑',
    'beh-self-2': '💰',
    'beh-self-3': '🚪',
    'beh-self-4': '🎭',
    'beh-self-5': '🙏',
    'beh-self-6': '🔍',
    'mood-self-1': '🌅',
    'mood-self-2': '🌫️',
    'mood-self-3': '📆',
    'mood-self-4': '🎢',
    'mood-self-5': '⏳',
    'mood-self-6': '🕊️',
    'th-self-1': '👥',
    'th-self-2': '🌪️',
    'th-self-3': '🎭',
    'th-self-4': '🕰️',
    'th-self-5': '⚖️',
    'th-self-6': '💔',
    'rel-self-1': '🏃‍♂️',
    'rel-self-2': '🧲',
    'rel-self-3': '⛓️',
    'rel-self-4': '🗣️',
    'rel-self-5': '🔎',
    'rel-self-6': '🛡️'
  };

  return (
    <div className="space-y-6 pb-28 text-right max-w-lg mx-auto px-1 sm:px-2">
      {/* Tile Header */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {tileData.titleAr}
          </h1>
          <div className="p-1.5 rounded-xl bg-slate-100 text-slate-700">
            <Icon className="w-5 h-5" />
          </div>
          <div className="w-6 h-6">
            <HstyleLogo size="xs" showText={false} />
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
          {tileData.subtitleAr} — اختر سؤالاً يشبه حالتك أو اكتب بنفسك
        </p>
      </div>

      {/* 1. SECTION: أمثلة للأسئلة عن النفس 👤 */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2 px-1">
          <span className="text-base font-black text-slate-900">
            أمثلة للأسئلة عن النفس
          </span>
          <span className="text-base">👤</span>
        </div>

        {/* 2-Column Grid of Soft Light Blue Cards */}
        <div className="grid grid-cols-2 gap-3">
          {selfQuestions.map(item => {
            const emoji = questionEmojis[item.id] || '❓';
            return (
              <button
                key={item.id}
                onClick={() => onSelectQuestion(item.suggestedPrompt, category, 'self')}
                className="bg-[#EFF6FF] hover:bg-[#DBEAFE] border-2 border-[#BFDBFE]/80 rounded-3xl p-4.5 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[120px] shadow-sm"
              >
                <span className="text-2xl mb-2">{emoji}</span>
                <span className="text-sm sm:text-base font-black text-[#1E3A8A] leading-snug">
                  {item.textAr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SECTION: أمثلة للأسئلة عن الغير 👥 */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center gap-2 px-1">
          <span className="text-base font-black text-slate-900">
            أمثلة للأسئلة عن الغير
          </span>
          <span className="text-base">👥</span>
        </div>

        {/* 2-Column Grid of Soft Light Amber Cards */}
        <div className="grid grid-cols-2 gap-3">
          {otherQuestions.map(item => {
            return (
              <button
                key={item.id}
                onClick={() => onSelectQuestion(item.suggestedPrompt, category, 'other')}
                className="bg-[#FFFBEB] hover:bg-[#FEF3C7] border-2 border-[#FDE68A]/80 rounded-3xl p-4.5 text-center transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center min-h-[120px] shadow-sm"
              >
                <span className="text-2xl mb-2">💬</span>
                <span className="text-sm sm:text-base font-black text-[#92400E] leading-snug">
                  {item.textAr}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
