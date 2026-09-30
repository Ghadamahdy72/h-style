import React, { useState } from 'react';
import {
  User,
  History,
  Settings,
  Cpu,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronLeft,
  TrendingUp,
  Award,
  Sparkles,
  Share2,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  AnalysisResult,
  DraftSession,
  AISettings
} from '../types';
import { testAIConnection } from '../services/aiService';

interface ProfileViewProps {
  sessions: AnalysisResult[];
  moodCount: number;
  draftSession: DraftSession | null;
  onResumeDraft: () => void;
  onDiscardDraft: () => void;
  onViewSessionResult: (session: AnalysisResult) => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions: () => void;
  aiSettings: AISettings;
  onSaveAISettings: (settings: AISettings) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  sessions,
  moodCount,
  draftSession,
  onResumeDraft,
  onDiscardDraft,
  onViewSessionResult,
  onDeleteSession,
  onClearAllSessions,
  aiSettings,
  onSaveAISettings
}) => {
  const [showAISettingsModal, setShowAISettingsModal] = useState(false);
  const [activeAISettings, setActiveAISettings] = useState<AISettings>({ ...aiSettings });
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? (window.location.origin.includes('ais-') ? window.location.origin : 'https://ais-pre-meuwle3ofj7eb2yls5iial-424038611948.europe-west3.run.app')
    : 'https://ais-pre-meuwle3ofj7eb2yls5iial-424038611948.europe-west3.run.app';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`تفضل بتجربة منصة ومحرّك فكّ الشيفرة السلوكية والنفسية Hstyle Decode:\n${publicUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTestAI = async () => {
    setTestingConnection(true);
    setTestResult(null);
    const res = await testAIConnection(activeAISettings);
    setTestResult(res);
    setTestingConnection(false);
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAISettings(activeAISettings);
    setShowAISettingsModal(false);
  };

  // Current month calculation
  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();
  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const currentMonthName = monthNamesAr[currentMonthIndex];

  // Sessions completed in the current month
  const thisMonthSessions = sessions.filter(s => {
    try {
      const d = new Date(s.createdAt);
      return d.getMonth() === currentMonthIndex && d.getFullYear() === currentYear;
    } catch {
      return false;
    }
  });

  const weeklyData = [
    { name: 'الأسبوع 1', range: '1–7', count: 0 },
    { name: 'الأسبوع 2', range: '8–14', count: 0 },
    { name: 'الأسبوع 3', range: '15–21', count: 0 },
    { name: 'الأسبوع 4', range: '22+', count: 0 }
  ];

  thisMonthSessions.forEach(s => {
    try {
      const day = new Date(s.createdAt).getDate();
      if (day <= 7) weeklyData[0].count++;
      else if (day <= 14) weeklyData[1].count++;
      else if (day <= 21) weeklyData[2].count++;
      else weeklyData[3].count++;
    } catch {
      weeklyData[0].count++;
    }
  });

  const thisMonthCount = thisMonthSessions.length;

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const count = payload[0].value;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-purple-200/90 shadow-md text-right text-xs">
          <p className="font-extrabold text-slate-800">{label}</p>
          <p className="text-purple-600 font-black mt-0.5 flex items-center gap-1 justify-end">
            <span>{count} {count === 1 ? 'جلسة منجزة' : 'جلسات منجزة'}</span>
            <Sparkles className="w-3 h-3 text-fuchsia-500" />
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-28 text-right max-w-md mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <span>ملفّي وسجل الجلسات</span>
          <User className="w-5 h-5 text-purple-600" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          إحصائيات استخدامك، سجل فك الشيفرة، وإعدادات ربط الذكاء الاصطناعي.
        </p>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center">
          <span className="text-2xl sm:text-3xl font-black text-purple-600 font-mono">
            {sessions.length}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1 font-bold">
            جلسات التحليل
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center">
          <span className="text-2xl sm:text-3xl font-black text-cyan-600 font-mono">
            {moodCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1 font-bold">
            تسجيلات المزاج
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center">
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            100%
          </span>
          <span className="text-[11px] text-slate-500 block mt-1 font-bold">
            خصوصية محلية
          </span>
        </div>
      </div>

      {/* Monthly Sessions Progress Card (Recharts) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                إنجاز الجلسات خلال شهر {currentMonthName}
              </h2>
              <p className="text-[11px] text-slate-400">
                مؤشر الالتزام الأسبوعي بخطط فك الشيفرة والتغيير
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-extrabold text-[11px] border border-purple-100">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>{thisMonthCount} جلسة</span>
          </div>
        </div>

        {/* Mini stats row */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-2.5 rounded-2xl bg-[#FAF9FD] border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block">إجمالي الشهر</span>
            <span className="text-sm font-black text-purple-700 font-mono">{thisMonthCount}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#FAF9FD] border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block">معدل أسبوعي</span>
            <span className="text-sm font-black text-cyan-700 font-mono">
              {(thisMonthCount / 4).toFixed(1)}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#FAF9FD] border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block">حالة الالتزام</span>
            <span className="text-xs font-bold text-emerald-700">
              {thisMonthCount >= 4 ? 'مستمر بامتياز 🎯' : thisMonthCount > 0 ? 'في تطور ملحوظ 🌱' : 'بانتظار أول جلسة ✨'}
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-44 w-full pt-1" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="sessionBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#C026D3" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 10 }}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Bar
                dataKey="count"
                fill="url(#sessionBarGrad)"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Motivational Footer Note */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>الاستمرار في تفكيك ردود أفعالك يعزز وعيك العصبي ويثبّت خطة التغيير الذاتي.</span>
        </div>
      </div>

      {/* Draft Alert if present */}
      {draftSession && (
        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <RotateCcw className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-amber-900 block">
                لديك جلسة مسودة لم تكتمل
              </span>
              <p className="text-[11px] text-amber-700 truncate mt-0.5">
                «{draftSession.inputText}»
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onResumeDraft}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              استئناف
            </button>
            <button
              onClick={onDiscardDraft}
              className="px-2 py-1.5 rounded-xl bg-white text-amber-800 hover:text-rose-600 text-xs border border-amber-200 cursor-pointer"
            >
              حذف
            </button>
          </div>
        </div>
      )}

      {/* Public Share & Publish Card */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50/40 rounded-3xl p-5 border border-purple-100 shadow-[0_2px_12px_rgba(132,78,206,0.06)] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                رابط المنصة للنشر والمشاركة
              </h2>
              <p className="text-[11px] text-slate-500">
                رابط فعال ومباشر لمشاركته مع المستفيدين أو نشره
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            جاهز للنشر 🚀
          </span>
        </div>

        {/* Link Box */}
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-white border border-purple-200/80 shadow-2xs">
          <input
            type="text"
            readOnly
            value={publicUrl}
            className="flex-1 bg-transparent text-xs font-mono text-purple-950 font-semibold outline-none px-1 text-left truncate"
            dir="ltr"
          />
          <button
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              copiedLink
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Share Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>مشاركة عبر واتساب</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <span>فتح الرابط</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* AI Settings Section Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                إعدادات الذكاء الاصطناعي
              </h2>
              <p className="text-[11px] text-slate-400">
                {aiSettings.enabled
                  ? `نشط (${aiSettings.provider} • ${aiSettings.model})`
                  : 'يعمل بالمحرّك المحلي التوليدي المدمج (بدون إنترنت)'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAISettingsModal(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-all cursor-pointer"
          >
            تعديل
          </button>
        </div>
      </div>

      {/* Sessions History List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">
              سجل الجلسات السابقة ({sessions.length})
            </h2>
          </div>

          {sessions.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من حذف كامل سجل الجلسات؟ لا يمكن التراجع عن هذا الإجراء.')) {
                  onClearAllSessions();
                }
              }}
              className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح السجل بالكامل</span>
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center text-slate-400 space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-medium text-slate-600">لم تجرِ أي جلسة فك شيفرة حتى الآن</p>
            <p className="text-[11px] text-slate-400">
              كل حالة تفك شيفرتها ستجد تقريرها التفصيلي محفوظاً هنا لمراجعته وتتبع تطورك
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.map(session => (
              <div
                key={session.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-purple-200 transition-all flex items-start justify-between gap-3 text-right"
              >
                <div
                  onClick={() => onViewSessionResult(session)}
                  className="min-w-0 flex-1 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-100">
                      ثقة {session.confidenceScore}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(session.createdAt).toLocaleDateString('ar-QA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-50 text-slate-500">
                      {session.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-bold mt-1.5 line-clamp-1 group-hover:text-purple-700 transition-colors">
                    «{session.inputText}»
                  </p>

                  <p className="text-xs text-purple-600 font-medium mt-1 line-clamp-1">
                    السبب الأبرز: {session.probabilities[0]?.titleAr}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    onClick={() => onViewSessionResult(session)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-purple-600 transition-colors cursor-pointer"
                    title="عرض التقرير"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="حذف الجلسة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Settings Modal */}
      {showAISettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-slate-100 shadow-2xl text-right space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>إعدادات الذكاء الاصطناعي</span>
              </h2>
              <button
                onClick={() => setShowAISettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                إغلاق ✕
              </button>
            </div>

            <form onSubmit={handleSaveAI} className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                <div>
                  <span className="font-bold text-purple-900 block">
                    تفعيل استدعاء الذكاء الاصطناعي
                  </span>
                  <span className="text-[10px] text-purple-600">
                    عند التعطيل يعتمد التطبيق 100% على المحرك المحلي المدمج
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={activeAISettings.enabled}
                  onChange={e => setActiveAISettings({ ...activeAISettings, enabled: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">المزود (Provider):</label>
                <select
                  value={activeAISettings.provider}
                  onChange={e => setActiveAISettings({ ...activeAISettings, provider: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none"
                >
                  <option value="gemini">Google Gemini (الافتراضي السريع)</option>
                  <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                  <option value="azure">Azure OpenAI</option>
                  <option value="custom">مزوّد متوافق مخصص</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">نقطة النهاية (Endpoint URL):</label>
                <input
                  type="text"
                  value={activeAISettings.endpoint}
                  onChange={e => setActiveAISettings({ ...activeAISettings, endpoint: e.target.value })}
                  placeholder={activeAISettings.provider === 'gemini' ? 'تلقائي لخادم التطبيق' : 'https://api.openai.com/v1'}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">اسم النموذج (Model):</label>
                <input
                  type="text"
                  value={activeAISettings.model}
                  onChange={e => setActiveAISettings({ ...activeAISettings, model: e.target.value })}
                  placeholder="gemini-3.8-flash أو gpt-4o"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">مفتاح API (API Key):</label>
                <input
                  type="password"
                  value={activeAISettings.apiKey}
                  onChange={e => setActiveAISettings({ ...activeAISettings, apiKey: e.target.value })}
                  placeholder="اتركه فارغاً لاستخدام المفتاح المدمج"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleTestAI}
                  disabled={testingConnection}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{testingConnection ? 'جارٍ الفحص...' : 'اختبار الاتصال'}</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-2.5 rounded-xl text-[11px] leading-relaxed flex items-start gap-1.5 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAISettingsModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-sm"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
