import React, { useState } from 'react';
import {
  Copy,
  Download,
  Check,
  RotateCcw,
  Sparkles,
  PieChart,
  GitCommit,
  CalendarCheck,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { HstyleLogo } from '../components/HstyleLogo';

interface ResultViewProps {
  result: AnalysisResult;
  onStartNewSession: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onStartNewSession
}) => {
  const [activeTab, setActiveTab] = useState<'probabilities' | 'analysis' | 'plan' | 'signals'>('probabilities');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [expandedCodeId, setExpandedCodeId] = useState<string | null>(null);

  // Generate plain-text report content for copying or downloading
  const generateTextReport = () => {
    const dateFormatted = new Date(result.createdAt).toLocaleDateString('ar-QA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const probLines = result.probabilities
      .map(p => `• ${p.titleAr}: ${p.percentage}%\n  - التفسير: ${p.explanationAr}`)
      .join('\n');

    const confirmedCodes = result.confirmedCodes
      .map(c => `• ${c.codeNameAr}: ${c.relevanceAr}`)
      .join('\n');

    const questionsSummary = result.questionsSnapshot
      .map((q, i) => `س ${i + 1}: ${q.questionAr}\n  - الإجابة: ${q.chosenAnswerAr || 'بدون تحديد'}${q.userNote ? `\n  - ملاحظة المستخدم: ${q.userNote}` : ''}`)
      .join('\n');

    return `
==================================================
        تقرير فكّ الشيفرة - Hstyle Decode
==================================================
تاريخ التقرير: ${dateFormatted}
معرّف الجلسة: ${result.id}
درجة ثقة التحليل: ${result.confidenceScore}%
المنظور: ${result.perspective === 'other' ? 'عن شخص آخر' : 'عن المستخدم نفسه'}
التصنيف: ${result.category}

--------------------------------------------------
1. نص الحالة المكتوبة:
«${result.inputText}»

--------------------------------------------------
2. القراءة التحليلية للحالة:
${result.textualReading}

${result.alternativeReading ? `[قراءة أخرى]:\n${result.alternativeReading}\n` : ''}

--------------------------------------------------
3. الاحتمالات ومصفوفة الأسباب:
${probLines}

--------------------------------------------------
4. الشيفرات السلوكية المثبتة:
${confirmedCodes}

--------------------------------------------------
5. الحاجة الأبرز (هرم ماسلو):
• ${result.prominentMaslowNeed.nameAr} (${result.prominentMaslowNeed.level})
  - ${result.prominentMaslowNeed.explanationAr}

--------------------------------------------------
6. مهارة الذكاء العاطفي المطلوبة:
• ${result.emotionalIntelligenceSkill.skillNameAr}
  - ${result.emotionalIntelligenceSkill.descriptionAr}
  - تطبيق فوري: ${result.emotionalIntelligenceSkill.actionTipAr}

--------------------------------------------------
7. سلسلة الحلقة السلوكية:
• 1. المُطلِق: ${result.behavioralLoop.trigger}
• 2. التفسير: ${result.behavioralLoop.interpretation}
• 3. الانفعال: ${result.behavioralLoop.emotion}
• 4. الفعل: ${result.behavioralLoop.action}
• 5. المكسب الفوري: ${result.behavioralLoop.immediatePayoff}
• 6. الكلفة المتأخرة: ${result.behavioralLoop.delayedCost}

--------------------------------------------------
8. خطة التغيير السلوكي:
• خطوة الـ 24 ساعة: ${result.changePlan.step24Hours}
• خطة اليوم: ${result.changePlan.todayPlan}
• خطة الأسبوع: ${result.changePlan.weeklyPlan}
• خطة الشهر: ${result.changePlan.monthlyPlan}
• قاعدة «إذا... فإنني...»: ${result.changePlan.ifThenRule}
• مؤشرات قياس التقدم: ${result.changePlan.progressIndicators.join(' | ')}
• بروتوكول الانتكاس: ${result.changePlan.relapseProtocol}

--------------------------------------------------
9. تفاصيل الأسئلة والإجابات:
${questionsSummary}

--------------------------------------------------
10. المراجع والنظريات العلمية:
${result.referencedSciences.map(s => `• ${s.nameAr} - ${s.authorAr} (${s.officialUrl})`).join('\n')}

==================================================
تنبيه: أداة وعي ذاتي وليست تشخيصاً طبياً.
منصة Hstyle Decode - جميع الحقوق محفوظة.
==================================================
    `.trim();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateTextReport());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    const textContent = generateTextReport();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `تقرير_فك_الشيفرة_Hstyle_Decode_${todayStr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="space-y-6 pb-36 text-right max-w-lg mx-auto px-1 sm:px-2">
      {/* Title Section */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            النتيجة
          </h1>
          <div className="w-6 h-6">
            <HstyleLogo size="xs" showText={false} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-purple-600 text-sm font-bold shadow-xs hover:border-purple-200 transition-all cursor-pointer"
            title="نسخ ملخص النتيجة"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-purple-600" />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
            title="تحميل ملف نصي كامل"
          >
            {downloaded ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4 text-white" />}
            <span>{downloaded ? 'تم التحميل' : 'حفظ'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('probabilities')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-sm whitespace-nowrap transition-all cursor-pointer text-center ${
            activeTab === 'probabilities'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          مربع الاحتمال
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-sm whitespace-nowrap transition-all cursor-pointer text-center ${
            activeTab === 'analysis'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          التحليل
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-sm whitespace-nowrap transition-all cursor-pointer text-center ${
            activeTab === 'plan'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          {result.perspective === 'other' ? 'بروتوكول التعامل' : 'خطة التغيير'}
        </button>

        <button
          onClick={() => setActiveTab('signals')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-extrabold text-sm whitespace-nowrap transition-all cursor-pointer text-center ${
            activeTab === 'signals'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          الإشارات
        </button>
      </div>

      {/* 1. Tab: مربع الاحتمال */}
      {activeTab === 'probabilities' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Card: «القراءة اكتملت ✅» */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900">
                القراءة اكتملت
              </span>
              <span className="text-emerald-500 font-bold text-base">✅</span>
            </div>
            <p className="text-sm text-slate-500 font-medium -mt-1">
              تحليل مبني على {result.questionsSnapshot.length} أسئلة و{result.referencedSciences.length} مراجع علمية
            </p>

            {/* Quoted highlight box */}
            <div className="p-4 rounded-2xl bg-purple-50/80 border-r-4 border-purple-600 text-right">
              <span className="text-base font-black text-purple-950 leading-relaxed block">
                «{result.inputText}»
              </span>
            </div>

            {/* Ultra-concise bullet points analysis */}
            <div className="space-y-2.5 pt-1 text-sm sm:text-base leading-relaxed">
              {result.textualReading && result.textualReading.includes('•') ? (
                result.textualReading.split('\n').filter(l => l.trim().length > 0).map((line, idx) => {
                  const cleaned = line.replace(/^[•\-\*]\s*/, '');
                  const colonIdx = cleaned.indexOf(':');
                  const label = colonIdx !== -1 ? cleaned.slice(0, colonIdx) : '';
                  const body = colonIdx !== -1 ? cleaned.slice(colonIdx + 1) : cleaned;
                  return (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-purple-50/40 border border-purple-100/70">
                      <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-2"></span>
                      <div className="flex-1">
                        {label ? (
                          <>
                            <strong className="text-purple-950 font-black">{label}:</strong>
                            <span className="text-slate-800 font-medium"> {body}</span>
                          </>
                        ) : (
                          <span className="text-slate-800 font-medium">{cleaned}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 text-slate-800 font-medium">
                  {result.textualReading || (
                    <span>
                      المرجّح الأول هو <strong className="text-purple-700 font-extrabold">{result.probabilities[0]?.titleAr}</strong> بنسبة{' '}
                      <strong className="text-purple-700 font-extrabold">{result.probabilities[0]?.percentage}%</strong>.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card: «الاحتمالات 📊» */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">
                  الاحتمالات
                </span>
                <span className="text-base">📊</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-1">
                ليست تسميات نهائية، بل فرضيات مرتبة عملياً وفق ما أدليت به
              </p>
            </div>

            {/* Bars */}
            <div className="space-y-4">
              {result.probabilities.map((prob, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="font-extrabold text-slate-900">
                      {prob.titleAr}
                    </span>
                    <span className="font-black text-purple-700 font-mono text-base">
                      {prob.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-200/80 overflow-hidden">
                    <div
                      className={`h-full ${prob.color} rounded-full transition-all duration-500`}
                      style={{ width: `${prob.percentage}%` }}
                    />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {prob.explanationAr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card: «الشيفرات التي ثبتت 🧩» */}
          {result.confirmedCodes && result.confirmedCodes.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900">
                    الشيفرات التي ثبتت
                  </span>
                  <span className="text-base">🧩</span>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  العوامل النفسية التي ظهرت فعلياً في حالتك
                </p>
              </div>

              <div className="space-y-2.5">
                {result.confirmedCodes.map(code => (
                  <div
                    key={code.codeId}
                    className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/80 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-extrabold text-purple-950">
                        {code.codeNameAr}
                      </span>
                      <span className="text-xs font-bold text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                        تأثير مباشر
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      {code.relevanceAr}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card: «قراءة أخرى 🔄» */}
          {result.alternativeReading && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">
                  قراءة أخرى
                </span>
                <RefreshCw className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                قد يكون السبب الأبرز فعلياً{' '}
                <strong className="text-rose-600 font-bold">{result.probabilities[1]?.titleAr || 'انفعال غير منظّم'}</strong> بنسبة{' '}
                <strong className="text-rose-600 font-bold">({result.probabilities[1]?.percentage || 28}%)</strong>.
                راقب الحالة أسبوعاً وسجّل ما يسبقها لتحسم أيّ القراءتين أدقّ في وضعك.
              </p>
            </div>
          )}

          {/* Card: «درجة ثقة التحليل» */}
          <div className="rounded-[32px] bg-gradient-to-b from-[#1C0D3E] via-[#2A1259] to-[#7B1FA2] text-white p-7 shadow-xl shadow-purple-950/20 space-y-4">
            <span className="text-sm font-bold text-purple-200 block">
              درجة ثقة التحليل
            </span>

            {/* Huge Percentage */}
            <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight">
              {result.confidenceScore}%
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${result.confidenceScore}%` }}
              />
            </div>

            <p className="text-sm text-purple-200 leading-relaxed pt-1">
              الثقة تقيس وضوح النمط من النص والإجابات، وليست يقيناً أو تشخيصاً.
            </p>
          </div>

          {/* Card: «المصادر والأبحاث العلمية المستند إليها 📚» */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">
                  المصادر والأبحاث العلمية المستند إليها التحليل
                </span>
                <span className="text-base">📚</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                توثيق إكلينيكي مستمد من قائمة الـ 25 علماً ونظرية المعتمدة في منصة Hstyle Decode
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {result.referencedSciences.map(sci => (
                <div key={sci.id} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/80 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base">
                        {sci.nameAr}
                      </h4>
                      <span className="text-xs sm:text-sm font-bold text-purple-700 block mt-0.5">
                        العالم / الباحث: {sci.authorAr}
                      </span>
                    </div>

                    <a
                      href={sci.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold transition-colors text-xs bg-white px-2.5 py-1.5 rounded-xl border border-purple-200 shadow-2xs shrink-0"
                    >
                      <span>الموقع الرسمي</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {sci.referenceAr && (
                    <p className="text-xs font-mono text-slate-600 bg-white/70 p-2 rounded-xl border border-purple-100/60 leading-relaxed dir-ltr text-left">
                      📖 {sci.referenceAr}
                    </p>
                  )}

                  {sci.summaryAr && (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {sci.summaryAr}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Tab: التحليل السلوكي */}
      {activeTab === 'analysis' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* الحلقة السلوكية السداسية */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  كيف تعمل الحلقة عندك
                </h2>
                <span className="text-base">🧠</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                تسلسل ما يحدث خطوة بخطوة في جهازك العصبي وسلوكك
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 font-mono shadow-xs">
                  1
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-purple-950">المُطلِق (The Trigger)</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.behavioralLoop.trigger}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 font-mono shadow-xs">
                  2
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-indigo-950">التفسير المعرفي (Appraisal)</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.behavioralLoop.interpretation}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-pink-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 font-mono shadow-xs">
                  3
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-pink-950">الانفعال والشعور (Emotion)</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.behavioralLoop.emotion}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-rose-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 font-mono shadow-xs">
                  4
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-rose-950">الفعل والاستجابة (Action)</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.behavioralLoop.action}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 font-mono shadow-xs">
                  5
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-emerald-950">المكسب الفوري الخفي (Immediate Payoff)</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.behavioralLoop.immediatePayoff}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-xl bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 font-mono shadow-xs">
                  6
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-amber-950">الكلفة المتأخرة والندم (Delayed Cost)</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.behavioralLoop.delayedCost}</p>
                </div>
              </div>
            </div>
          </div>

          {/* الحاجة الأبرز (هرم ماسلو) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-2">
            <span className="text-xs font-extrabold text-purple-700 block">الحاجة النفسية الأبرز (هرم ماسلو):</span>
            <h3 className="text-base font-black text-slate-900">{result.prominentMaslowNeed.nameAr}</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.prominentMaslowNeed.explanationAr}</p>
          </div>

          {/* مهارة الذكاء العاطفي المطلوبة */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-2.5">
            <span className="text-xs font-extrabold text-indigo-700 block">مهارة الذكاء العاطفي المطلوبة:</span>
            <h3 className="text-base font-black text-slate-900">{result.emotionalIntelligenceSkill.skillNameAr}</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.emotionalIntelligenceSkill.descriptionAr}</p>
            <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-indigo-950">
              <strong className="text-indigo-700 font-extrabold">تطبيق فوري: </strong>
              <span className="font-medium">{result.emotionalIntelligenceSkill.actionTipAr}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Tab: خطة التغيير / بروتوكول التعامل */}
      {activeTab === 'plan' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Dynamic Perspective Banner */}
          {result.perspective === 'other' ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <span className="font-bold text-amber-950">بروتوكول التعامل الإستراتيجي مع الطرف الآخر وحماية الحدود</span>
              </div>
              <span className="font-black text-amber-700 text-xs px-2.5 py-1 rounded-full bg-amber-100/80">إدارة العلاقات</span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <span className="font-bold text-purple-950">خطة إعادة البرمجة السلوكية والتعافي الذاتي</span>
              </div>
              <span className="font-black text-purple-700 text-xs px-2.5 py-1 rounded-full bg-purple-100/80">تعديل سلوكي</span>
            </div>
          )}

          {/* 1. خطوة الـ 24 ساعة الحاسمة */}
          <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white p-6 space-y-2.5 shadow-lg shadow-purple-900/20">
            <span className="text-xs font-black text-purple-200 block uppercase tracking-wider">
              {result.perspective === 'other'
                ? '⚡ خطوة الـ 24 ساعة الحاسمة (نزع الفتيل ووقف الاستنزاف):'
                : '⚡ خطوة الـ 24 ساعة الحاسمة (كسر الحلقة التلقائية):'}
            </span>
            <p className="text-base sm:text-lg font-black text-white leading-relaxed">
              {result.changePlan.step24Hours}
            </p>
          </div>

          {/* 2. التدرج الزمني السلوكي */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-slate-900">
                {result.perspective === 'other' ? 'التدرج الزمني لإدارة الموقف' : 'التدرج الزمني للتغيير والتعافي'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                خطوات متدرجة مثبتة إكلينيكياً لترسيخ الاتزان وحماية طاقتك
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-purple-900 font-extrabold text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <span>خطة اليوم (التدخل الفوري):</span>
                </strong>
                <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">يومي</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium pt-0.5">{result.changePlan.todayPlan}</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-indigo-900 font-extrabold text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span>خطة الأسبوع (تثبيت الحدود):</span>
                </strong>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">أسبوعي</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium pt-0.5">{result.changePlan.weeklyPlan}</p>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-cyan-900 font-extrabold text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                  <span>خطة الشهر (إعادة ضبط المسار المستدام):</span>
                </strong>
                <span className="text-xs font-bold text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded-md">شهري</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium pt-0.5">{result.changePlan.monthlyPlan}</p>
            </div>
          </div>

          {/* 3. قاعدة التنفيذ الفوري الشرطية (Implementation Intentions) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-2.5">
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold text-purple-700 block">
                قاعدة «إذا… فإنني…» السلوكية (Implementation Intentions):
              </span>
              <p className="text-xs text-slate-500 font-medium">
                رابط شرطي عصبي مباشر يبرمج استجابتك البديلة فور حدوث المثير
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/80 text-sm sm:text-base text-purple-950 font-bold leading-relaxed border border-purple-200">
              {result.changePlan.ifThenRule}
            </div>
          </div>

          {/* 4. مؤشرات قياس التقدم والتعافي (Key Progress Indicators) */}
          {result.changePlan.progressIndicators && result.changePlan.progressIndicators.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3">
              <div className="space-y-0.5">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  مؤشرات قياس التقدم والتعافي الملموس:
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  علامات عملية تؤكد أن الخطة تؤتي ثمارها في حياتك اليومية
                </p>
              </div>
              <ul className="space-y-2 text-sm text-slate-800 font-medium">
                {result.changePlan.progressIndicators.map((ind, i) => (
                  <li key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 leading-relaxed flex items-start gap-2.5">
                    <span className="text-purple-600 font-black mt-0.5">📈</span>
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. بروتوكول احتواء التعثر والانتكاس */}
          {result.changePlan.relapseProtocol && (
            <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">🛡️</span>
                <span className="font-black text-amber-950 block text-sm sm:text-base">
                  {result.perspective === 'other'
                    ? 'بروتوكول احتواء التراجع وتصاعد النزاع:'
                    : 'بروتوكول التعامل مع التعثر والانتكاس السلوكي:'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                {result.changePlan.relapseProtocol}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. Tab: الإشارات */}
      {activeTab === 'signals' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Dynamic Perspective Badge */}
          {result.perspective === 'other' ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">👥</span>
                <span className="font-bold text-amber-950">إشارات سلوكية خاصة بالطرف الآخر (ديناميكية وفق حالتك)</span>
              </div>
              <span className="font-black text-amber-700 text-xs px-2.5 py-1 rounded-full bg-amber-100/80">رصد وتحليل</span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">👤</span>
                <span className="font-bold text-blue-950">إشارات رصد الوعي الذاتي (ديناميكية وفق حالتك)</span>
              </div>
              <span className="font-black text-blue-700 text-xs px-2.5 py-1 rounded-full bg-blue-100/80">وعي ذاتي</span>
            </div>
          )}

          {/* 1. ما تلاحظه (سياق الملاحظة) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3">
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-black text-purple-950">
                {result.perspective === 'other' 
                  ? 'ما تلاحظه في تصرفات الطرف الآخر وسياقاته:' 
                  : 'ما تلاحظه في نفسك وجسدك في الأيام القادمة:'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {result.perspective === 'other'
                  ? 'المؤشرات المبكرة ولغة الجسد والمثيرات التي تسبق تصاعد السلوك'
                  : 'الإنذارات الجسدية والتفسيرات التلقائية التي تسبق الانجراف في العادة'}
              </p>
            </div>
            <ul className="space-y-2 text-sm text-slate-800 font-medium">
              {(result.signals?.whatToObserve || []).map((obs, i) => (
                <li key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 leading-relaxed flex items-start gap-2.5">
                  <span className="text-purple-600 font-black mt-0.5">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. ما تفعله عملياً (بروتوكول التحرك) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3">
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-black text-emerald-950">
                {result.perspective === 'other'
                  ? 'بروتوكول التعامل الميداني معه (ما تفعله عملياً):'
                  : 'خطوات التحكم وإعادة التوازن الذاتي (ما تفعله عملياً):'}
              </h3>
              <p className="text-xs text-emerald-700 font-medium">
                {result.perspective === 'other'
                  ? 'خطوات محددة للتعامل الحازم والهادئ ووضع الحدود دون استنزاف طاقتك'
                  : 'إجراءات فورية لتهدئة الانفعال واستعادة السيطرة التنفيذية'}
              </p>
            </div>
            <ul className="space-y-2 text-sm text-slate-800 font-medium">
              {(result.signals?.practicalActions || []).map((act, i) => (
                <li key={i} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 leading-relaxed flex items-start gap-2.5">
                  <span className="text-emerald-600 font-black mt-0.5">✓</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. علامات حمراء ومؤشرات الخطر */}
          <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-2.5 text-sm">
            <div className="space-y-0.5">
              <span className="font-black text-rose-950 block text-sm sm:text-base">
                {result.perspective === 'other'
                  ? 'الخطوط الحمراء ومؤشرات الخطورة في التعامل:'
                  : 'إشارات تستدعي تدخلاً أو دعماً تخصصياً:'}
              </span>
              <p className="text-xs text-rose-700 font-medium">
                {result.perspective === 'other'
                  ? 'علامات تدل على ضرورة الحسم التام أو طلب مساعدة أسرية واستشارية'
                  : 'مؤشرات تدل على استنزاف حاد يتطلب استشارة مختص وعدم التردد في طلب الدعم'}
              </p>
            </div>
            <ul className="space-y-1.5 text-rose-900 font-medium pt-1">
              {(result.signals?.professionalAlerts || []).map((alt, i) => (
                <li key={i} className="leading-relaxed flex items-start gap-2">
                  <span className="text-rose-600 font-black">⚠️</span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* جهات ومراجع الدعم المعتمدة */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-3.5">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-purple-600" />
                <span>جهات الدعم والمراجع المعتمدة (روابط رسمية):</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                قنوات معتمدة للاستشارات التخصصية والتثقيف الصحي والسلوكي
              </p>
            </div>

            <div className="space-y-2.5">
              {result.signals.officialResources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-[#FAF9FD] hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-200 transition-all text-right group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {res.name}
                    </span>
                    <span className="text-xs text-purple-600 flex items-center gap-1 font-bold">
                      <span>زيارة الموقع</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <span className="text-xs text-purple-700 font-bold block mt-1">
                    {res.org}
                  </span>
                  <p className="text-xs text-slate-600 mt-1.5 font-medium leading-relaxed">
                    {res.phoneOrNote}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Start New Case Button */}
      <div className="pt-3">
        <button
          onClick={onStartNewSession}
          className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>بدء فك شيفرة لحالة جديدة</span>
        </button>
      </div>
    </div>
  );
};
