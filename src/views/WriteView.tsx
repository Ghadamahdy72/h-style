import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Lock,
  User,
  Users,
  Repeat,
  Zap,
  Activity,
  Smile,
  Brain,
  ChevronDown,
  Gauge
} from 'lucide-react';
import { BehaviorCategory, Perspective } from '../types';
import { PRESET_EXAMPLES, QUICK_SUGGESTIONS } from '../data/presetExamples';
import { detectTextAttributes } from '../services/localEngine';
import { CODES_DATA } from '../data/codesData';
import { SCIENCES_DATA } from '../data/sciencesData';

interface WriteViewProps {
  initialText?: string;
  initialCategory?: BehaviorCategory;
  initialPerspective?: Perspective;
  onProceedToQuestions: (text: string, category: BehaviorCategory, perspective: Perspective) => void;
}

export const WriteView: React.FC<WriteViewProps> = ({
  initialText = '',
  initialCategory,
  initialPerspective,
  onProceedToQuestions
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [selectedCategory, setSelectedCategory] = useState<BehaviorCategory | null>(initialCategory || null);
  const [selectedPerspective, setSelectedPerspective] = useState<Perspective | null>(initialPerspective || null);
  const [userModifiedCategory, setUserModifiedCategory] = useState(Boolean(initialCategory));
  const [userModifiedPerspective, setUserModifiedPerspective] = useState(Boolean(initialPerspective));
  const [activeTabDialect, setActiveTabDialect] = useState<'all' | 'خليجي' | 'فصحى'>('all');
  const [showAllPresets, setShowAllPresets] = useState(false);

  // Auto detection states
  const [autoDetectedCategory, setAutoDetectedCategory] = useState<BehaviorCategory>('behavior');
  const [autoDetectedPerspective, setAutoDetectedPerspective] = useState<Perspective>('self');
  const [autoDetectedSeverity, setAutoDetectedSeverity] = useState<'منخفضة' | 'متوسطة' | 'مرتفعة'>('منخفضة');
  const [detectedCodes, setDetectedCodes] = useState<string[]>([]);
  const [detectedSciences, setDetectedSciences] = useState<string[]>([]);

  const MIN_CHARS = 8;
  const MAX_CHARS = 900;
  const charCount = inputText.trim().length;
  const isReady = charCount >= MIN_CHARS;

  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  // Live auto-detection when user types
  useEffect(() => {
    if (inputText.trim().length >= 3) {
      const detected = detectTextAttributes(inputText);
      setAutoDetectedCategory(detected.category);
      setAutoDetectedPerspective(detected.perspective);
      setAutoDetectedSeverity(detected.severity);
      setDetectedCodes(detected.detectedCodes);
      setDetectedSciences(detected.detectedSciences);

      // If user hasn't explicitly clicked the perspective toggle, follow detected perspective!
      if (!userModifiedPerspective) {
        setSelectedPerspective(detected.perspective);
      }
      if (!userModifiedCategory) {
        setSelectedCategory(detected.category);
      }
    }
  }, [inputText, userModifiedPerspective, userModifiedCategory]);

  const activeCategory = selectedCategory || autoDetectedCategory;
  const activePerspective = selectedPerspective || autoDetectedPerspective;

  const categoryLabels: Record<BehaviorCategory, { name: string; icon: any; color: string }> = {
    habit: { name: 'عادة', icon: Repeat, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    reaction: { name: 'ردّة فعل', icon: Zap, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    behavior: { name: 'سلوك أو تصرّف', icon: Activity, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    mood: { name: 'مزاج', icon: Smile, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    thought: { name: 'فكرة متكرّرة', icon: Brain, color: 'text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200' },
    relationship: { name: 'نمط في العلاقات', icon: Users, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' }
  };

  const handleApplyPreset = (text: string, cat: BehaviorCategory, pers: Perspective) => {
    setInputText(text);
    setSelectedCategory(cat);
    setSelectedPerspective(pers);
  };

  const handleStartAnalysis = () => {
    if (!isReady) return;
    onProceedToQuestions(inputText.trim(), activeCategory, activePerspective);
  };

  const filteredPresets = PRESET_EXAMPLES.filter(ex => {
    if (activeTabDialect === 'all') return true;
    return ex.dialectBadge === activeTabDialect;
  });

  return (
    <div className="space-y-6 pb-28 text-right max-w-lg mx-auto px-1 sm:px-2">
      {/* Page Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
          <span>صفحة الكتابة والتشريح</span>
          <Sparkles className="w-6 h-6 text-purple-600" />
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-bold leading-relaxed">
          عبّر بكل أريحية عما يزعجك، سواءً بالفصحى أو بالعامية الخليجية. المحرك يكتشف الإشارات تلقائياً.
        </p>
      </div>

      {/* Main Textarea Container */}
      <div className="relative rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4">
        {/* Perspective Explicit Selection Tabs */}
        <div className="space-y-1.5 pb-1">
          <label className="text-xs sm:text-sm font-black text-slate-800 block">
            منظور الحالة المراد فك شيفرتها:
          </label>
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setUserModifiedPerspective(true);
                setSelectedPerspective('self');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activePerspective === 'self'
                  ? 'bg-white text-purple-950 shadow-xs border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-purple-600" />
              <span>عن نفسي (مشاعري وسلوكي)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUserModifiedPerspective(true);
                setSelectedPerspective('other');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activePerspective === 'other'
                  ? 'bg-white text-cyan-950 shadow-xs border border-cyan-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-600" />
              <span>عن شخص آخر (طرف أراقبه)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="text-sm sm:text-base font-black text-slate-900">
            ما الموقف أو التصرف أو الشعور الذي تود فك شيفرته الآن؟
          </label>
          {inputText.length > 0 && (
            <button
              onClick={() => setInputText('')}
              className="text-xs sm:text-sm text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors font-bold px-2 py-1 rounded-lg hover:bg-rose-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>مسح</span>
            </button>
          )}
        </div>

        <div className="relative">
          <textarea
            rows={5}
            maxLength={MAX_CHARS}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="مثال: كل ما أحس بضيق أطلب وجبات سريعة، أو: إذا شفت رسايل بالواتساب أحس بضيقة وأأجل الرد أيام، أو: ما أقدر أقول لا لأي أحد بالدوام حتى لو مضغوط..."
            className="w-full p-5 sm:p-6 rounded-2xl bg-[#FAF9FD] border-2 border-slate-200 focus:border-purple-600 focus:bg-white text-lg sm:text-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all resize-none min-h-[160px] leading-relaxed text-right font-semibold shadow-inner"
          />

          {/* 0/900 Counter */}
          <div className="absolute bottom-3 left-3 text-xs sm:text-sm font-mono text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-xl font-black shadow-2xs">
            {inputText.length}/{MAX_CHARS}
          </div>
        </div>

        {/* Counter and Min warning */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-700 font-bold">
          <div className="flex items-center gap-1.5">
            {isReady ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>الوصف كافٍ لبدء التحليل الدقيق</span>
              </span>
            ) : (
              <span className="text-amber-800 font-bold">
                يلزم كتابة {MIN_CHARS - charCount} أحرف إضافية لتفعيل التحليل
              </span>
            )}
          </div>
          <span className={`font-mono ${isReady ? 'text-purple-700 font-black' : 'text-slate-500'}`}>
            الحد الأدنى: {MIN_CHARS} أحرف
          </span>
        </div>

        {/* CARD: «ما كشفه المحرّك» (النوع · عن مَن · الشدّة · الشيفرات · العلوم) */}
        {inputText.trim().length >= 4 && (
          <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-[#F8F5FF] border border-purple-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-purple-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>بطاقة «ما كشفه المحرّك» الفورية:</span>
              </span>
              <span className="text-xs sm:text-sm text-purple-800 font-black bg-purple-100 px-2.5 py-1 rounded-full">
                تحديث فوري
              </span>
            </div>

            {/* Grid for: النوع · عن مَن · الشدّة */}
            <div className="grid grid-cols-3 gap-3">
              {/* 1. النوع */}
              <div className="p-3.5 rounded-xl bg-white border border-purple-100 text-center space-y-1.5 shadow-2xs">
                <span className="text-xs sm:text-sm text-slate-600 block font-bold">النوع</span>
                <span className="inline-block px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black text-purple-900 bg-purple-50 border border-purple-200">
                  {categoryLabels[activeCategory].name}
                </span>
              </div>

              {/* 2. عن مَن */}
              <div className="p-3.5 rounded-xl bg-white border border-purple-100 text-center space-y-1.5 shadow-2xs">
                <span className="text-xs sm:text-sm text-slate-600 block font-bold">عن مَن</span>
                <button
                  type="button"
                  onClick={() => {
                    setUserModifiedPerspective(true);
                    setSelectedPerspective(activePerspective === 'self' ? 'other' : 'self');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black text-cyan-900 bg-cyan-50 border border-cyan-200 hover:border-cyan-400 transition-colors cursor-pointer"
                  title="انقر للتبديل بين النفس وشخص آخر"
                >
                  {activePerspective === 'self' ? 'عن النفس' : 'عن شخص آخر'}
                </button>
              </div>

              {/* 3. الشدّة */}
              <div className="p-3.5 rounded-xl bg-white border border-purple-100 text-center space-y-1.5 shadow-2xs">
                <span className="text-xs sm:text-sm text-slate-600 block font-bold">الشدّة</span>
                <span className={`inline-block px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black border ${
                  autoDetectedSeverity === 'مرتفعة'
                    ? 'text-rose-900 bg-rose-50 border-rose-200'
                    : autoDetectedSeverity === 'متوسطة'
                    ? 'text-amber-900 bg-amber-50 border-amber-200'
                    : 'text-emerald-900 bg-emerald-50 border-emerald-200'
                }`}>
                  {autoDetectedSeverity}
                </span>
              </div>
            </div>

            {/* الشيفرات والعلوم */}
            {(detectedCodes.length > 0 || detectedSciences.length > 0) && (
              <div className="pt-3 border-t border-purple-100 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-purple-950">الشيفرات:</span>
                  {detectedCodes.map(cid => {
                    const code = CODES_DATA.find(c => c.id === cid);
                    return (
                      <span
                        key={cid}
                        className="text-xs sm:text-sm px-3 py-1 rounded-full bg-white text-purple-900 border border-purple-200 font-bold shadow-2xs"
                      >
                        {code ? code.nameAr : cid}
                      </span>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-purple-950">العلوم:</span>
                  {detectedSciences.map(sid => {
                    const sci = SCIENCES_DATA.find(s => s.id === sid);
                    return (
                      <span
                        key={sid}
                        className="text-xs px-2.5 py-1 rounded-full bg-white text-cyan-800 border border-cyan-200 shadow-2xs font-semibold"
                      >
                        {sci ? sci.nameAr.split('(')[0] : sid}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button & Privacy Reassurance */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-bold">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>بياناتك محفوظة محلياً داخل جهازك بخصوصية تامة</span>
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={!isReady}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-black text-base sm:text-lg transition-all cursor-pointer ${
              isReady
                ? 'bg-gradient-to-l from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <span>حلّل وابدأ الأسئلة</span>
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Quick Clickable Suggestions */}
      <div className="space-y-2.5">
        <span className="text-sm font-black text-slate-800">
          اقتراحات سريعة قابلة للنقر:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {QUICK_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(sug)}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-sm font-bold text-slate-800 hover:text-purple-700 transition-all text-right cursor-pointer shadow-2xs"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Examples (Arabic & Gulf) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              أمثلة عربية وخليجية جاهزة للتجربة
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-semibold">
              انقر على أي مثال لتعبئة المحتوى وفحصه مباشرة
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTabDialect('all')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeTabDialect === 'all' ? 'bg-purple-600 text-white shadow-xs font-black' : 'text-slate-700 hover:text-slate-900'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveTabDialect('خليجي')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeTabDialect === 'خليجي' ? 'bg-purple-600 text-white shadow-xs font-black' : 'text-slate-700 hover:text-slate-900'}`}
            >
              خليجي
            </button>
            <button
              onClick={() => setActiveTabDialect('فصحى')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${activeTabDialect === 'فصحى' ? 'bg-purple-600 text-white shadow-xs font-black' : 'text-slate-700 hover:text-slate-900'}`}
            >
              فصحى
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {(showAllPresets ? filteredPresets : filteredPresets.slice(0, 4)).map(example => (
            <div
              key={example.id}
              onClick={() => handleApplyPreset(example.textAr, example.category, example.perspective)}
              className="p-4 rounded-2xl bg-[#FAF9FD] hover:bg-purple-50/60 border border-slate-200 hover:border-purple-300 text-right cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                  {example.titleAr}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-black border ${
                  example.dialectBadge === 'خليجي'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                }`}>
                  {example.dialectBadge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 leading-relaxed font-semibold">
                «{example.textAr}»
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {example.tags.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredPresets.length > 4 && (
          <button
            onClick={() => setShowAllPresets(!showAllPresets)}
            className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200 text-sm text-purple-700 font-black flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>{showAllPresets ? 'عرض أمثلة أقل' : `عرض باقي الأمثلة (${filteredPresets.length - 4})`}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAllPresets ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};
