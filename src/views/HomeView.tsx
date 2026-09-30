import React, { useState, useEffect } from 'react';
import { HstyleLogo } from '../components/HstyleLogo';
import {
  Sparkles,
  Repeat,
  Zap,
  Activity,
  Smile,
  Brain,
  Users,
  Clock,
  ArrowLeft,
  ShieldAlert,
  ChevronLeft,
  Moon,
  BookmarkCheck,
  RotateCcw,
  PenTool,
  CheckCircle2
} from 'lucide-react';
import { BehaviorCategory, Perspective, MoodLog, AnalysisResult, DraftSession, AISettings } from '../types';
import { detectTextAttributes } from '../services/localEngine';

interface HomeViewProps {
  onStartWriting: (initialText?: string, category?: BehaviorCategory, perspective?: Perspective) => void;
  onOpenTileDetail: (category: BehaviorCategory) => void;
  onNavigate: (tab: string) => void;
  todayMood: MoodLog | null;
  onOpenMoodModal: () => void;
  recentSessions: AnalysisResult[];
  draftSession: DraftSession | null;
  onResumeDraft: () => void;
  onDiscardDraft: () => void;
  onViewSessionResult: (session: AnalysisResult) => void;
  aiSettings: AISettings;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartWriting,
  onOpenTileDetail,
  onNavigate,
  todayMood,
  onOpenMoodModal,
  recentSessions,
  draftSession,
  onResumeDraft,
  onDiscardDraft,
  onViewSessionResult,
  aiSettings
}) => {
  const [inputText, setInputText] = useState('');
  const [detectedCategory, setDetectedCategory] = useState<BehaviorCategory>('behavior');
  const [detectedSeverity, setDetectedSeverity] = useState<'منخفضة' | 'متوسطة' | 'مرتفعة'>('منخفضة');
  const [detectedPerspective, setDetectedPerspective] = useState<Perspective>('self');

  const MAX_CHARS = 900;
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  // Real-time detection while typing
  useEffect(() => {
    if (inputText.trim().length >= 4) {
      const detected = detectTextAttributes(inputText);
      setDetectedCategory(detected.category);
      setDetectedSeverity(detected.severity);
      setDetectedPerspective(detected.perspective);
    }
  }, [inputText]);

  const tiles = [
    {
      id: 'habit' as BehaviorCategory,
      title: 'عادة',
      subtitle: 'شيء تكرره رغم رغبتك بالتغيير',
      icon: Repeat,
      iconBg: 'bg-[#F3E8FF] text-[#7C3AED]',
      example: 'الأكل العاطفي، تسويف النوم، إدمان الشاشات'
    },
    {
      id: 'reaction' as BehaviorCategory,
      title: 'ردّة فعل',
      subtitle: 'استجابة سريعة لموقف أو كلمة',
      icon: Zap,
      iconBg: 'bg-[#FEF3C7] text-[#D97706]',
      example: 'عصبية سريعة، رغبة بالصراخ، انزعاج حاد'
    },
    {
      id: 'behavior' as BehaviorCategory,
      title: 'سلوك أو تصرّف',
      subtitle: 'طريقة تعامل ومواقف تتخذها مع الناس',
      icon: Activity,
      iconBg: 'bg-[#E0F2FE] text-[#0284C7]',
      example: 'صعوبة قول «لا»، مجاملة مفرطة، تجنب'
    },
    {
      id: 'mood' as BehaviorCategory,
      title: 'مزاج',
      subtitle: 'حالة وجدانية عامة وهبوط أو ثقل نفسي',
      icon: Smile,
      iconBg: 'bg-[#FCE7F3] text-[#DB2777]',
      example: 'فتور، طفش مفاجئ، ضيق مستمر بدون سبب'
    },
    {
      id: 'thought' as BehaviorCategory,
      title: 'فكرة متكرّرة',
      subtitle: 'سيناريوهات، شكوك، وقراءات أفكار في الرأس',
      icon: Brain,
      iconBg: 'bg-[#EDE9FE] text-[#9333EA]',
      example: 'افتراض الأسوأ، اجترار الذكريات، لوم الذات'
    },
    {
      id: 'relationship' as BehaviorCategory,
      title: 'نمط في العلاقات',
      subtitle: 'ديناميكية مستمرة بينك وبين شريك أو شخص آخر',
      icon: Users,
      iconBg: 'bg-[#CFFAFE] text-[#0891B2]',
      example: 'صمت عقابي، خلافات متكررة، خوف من البعد'
    }
  ];

  const moodLabels: Record<number, { label: string; emoji: string }> = {
    1: { label: 'مرهق / منخفض', emoji: '😫' },
    2: { label: 'متوتر / قلق', emoji: '😟' },
    3: { label: 'محايد / عادي', emoji: '😐' },
    4: { label: 'رايق / هادئ', emoji: '🙂' },
    5: { label: 'ممتاز / نشيط', emoji: '😄' }
  };

  const handleStartJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim().length >= 5) {
      onStartWriting(inputText.trim(), detectedCategory, detectedPerspective);
    } else {
      onStartWriting('', detectedCategory, detectedPerspective);
    }
  };

  return (
    <div className="space-y-6 pb-28 text-right max-w-lg mx-auto px-1 sm:px-2">
      {/* 0. Full Hero Header in the Chest */}
      <div className="text-center pt-2 pb-1 space-y-3.5">
        {/* Full Logo in Center */}
        <div className="flex justify-center">
          <HstyleLogo size="lg" showText={true} showSubtitle={true} />
        </div>

        {/* Main Title: «اكتب ما يزعجك… والمحرّك يفكّ شيفرته» */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          اكتب ما يزعجك… والمحرّك يفكّ شيفرته
        </h1>

        {/* Dialect support description */}
        <p className="text-sm sm:text-base text-slate-700 font-semibold leading-relaxed max-w-sm mx-auto">
          المحرّك التفاعلي لتفكيك الأنماط السلوكية، يدعم <span className="font-black text-purple-700">العربية الفصحى</span> و<span className="font-black text-purple-700">العامية الخليجية</span> بدقة علمية.
        </p>

        {/* Three Badges: سجل محلي · أسئلة تكيّفية · قراءة عملية */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-black shadow-xs">
            <span className="text-purple-600 text-sm">🔒</span>
            <span>سجل محلي</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-black shadow-xs">
            <span className="text-cyan-600 text-sm">🔄</span>
            <span>أسئلة تكيّفية</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-black shadow-xs">
            <span className="text-emerald-600 text-sm">💡</span>
            <span>قراءة عملية</span>
          </span>
        </div>

        {/* AI Engine Status Bar: Green on https, Red/amber on local */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          {(() => {
            const isAiActive = isHttps || (isOnline && aiSettings?.enabled);
            return (
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black border transition-colors shadow-xs ${
                  isAiActive
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    isAiActive ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span>
                  {isAiActive
                    ? 'شريط حالة الذكاء الاصطناعي: نشط ومتصل'
                    : 'شريط حالة الذكاء الاصطناعي: محرك محلي آمن'}
                </span>
              </div>
            );
          })()}

          {/* «اكتب الآن» Active Button */}
          <button
            onClick={() => onNavigate('write')}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs sm:text-sm font-black border border-purple-200 transition-all cursor-pointer shadow-xs"
          >
            <PenTool className="w-3.5 h-3.5 text-purple-700" />
            <span>اكتب الآن</span>
          </button>
        </div>
      </div>

      {/* Draft Alert Card if an incomplete session exists */}
      {draftSession && (
        <div className="p-4.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm flex items-center justify-between gap-3 animate-pulse-subtle">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  جلسة لم تكتمل
                </span>
                <span className="text-xs text-amber-700 font-bold">
                  سؤال {draftSession.currentQuestionIndex + 1} من {draftSession.activeQuestions.length}
                </span>
              </div>
              <p className="text-sm text-amber-950 mt-1 truncate font-bold">
                «{draftSession.inputText}»
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onResumeDraft}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
            >
              استئناف
            </button>
            <button
              onClick={onDiscardDraft}
              className="px-2.5 py-2 rounded-xl bg-white border border-amber-200 text-amber-700 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer"
              title="حذف المسودة"
            >
              حذف
            </button>
          </div>
        </div>
      )}

      {/* 1. THE LUMINOUS PURPLE CARD */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] p-5 sm:p-7 text-white shadow-xl shadow-purple-500/20">
        {/* Subtle Watermark Logo in top-left */}
        <div className="absolute top-2 left-2 opacity-15 pointer-events-none scale-75">
          <HstyleLogo size="lg" showText={false} />
        </div>

        <div className="relative space-y-4">
          {/* Top Label */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-purple-100 tracking-wide">
              ابدأ فكّ الشيفرة
            </span>

            {/* Pencil rounded button */}
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <PenTool className="w-5 h-5" />
            </div>
          </div>

          {/* Main Title: ما الذي يشغل بالك؟ */}
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            ما الذي يشغل بالك؟
          </h2>

          {/* Inner Form with Textarea */}
          <form onSubmit={handleStartJourney} className="space-y-3.5 pt-1">
            <div className="relative rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 p-3.5 sm:p-4 focus-within:border-white/60 transition-colors">
              <textarea
                rows={3}
                maxLength={MAX_CHARS}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="مثال: أتضايق إذا تأخر أحد في الرد عليّ، وأبدأ أتوقع أني غير مهم..."
                className="w-full bg-transparent text-base sm:text-lg text-white placeholder:text-purple-100/75 outline-none resize-none leading-relaxed text-right font-semibold"
              />

              <div className="flex items-center justify-between pt-2 text-xs text-purple-100 border-t border-white/20 mt-1 font-semibold">
                <span>اكتب كما تتكلم، بلا ترتيب</span>
                <span className="font-mono">{inputText.length}/{MAX_CHARS}</span>
              </div>
            </div>

            {/* Live Auto-Detection Badges */}
            {inputText.trim().length >= 4 && (
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-xs sm:text-sm">
                <span className="text-white flex items-center gap-1 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>كشف المحرّك:</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/30 text-white font-black">
                  {detectedCategory}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/30 text-cyan-100 font-black">
                  الشدّة: {detectedSeverity}
                </span>
              </div>
            )}

            {/* Big Action Pill Button: «ابدأ رحلة فكّ الشيفرة ←» */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D946EF] via-[#C026D3] to-[#8B5CF6] hover:from-[#E879F9] hover:to-[#A855F7] text-white font-black text-base sm:text-lg shadow-lg shadow-purple-900/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>ابدأ رحلة فكّ الشيفرة</span>
              <ArrowLeft className="w-5 h-5 text-white stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. SECTION: «من أين نبدأ؟» */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              من أين نبدأ؟
            </h2>
            <div className="w-6 h-6">
              <HstyleLogo size="xs" showText={false} />
            </div>
          </div>
          <span className="text-xs sm:text-sm font-black text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            12 سؤال لكل بلاطة
          </span>
        </div>

        {/* 2-Column Grid of Crisp White Cards */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
          {tiles.map(tile => {
            const Icon = tile.icon;
            return (
              <button
                key={tile.id}
                onClick={() => onOpenTileDetail(tile.id)}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(124,58,237,0.12)] hover:border-purple-300 text-right transition-all group cursor-pointer flex flex-col justify-between min-h-[160px]"
              >
                {/* Top: Icon in soft rounded square */}
                <div className="flex items-start justify-between w-full">
                  <div className={`w-12 h-12 rounded-2xl ${tile.iconBg} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>

                {/* Bottom: Title & Subtitle */}
                <div className="mt-4 space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                    {tile.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-semibold">
                    {tile.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CARD: «كيف يعمل المحرّك؟» */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            كيف يعمل المحرّك؟
          </h2>
          <span className="text-xs sm:text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            مسار واضح
          </span>
        </div>

        {/* 4-Step Timeline */}
        <div className="relative pt-2 pb-1">
          {/* Connecting Line */}
          <div className="absolute top-[20px] left-6 right-6 h-1 bg-purple-100 -z-0" />

          <div className="grid grid-cols-4 gap-1 relative z-10 text-center">
            {/* Step 1: وصف الحالة */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/25 text-sm font-black ring-4 ring-white">
                1
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-2">وصف الحالة</h3>
              <span className="text-xs text-slate-500 mt-0.5 font-bold">ما يحدث</span>
            </div>

            {/* Step 2: القراءة */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/25 text-sm font-black ring-4 ring-white">
                2
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-2">القراءة</h3>
              <span className="text-xs text-slate-500 mt-0.5 font-bold">ما يسبقه</span>
            </div>

            {/* Step 3: فكّ الشيفرة */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/25 text-sm font-black ring-4 ring-white">
                3
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-2">فكّ الشيفرة</h3>
              <span className="text-xs text-slate-500 mt-0.5 font-bold">ما يحميه</span>
            </div>

            {/* Step 4: إعادة تشكيل السلوك */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/25 text-sm font-black ring-4 ring-white">
                4
              </div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 mt-2 leading-tight">إعادة التشكيل</h3>
              <span className="text-xs text-slate-500 mt-0.5 font-bold">ما يغيّره</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CARD: «مزاج اليوم» */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-2xl sm:text-3xl flex items-center justify-center shadow-inner">
            {todayMood ? moodLabels[todayMood.moodLevel].emoji : '🙂'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">مزاج ونوم اليوم</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-bold border border-purple-200">
                دقة فك الشيفرة
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
              {todayMood
                ? `مزاجك: ${moodLabels[todayMood.moodLevel].label} • ساعات النوم: ${todayMood.sleepHours} ساعات`
                : 'سجل مزاجك وساعات نومك لربط طاقتك الجسدية بردود أفعالك'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenMoodModal}
          className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 border border-purple-200"
        >
          {todayMood ? 'تعديل' : 'تسجيل اليوم'}
        </button>
      </div>

      {/* 5. SECTION: الجلسات السابقة */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h2 className="text-base font-black text-slate-900">
              الجلسات السابقة
            </h2>
          </div>
          {recentSessions.length > 0 && (
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs sm:text-sm text-purple-700 hover:text-purple-800 font-black cursor-pointer"
            >
              عرض الكل ({recentSessions.length})
            </button>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center text-slate-400">
            <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
            <p className="text-sm font-bold text-slate-700">لا توجد جلسات مسجلة بعد</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              ابدأ أول فك شيفرة وستحفظ نتائجك هنا لمراجعة تقدمك في أي وقت
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentSessions.slice(0, 3).map(session => (
              <div
                key={session.id}
                onClick={() => onViewSessionResult(session)}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-purple-300 transition-all flex items-center justify-between gap-3.5 cursor-pointer group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 font-black border border-purple-200">
                      ثقة {session.confidenceScore}%
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {new Date(session.createdAt).toLocaleDateString('ar-QA', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-900 font-black mt-1 truncate">
                    «{session.inputText}»
                  </p>
                  <p className="text-xs text-purple-700 font-bold mt-0.5 truncate">
                    السبب: {session.probabilities[0]?.titleAr}
                  </p>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. WARNING DISCLAIMER */}
      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3 text-right">
        <ShieldAlert className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <strong className="text-purple-950 font-black">تنبيه: </strong>
          منصة <span className="text-purple-700 font-black">Hstyle Decode</span> هي أداة وعي ذاتي وتفكيك أنماط سلوكية وتثقيف نفسي، وليست تشخيصاً طبياً أو بديلاً عن الاستشارة السريرية المتخصصة.
        </p>
      </div>
    </div>
  );
};
