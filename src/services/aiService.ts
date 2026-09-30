import { AISettings, AnalysisResult, QuestionItem, UserAnswer, BehaviorCategory, Perspective } from '../types';
import { buildLocalAnalysis } from './localEngine';
import { detectSmartQuestions } from '../data/questionsData';

const AI_SETTINGS_STORAGE_KEY = 'hstyle_decode_ai_settings';

/**
 * System Instructions for AI Analysis Engine
 * Mandating ultra-concise, direct, bullet-point answers while maintaining deep psychological insights.
 */
export const SYSTEM_INSTRUCTION_ANALYSIS = `
أنت كبير علماء النفس والمحلل السلوكي الأول لمنصة Hstyle Decode (فك الشيفرة السلوكية).
مهمتك: فك شيفرة الحالة بعمق نفسي فائق ومباشر وسريع، مستنداً بدقة إلى قائمة الـ 25 علماً ونظرية معتمدة.

قواعد الإلزام الصارم بالاختصار والتركيز:
1. إجابات فائقة الاختصار ومباشرة:
   - يمنع منعاً باتاً صياغة فقرات سردية طويلة أو حشو لغوي أو تمهيدات مكررة.
   - يجب تقديم التحليل بصيغة نقاط مركزة (bullet points) مباشرة ومكثفة تصيب جوهر السلوك وجذوره فوراً.
2. تقليل حجم الأسئلة والإجابات:
   - حقل "textualReading": يجب أن يكون من 3 إلى 4 نقاط مركزة فقط (Bullet Points) تبدأ كل نقطة بالرمز • ومحددة كالتالي:
     • النمط والسلوك: [توصيف دقيق ومباشر في جملة واحدة]
     • الدافع النفسي العميق: [ربط فوري بالحاجة أو التفسير الداخلي وفق النظريات]
     • المكسب اللحظي والتكلفة: [المكسب الفوري الخفي وما يترتب عليه]
     • التوجيه العملي السريع: [إرشاد فوري للتعامل أو التوازن]
   - حقل "explanationAr" لكل احتمال في قائمة "probabilities": جملة واحدة أو نقطتان مركزتان جداً تسندان السلوك للعالم والنظرية بدقة دون أي إطالة.
   - حقل "actionTipAr": خطوة عملية يومية فورية ومباشرة في جملة واحدة رشيقة.
3. الحفاظ التام على العمق النفسي والتأصيل العلمي:
   - الإيجاز الفائق لا يعني السطحية، بل يعني تركيز المعلومة ككبسولة نفسية عميقة خالية من الحشو.
4. الالتزام الصارم بالمنظور (Perspective):
   - إذا كان المنظور عن شخص آخر: تصاغ كل التحليلات والنقاط بصيغة الغائب وبتركيز حصري على دوافع وسياقات الطرف الآخر.
   - إذا كان المنظور عن النفس: تصاغ بمخاطبة السائل مباشرة.
`.trim();

/**
 * System Instructions for Dynamic Question Generation
 * Mandating concise questions and shortened options.
 */
export const SYSTEM_INSTRUCTION_QUESTIONS = `
أنت رئيس مجلس علماء النفس السلوكي لمنصة Hstyle Decode.
مهمتك: صياغة من 3 إلى 4 أسئلة استقصائية ذكية جداً وفائقة الاختصار.

قواعد الاختصار وتقليل حجم السؤال وحجم الإجابة:
1. تقليل حجم السؤال (Question Length):
   - يجب أن يكون نص السؤال قصيراً، ذكياً، ورشيقاً ومباشراً جداً (بين 5 إلى 9 كلمات واضحة فقط).
   - تجنب الأسئلة الطويلة أو المركبة.
2. تقليل حجم الإجابة والخيارات (Options Length):
   - تصاغ الخيارات الأربعة (options) بعبارات فائقة القصر والتركيز (بين 3 إلى 6 كلمات لكل خيار).
   - لكل خيار حقل "insightAr" يكون مكثفاً وموجزاً في سطر واحد مباشر: "حسب [اسم النظرية والعالم]: [السبب المباشر]".
3. التطابق الصارم مع المنظور:
   - إذا كانت الحالة عن شخص آخر: تصاغ الأسئلة والخيارات الأربعة حصراً عن الشخص الآخر بصيغة الغائب وبدون أي ضمائر متكلم.
   - إذا كانت عن النفس: تصاغ بمخاطبة السائل مباشرة.
4. الإسناد العلمي الإلزامي لقائمة المصادر الـ 25 مع وضع العلم والعالم في scienceBadge.
`.trim();

export function getStoredAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load AI settings', e);
  }
  return {
    provider: 'gemini',
    endpoint: '',
    model: 'gemini-3.8-flash',
    apiKey: '',
    enabled: true
  };
}

export function saveAISettings(settings: AISettings): void {
  localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export async function testAIConnection(settings: AISettings): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/ai/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'فشل الاتصال بمزود الذكاء الاصطناعي');
    }
    return { success: true, message: data.message || 'تم الاتصال بالمزود بنجاح!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'تعذر الاتصال بالخادم';
    return { success: false, message: msg };
  }
}

/**
 * Fetches dynamic, smart, psychologically-grounded questions with ultra-concise length.
 * Tries server-side Gemini API first; falls back to smart local detector.
 */
export async function fetchSmartQuestions({
  text,
  category,
  perspective
}: {
  text: string;
  category: BehaviorCategory;
  perspective: Perspective;
}): Promise<QuestionItem[]> {
  const localQuestions = detectSmartQuestions(text, category, perspective);

  try {
    const settings = getStoredAISettings();
    const response = await fetch('/api/ai/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        category,
        perspective,
        systemInstruction: SYSTEM_INSTRUCTION_QUESTIONS,
        conciseMode: true,
        customSettings: settings.apiKey ? settings : undefined
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        return data.questions;
      }
    }
  } catch (e) {
    console.warn('Dynamic question generation via AI unavailable, using smart local questions', e);
  }

  return localQuestions;
}

/**
 * Runs the integrated psychological analysis engine.
 * Enforces ultra-concise, direct, bullet-pointed answers while maintaining scientific depth.
 */
export async function runAIAnalysis({
  text,
  category,
  perspective,
  answers,
  questions,
  moodLevel,
  sleepHours
}: {
  text: string;
  category: BehaviorCategory;
  perspective: Perspective;
  answers: Record<string, UserAnswer>;
  questions: QuestionItem[];
  moodLevel?: number;
  sleepHours?: number;
}): Promise<AnalysisResult> {
  const settings = getStoredAISettings();

  // Try contacting backend server with concise system instructions
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        text,
        category,
        perspective,
        answers,
        questions,
        moodLevel,
        sleepHours,
        systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS,
        conciseMode: true,
        customSettings: settings.apiKey ? settings : undefined
      })
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const aiResult: any = await response.json();
      if (aiResult && aiResult.probabilities && aiResult.probabilities.length > 0) {
        const localBase = buildLocalAnalysis({
          text,
          category,
          perspective,
          answers,
          questions,
          moodLevel,
          sleepHours
        });
        return {
          ...localBase,
          ...aiResult,
          referencedSciences: (aiResult.referencedSciences && Array.isArray(aiResult.referencedSciences) && aiResult.referencedSciences.length > 0)
            ? aiResult.referencedSciences
            : localBase.referencedSciences,
          signals: (aiResult.signals && Array.isArray(aiResult.signals.whatToObserve) && aiResult.signals.whatToObserve.length > 0)
            ? {
                ...aiResult.signals,
                officialResources: localBase.signals.officialResources
              }
            : localBase.signals,
          changePlan: aiResult.changePlan || localBase.changePlan,
          behavioralLoop: aiResult.behavioralLoop || localBase.behavioralLoop,
          prominentMaslowNeed: aiResult.prominentMaslowNeed || localBase.prominentMaslowNeed,
          emotionalIntelligenceSkill: aiResult.emotionalIntelligenceSkill || localBase.emotionalIntelligenceSkill
        };
      }
    }
  } catch (e) {
    console.warn('AI call failed, falling back to local engine', e);
  }

  // Pure deterministic local engine fallback (also updated to ultra-concise bullet points)
  return buildLocalAnalysis({
    text,
    category,
    perspective,
    answers,
    questions,
    moodLevel,
    sleepHours
  });
}

