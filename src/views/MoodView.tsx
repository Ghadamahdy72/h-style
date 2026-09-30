import React, { useState } from 'react';
import { Smile, Moon, Calendar, Plus, Check, Trash2, Sparkles, Activity } from 'lucide-react';
import { MoodLog } from '../types';

interface MoodViewProps {
  moodLogs: MoodLog[];
  todayMood: MoodLog | null;
  onSaveMoodLog: (log: Omit<MoodLog, 'id' | 'date'>) => void;
  onDeleteMoodLog: (id: string) => void;
}

export const MoodView: React.FC<MoodViewProps> = ({
  moodLogs,
  todayMood,
  onSaveMoodLog,
  onDeleteMoodLog
}) => {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4 | 5>(todayMood?.moodLevel || 4);
  const [sleepHours, setSleepHours] = useState<number>(todayMood?.sleepHours || 7);
  const [sleepQuality, setSleepQuality] = useState<'poor' | 'average' | 'good'>(todayMood?.sleepQuality || 'good');
  const [note, setNote] = useState<string>(todayMood?.note || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const moodLevels = [
    { level: 1 as const, label: 'مرهق / منخفض', emoji: '😫', color: 'border-rose-400 bg-rose-50 text-rose-700' },
    { level: 2 as const, label: 'متوتر / قلق', emoji: '😟', color: 'border-amber-400 bg-amber-50 text-amber-700' },
    { level: 3 as const, label: 'محايد / عادي', emoji: '😐', color: 'border-slate-300 bg-slate-50 text-slate-700' },
    { level: 4 as const, label: 'رايق / هادئ', emoji: '🙂', color: 'border-cyan-400 bg-cyan-50 text-cyan-700' },
    { level: 5 as const, label: 'ممتاز / نشيط', emoji: '😄', color: 'border-purple-400 bg-purple-50 text-purple-700' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMoodLog({
      moodLevel: selectedLevel,
      sleepHours,
      sleepQuality,
      note: note.trim() || undefined
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-28 text-right max-w-md mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <span>سجل المزاج والنوم</span>
          <Smile className="w-5 h-5 text-purple-600" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          طاقتك الجسدية ونومك هما العامل الأكبر في سرعة استثارة التوتر وضعف التحكم.
        </p>
      </div>

      {/* Recording Form Card */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>تسجيل حالة اليوم</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </h2>
          {todayMood && (
            <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              تم التسجيل مسبقاً (يمكنك التحديث)
            </span>
          )}
        </div>

        {/* 1. Mood Level Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">
            1. كيف تقيّم مزاجك العام اليوم؟
          </label>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {moodLevels.map(item => {
              const isSelected = selectedLevel === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setSelectedLevel(item.level)}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? `${item.color} ring-2 ring-purple-600 scale-102 font-bold shadow-sm`
                      : 'border-slate-100 bg-slate-50/70 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <span className="text-2xl mb-1">{item.emoji}</span>
                  <span className="text-[10px] text-center line-clamp-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Sleep Hours & Quality */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-purple-600" />
              <span>2. ساعات النوم التي نلتها الليلة الماضية:</span>
            </label>
            <span className="text-sm font-black text-purple-700 font-mono">
              {sleepHours} ساعات
            </span>
          </div>

          <input
            type="range"
            min={3}
            max={12}
            step={0.5}
            value={sleepHours}
            onChange={e => setSleepHours(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-100 accent-purple-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>3 س (حرمان حاد)</span>
            <span>7 - 8 س (مثالي)</span>
            <span>12 س</span>
          </div>

          {/* Sleep Quality Selector */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-slate-500">جودة النوم:</span>
            <div className="flex gap-1.5">
              {(['poor', 'average', 'good'] as const).map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSleepQuality(q)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    sleepQuality === q
                      ? 'bg-purple-600 border-purple-600 text-white font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {q === 'poor' ? 'متقطع ومجهد' : q === 'average' ? 'متوسط' : 'عميق ومريح'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Note */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100">
          <label className="text-xs font-semibold text-slate-700">
            ملاحظة سريعة حول يومك (اختياري):
          </label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="مثال: ضغط عمل بالصباح، أو تمرين رياضي، أو سهرة عائلية..."
            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none text-right font-medium transition-colors"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>تم الحفظ وربطه بالتحليل!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>حفظ تسجيل اليوم</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Mood History List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span>سجل التسجيلات السابقة ({moodLogs.length})</span>
        </h2>

        {moodLogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center text-slate-400">
            <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-600">لم تسجل أي مزاج سابق بعد</p>
            <p className="text-[11px] text-slate-400 mt-1">سجل حالتك اليومية لتتبع نمط مشاعرك وعلاقتها بردود أفعالك</p>
          </div>
        ) : (
          <div className="space-y-2">
            {moodLogs.map(log => {
              const item = moodLevels.find(m => m.level === log.moodLevel) || moodLevels[2];
              return (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 text-right"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-purple-700 font-mono font-bold">
                          • {log.sleepHours}س نوم
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(log.date).toLocaleDateString('ar-QA', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                        {log.note && ` — «${log.note}»`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteMoodLog(log.id)}
                    className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="حذف هذا التسجيل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
