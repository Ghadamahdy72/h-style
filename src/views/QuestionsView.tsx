import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Check,
  FileEdit,
  Lightbulb,
  Bookmark,
  GraduationCap,
  User,
  Users,
  RefreshCw
} from 'lucide-react';
import {
  QuestionItem,
  UserAnswer,
  BehaviorCategory,
  Perspective,
  MoodLog
} from '../types';
import {
  detectSmartQuestions,
  ADAPTIVE_FOLLOWUP_QUESTIONS
} from '../data/questionsData';
import { fetchSmartQuestions } from '../services/aiService';

interface QuestionsViewProps {
  inputText: string;
  category: BehaviorCategory;
  perspective: Perspective;
  todayMood?: MoodLog | null;
  onFinishQuestions: (
    answers: Record<string, UserAnswer>,
    questions: QuestionItem[],
    activePerspective?: Perspective
  ) => void;
  onSaveDraft: (
    answers: Record<string, UserAnswer>,
    questions: QuestionItem[],
    currentIndex: number
  ) => void;
  onBackToWriting: () => void;
  initialAnswers?: Record<string, UserAnswer>;
  initialQuestions?: QuestionItem[];
  initialIndex?: number;
}

const CATEGORY_NAMES: Record<BehaviorCategory, string> = {
  habit: 'عادة',
  reaction: 'ردّة فعل',
  behavior: 'سلوك',
  mood: 'مزاج',
  thought: 'فكرة متكرّرة',
  relationship: 'علاقة'
};

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  inputText,
  category,
  perspective,
  todayMood,
  onFinishQuestions,
  onSaveDraft,
  onBackToWriting,
  initialAnswers = {},
  initialQuestions,
  initialIndex = 0
}) => {
  // Current active perspective (allows user to switch if they want)
  const [activePerspective, setActivePerspective] = useState<Perspective>(perspective);

  // Initialize questions using smart pattern detector strictly tailored to perspective
  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    if (initialQuestions && initialQuestions.length >= 2) {
      return initialQuestions;
    }
    return detectSmartQuestions(inputText, category, perspective);
  });

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>(initialAnswers);
  const [isDynamicFetching, setIsDynamicFetching] = useState(false);

  // Switch perspective handler
  const handleSwitchPerspective = (newPerspective: Perspective) => {
    if (newPerspective === activePerspective) return;
    setActivePerspective(newPerspective);
    const newQuestions = detectSmartQuestions(inputText, category, newPerspective);
    setQuestions(newQuestions);
    setAnswers({});
    setSelectedOptionIds([]);
    setCurrentIndex(0);

    // Fetch dynamic AI questions for new perspective
    setIsDynamicFetching(true);
    fetchSmartQuestions({ text: inputText, category, perspective: newPerspective })
      .then(aiQuestions => {
        if (aiQuestions && aiQuestions.length >= 2) {
          setQuestions(aiQuestions);
        }
      })
      .finally(() => {
        setIsDynamicFetching(false);
      });
  };

  // Current question inputs
  const currentQ = questions[currentIndex] || questions[0];
  const currentAnswer = answers[currentQ?.id];

  // Selected option IDs (supports multiple selections)
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(() => {
    if (currentAnswer?.selectedOptionIds && currentAnswer.selectedOptionIds.length > 0) {
      return currentAnswer.selectedOptionIds;
    }
    return currentAnswer?.optionId ? [currentAnswer.optionId] : [];
  });

  const [freeTextNote, setFreeTextNote] = useState<string>(currentAnswer?.freeText || '');

  // Re-detect smart questions if inputText changes and no fixed initial questions were passed
  useEffect(() => {
    if (!initialQuestions || initialQuestions.length === 0) {
      const smart = detectSmartQuestions(inputText, category, perspective);
      setQuestions(smart);
    }
  }, [inputText, category, perspective, initialQuestions]);

  // Fetch dynamic AI questions in background if none passed initially
  useEffect(() => {
    let isMounted = true;
    if (!initialQuestions || initialQuestions.length === 0) {
      setIsDynamicFetching(true);
      fetchSmartQuestions({ text: inputText, category, perspective })
        .then(aiQuestions => {
          if (isMounted && aiQuestions && aiQuestions.length >= 2) {
            // Only replace if user hasn't answered anything yet
            setAnswers(currentAnswers => {
              if (Object.keys(currentAnswers).length === 0) {
                setQuestions(aiQuestions);
              }
              return currentAnswers;
            });
          }
        })
        .finally(() => {
          if (isMounted) setIsDynamicFetching(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [inputText, category, perspective, initialQuestions]);

  // Sync state on question step change
  useEffect(() => {
    if (currentQ) {
      const existing = answers[currentQ.id];
      if (existing?.selectedOptionIds && existing.selectedOptionIds.length > 0) {
        setSelectedOptionIds(existing.selectedOptionIds);
      } else if (existing?.optionId) {
        setSelectedOptionIds([existing.optionId]);
      } else {
        setSelectedOptionIds([]);
      }
      setFreeTextNote(existing?.freeText || '');
    }
  }, [currentIndex, currentQ, answers]);

  // Handle option selection/toggle
  const handleToggleOption = (optId: string) => {
    if (currentQ.allowMultiple) {
      if (selectedOptionIds.includes(optId)) {
        setSelectedOptionIds(selectedOptionIds.filter(id => id !== optId));
      } else {
        setSelectedOptionIds([...selectedOptionIds, optId]);
      }
    } else {
      setSelectedOptionIds([optId]);
    }
  };

  // Evaluate follow-up triggers
  const evaluateAdaptiveExpansion = (lastOptId: string) => {
    if (questions.length >= 7) return;

    if (
      (lastOptId.includes('sleep') || (todayMood && todayMood.sleepHours < 6) || inputText.includes('نوم') || inputText.includes('تعب')) &&
      !questions.some(q => q.id === 'q-adapt-sleep-fatigue')
    ) {
      const sleepQ = ADAPTIVE_FOLLOWUP_QUESTIONS.find(q => q.id === 'q-adapt-sleep-fatigue');
      if (sleepQ && questions.length < 7) {
        setQuestions(prev => [...prev, sleepQ]);
      }
    }

    if (
      (lastOptId.includes('stress') || lastOptId.includes('explosive') || category === 'reaction' || inputText.includes('أعصب')) &&
      !questions.some(q => q.id === 'q-adapt-emotion-intensity')
    ) {
      const emotQ = ADAPTIVE_FOLLOWUP_QUESTIONS.find(q => q.id === 'q-adapt-emotion-intensity');
      if (emotQ && questions.length < 7) {
        setQuestions(prev => [...prev, emotQ]);
      }
    }
  };

  const canProceed = Boolean(
    selectedOptionIds.length > 0 || (freeTextNote && freeTextNote.trim().length >= 2)
  );

  const handleNext = () => {
    if (!canProceed) return;

    const selectedOptions = currentQ.options.filter(o => selectedOptionIds.includes(o.id));
    const combinedText = selectedOptions.map(o => o.textAr).join(' | ');

    const updatedAnswer: UserAnswer = {
      questionId: currentQ.id,
      optionId: selectedOptionIds[0],
      selectedOptionIds,
      optionText: combinedText,
      freeText: freeTextNote.trim() || undefined
    };

    const newAnswers = {
      ...answers,
      [currentQ.id]: updatedAnswer
    };
    setAnswers(newAnswers);

    if (selectedOptionIds.length > 0) {
      evaluateAdaptiveExpansion(selectedOptionIds[0]);
    }

    onSaveDraft(newAnswers, questions, currentIndex + 1);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinishQuestions(newAnswers, questions, activePerspective);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (selectedOptionIds.length > 0 || freeTextNote.trim()) {
        const selectedOptions = currentQ.options.filter(o => selectedOptionIds.includes(o.id));
        const updatedAnswer: UserAnswer = {
          questionId: currentQ.id,
          optionId: selectedOptionIds[0],
          selectedOptionIds,
          optionText: selectedOptions.map(o => o.textAr).join(' | '),
          freeText: freeTextNote.trim() || undefined
        };
        const newAnswers = {
          ...answers,
          [currentQ.id]: updatedAnswer
        };
        setAnswers(newAnswers);
        onSaveDraft(newAnswers, questions, currentIndex - 1);
      }
      setCurrentIndex(currentIndex - 1);
    } else {
      onBackToWriting();
    }
  };

  // Find active insight for the selected option (or latest selected)
  const activeSelectedOption = currentQ.options.find(
    o => selectedOptionIds[selectedOptionIds.length - 1] === o.id
  ) || currentQ.options.find(o => selectedOptionIds.includes(o.id));

  const activeInsight = activeSelectedOption?.insightAr;

  const categoryLabel = CATEGORY_NAMES[category] || 'سلوك';

  return (
    <div className="space-y-5 pb-28 max-w-lg mx-auto text-right px-1 sm:px-2">
      {/* Top Header Card */}
      <div className="flex items-center justify-between px-1 py-1">
        {/* Category & Perspective Header */}
        <div className="text-right space-y-1">
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {categoryLabel} • {activePerspective === 'other' ? 'عن شخص آخر' : 'عن نفسك'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bold truncate max-w-[280px]">
            الحالة: «{inputText}»
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={handlePrev}
          aria-label="الرجوع"
          className="w-10 h-10 rounded-full bg-white hover:bg-purple-50 border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-purple-700 transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Perspective Confirmation & Quick Switch Banner */}
      <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
        activePerspective === 'other'
          ? 'bg-cyan-50/80 border-cyan-200 text-cyan-950'
          : 'bg-purple-50/80 border-purple-200 text-purple-950'
      }`}>
        <div className="flex items-center gap-2.5">
          {activePerspective === 'other' ? (
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <User className="w-5 h-5" />
            </div>
          )}
          <div className="text-xs sm:text-sm font-bold leading-tight">
            <span className="block font-black text-slate-900">
              {activePerspective === 'other' ? 'منظور الحالة: عن شخص آخر' : 'منظور الحالة: عن نفسك'}
            </span>
            <span className="text-slate-600">
              {activePerspective === 'other'
                ? 'الأسئلة والخيارات مخصصة حصراً لتحليل تصرفات ودوافع الطرف الآخر'
                : 'الأسئلة والخيارات مخصصة حصراً لتحليل مشاعرك وسلوكياتك الشخصية'}
            </span>
          </div>
        </div>

        <button
          onClick={() => handleSwitchPerspective(activePerspective === 'other' ? 'self' : 'other')}
          className="text-xs px-3 py-1.5 rounded-xl font-black bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all text-slate-800"
          title="تبديل المنظور"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
          <span>تبديل لـ {activePerspective === 'other' ? 'عن نفسي' : 'عن شخص آخر'}</span>
        </button>
      </div>

      {/* Progress Line */}
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative shadow-inner">
        <div
          className="h-full bg-gradient-to-l from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
          style={{ width: `${Math.round(((currentIndex + 1) / questions.length) * 100)}%` }}
        />
      </div>

      {/* Main Question Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_6px_28px_rgba(132,78,206,0.08)] space-y-6">
        {/* Step Badge & Code */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 text-purple-950 text-xs sm:text-sm font-black border border-purple-200">
            السؤال {currentIndex + 1} من {questions.length}
          </span>

          {currentQ.codeBadge && (
            <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
              <Bookmark className="w-4 h-4 text-purple-600" />
              <span>{currentQ.codeBadge}</span>
            </span>
          )}
        </div>

        {/* Question Title */}
        <div className="space-y-2.5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
            {currentQ.questionAr}
          </h2>

          <p className="text-sm sm:text-base font-bold text-slate-600">
            {currentQ.subtitleAr || (currentQ.allowMultiple ? 'اختر إجابة أو أكثر:' : 'اختر الإجابة الأقرب لحالتك:')}
          </p>
        </div>

        {/* Scientific Reference Attribution Badge */}
        {currentQ.scienceBadge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-xs sm:text-sm font-black text-purple-950 shadow-2xs">
            <span className="text-purple-600 text-base">⚡</span>
            <span>{currentQ.scienceBadge}</span>
          </div>
        )}

        {/* Dynamic Follow-up Alert if applicable */}
        {currentQ.isFollowUp && currentQ.followUpReason && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-950 font-bold flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{currentQ.followUpReason}</span>
          </div>
        )}

        {/* Options List with Interactive Pills */}
        <div className="space-y-3.5 pt-1">
          {currentQ.options.map(option => {
            const isSelected = selectedOptionIds.includes(option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleToggleOption(option.id)}
                className={`w-full p-4 sm:p-5 rounded-2xl border text-right transition-all flex items-center justify-between gap-3.5 cursor-pointer group ${
                  isSelected
                    ? 'bg-purple-50 border-purple-600 shadow-sm text-purple-950'
                    : 'bg-white border-slate-200 hover:border-purple-300 text-slate-800 hover:bg-slate-50/70 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Circle Checkbox / Radio */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-600 text-white'
                        : 'border-slate-300 bg-white group-hover:border-purple-400'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <span className={`text-base sm:text-lg leading-relaxed ${isSelected ? 'font-black text-purple-950' : 'font-bold text-slate-800'}`}>
                    {option.textAr}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Smart Insight Card (احتمال) */}
        {activeInsight && (
          <div className="p-4.5 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-right space-y-2 animate-in fade-in slide-in-from-top-2 duration-250 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-sm sm:text-base">
              <Lightbulb className="w-5 h-5 text-emerald-600" />
              <span>احتمال علمي</span>
            </div>
            <p className="text-sm sm:text-base text-emerald-950 font-semibold leading-relaxed">
              {activeInsight}
            </p>
          </div>
        )}

        {/* Optional Custom Input Box */}
        <div className="pt-2">
          <input
            type="text"
            value={freeTextNote}
            onChange={e => setFreeTextNote(e.target.value)}
            placeholder="يمكنك إضافة سبب آخر أو توضيح أكثر (اختياري)..."
            className="w-full p-4.5 rounded-2xl bg-slate-50/90 border border-slate-200 focus:border-purple-600 focus:bg-white text-base text-slate-800 placeholder:text-slate-400 outline-none transition-all text-right font-medium shadow-2xs"
          />
        </div>

        {/* Footnote Note */}
        <div className="pt-2 text-center">
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">
            كل إجابة تُرسل إلى التحليل مربوطة بالعلم المذكور أعلاه وبحاجتها في هرم ماسلو ومهارة الذكاء العاطفي.
          </p>
        </div>
      </div>

      {/* Navigation Buttons: السابق والتالي */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          <span>السابق</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base transition-all cursor-pointer shadow-md ${
            canProceed
              ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25 active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          <span>{currentIndex + 1 === questions.length ? 'إظهار فكّ الشيفرة والنتيجة' : 'السؤال التالي'}</span>
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {!canProceed && (
        <p className="text-center text-xs text-slate-500 font-bold">
          اختر إجابة واحدة على الأقل أو اكتب توضيحك للانتقال
        </p>
      )}
    </div>
  );
};
