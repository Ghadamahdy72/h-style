import {
  BehaviorCategory,
  Perspective,
  AnalysisResult,
  UserAnswer,
  ProbabilityBreakdown,
  BehavioralLoopChain,
  ChangePlan,
  SignalsSection,
  ScienceItem,
  QuestionItem
} from '../types';
import { CODES_DATA } from '../data/codesData';
import { SCIENCES_DATA } from '../data/sciencesData';
import { parseDialectAndIntent } from './dialectEngine';

// Keywords dictionary for auto-detection
const CATEGORY_KEYWORDS: Record<BehaviorCategory, string[]> = {
  habit: ['عادة', 'كل يوم', 'ما أقدر أنام إلا', 'أفتح الجوال', 'أطلب أكل', 'حلويات', 'شاشات', 'روتين', 'تيك توك', 'سوشل ميديا', 'تدخين', 'قهوة', 'أقعد بالساعات'],
  reaction: ['أعصب', 'أرفع صوتي', 'انفعل', 'ردة فعل', 'أبكي', 'أغضب', 'أصرخ', 'خفقان', 'ضيقة مفاجئة', 'اتوتر', 'أتنرفز', 'أفقد أعصابي', 'انفجار'],
  behavior: ['ما أقدر أقول لا', 'أوافق', 'أشيل شغل', 'أؤجل', 'أسوف', 'أتحمل', 'أهرب', 'أكتم', 'أجامل', 'أعتذر بدون سبب', 'أتراجع', 'أستحي', 'يهايط', 'هياط', 'مهايط', 'فشخرة', 'استعراض', 'تباهي', 'مباهاة', 'أمشي لحالي', 'أمشي وحدي', 'عزلة'],
  mood: ['مزاج', 'مكتئب', 'طفشان', 'هبوط', 'فتور', 'خمول', 'فقدان شغف', 'ملل', 'ثقل', 'حزين', 'ضيق بدون سبب', 'كدر'],
  thought: ['أفترض', 'أتوقع', 'أشك', 'دايم أفكر', 'يتكلمون عني', 'قراءة أفكار', 'فكرة تتكرر', 'وسواس', 'خايف يفشل', 'ألوم نفسي', 'سيناريوهات'],
  relationship: ['شريكي', 'زوجي', 'زوجتي', 'صديقي', 'مديري', 'الزملاء', 'أمي', 'أبوي', 'أهلي', 'يسكت', 'يتجاهل', 'صمت عقابي', 'علاقة', 'خلاف عائلي']
};

const OTHER_PERSPECTIVE_KEYWORDS = [
  'شريكي', 'زوجي', 'زوجتي', 'مديري', 'زميلي', 'صديقي', 'أمي', 'أبوي', 'أخوي',
  'أختي', 'عيالي', 'هم', 'هو', 'هي', 'الناس', 'يتجاهلني', 'ينتقدني', 'يضغط علي',
  'يسكت', 'عصبي', 'يتحكم', 'يستفزني', 'صمته', 'كلامه', 'تصرفاته', 'الشخص',
  'ليش الشخص', 'فلان', 'الطرف الآخر', 'ليش الناس', 'يهايط', 'استعراضه', 'تصرفه'
];

export function detectSeverity(text: string): 'منخفضة' | 'متوسطة' | 'مرتفعة' {
  const clean = text.toLowerCase();
  const highKeywords = ['حيل', 'جداً', 'أموت', 'انهيار', 'انفجار', 'بجنون', 'أكره', 'أعصب', 'أبكي', 'أصرخ', 'ما أتحمل', 'عذاب', 'كارثة', 'مستحيل', 'تعبت'];
  let count = 0;
  for (const kw of highKeywords) {
    if (clean.includes(kw)) count++;
  }
  if (clean.includes('!') || clean.includes('؟!') || count >= 2) return 'مرتفعة';
  if (count === 1 || text.length > 50) return 'متوسطة';
  return 'منخفضة';
}

export function detectTextAttributes(text: string): {
  category: BehaviorCategory;
  perspective: Perspective;
  severity: 'منخفضة' | 'متوسطة' | 'مرتفعة';
  detectedCodes: string[];
  detectedSciences: string[];
} {
  const dialectResult = parseDialectAndIntent(text);
  const clean = text.toLowerCase();

  // Match additional codes & sciences
  const matchedCodeIds = new Set<string>(dialectResult.detectedCodes);
  const matchedScienceIds = new Set<string>(dialectResult.detectedSciences);

  if (clean.includes('نوم') || clean.includes('مواصل') || clean.includes('تعبان')) {
    matchedCodeIds.add('code-somatic-biology');
    matchedScienceIds.add('sleep-circadian');
  }
  if (clean.includes('أكل') || clean.includes('جوال') || clean.includes('شاشات') || clean.includes('روتين')) {
    matchedCodeIds.add('code-habits-triggers');
    matchedCodeIds.add('code-reward-reinforcement');
    matchedScienceIds.add('habit-loops');
    matchedScienceIds.add('fogg');
  }
  if (clean.includes('أعصب') || clean.includes('غضب') || clean.includes('نرفزة')) {
    matchedCodeIds.add('code-emotions-affect');
    matchedScienceIds.add('emotion-regulation');
    matchedScienceIds.add('dbt');
  }

  return {
    category: dialectResult.category,
    perspective: dialectResult.perspective,
    severity: dialectResult.severity,
    detectedCodes: Array.from(matchedCodeIds).slice(0, 3),
    detectedSciences: Array.from(matchedScienceIds).slice(0, 3)
  };
}

export function buildLocalAnalysis({
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
}): AnalysisResult {
  // Collect user free notes
  const userFreeNotes = Object.values(answers)
    .map(a => a.freeText?.trim())
    .filter((note): note is string => !!note && note.length > 2);

  // Collect weight tags from answers
  const scienceScores: Record<string, number> = {
    cbt: 2,
    eq: 2,
    maslow: 2,
    'habit-loops': 1,
    'emotion-regulation': 2,
    attachment: 1,
    'sleep-circadian': 1,
    'stress-allostasis': 1,
    'choice-theory': 1,
    nvc: 1,
    'schema-therapy': 1
  };

  const codeScores: Record<string, number> = {
    'code-psych-needs': 3,
    'code-emotions-affect': 3,
    'code-threats-fears': 2,
    'code-thoughts-appraisals': 2,
    'code-habits-triggers': 2,
    'code-reward-reinforcement': 2,
    'code-emotion-regulation': 2,
    'code-attachment-styles': 1,
    'code-somatic-biology': 1
  };

  // Process answers
  questions.forEach(q => {
    const ans = answers[q.id];
    if (ans?.optionId) {
      const opt = q.options.find(o => o.id === ans.optionId);
      if (opt?.weightTags) {
        Object.entries(opt.weightTags).forEach(([key, val]) => {
          if (scienceScores[key] !== undefined) {
            scienceScores[key] += val;
          } else if (codeScores[key] !== undefined) {
            codeScores[key] += val;
          } else {
            scienceScores[key] = (scienceScores[key] || 0) + val;
          }
        });
      }
    }
  });

  // Factor in sleep & mood
  if (sleepHours !== undefined && sleepHours < 6) {
    scienceScores['sleep-circadian'] = (scienceScores['sleep-circadian'] || 0) + 4;
    scienceScores['stress-allostasis'] = (scienceScores['stress-allostasis'] || 0) + 3;
    codeScores['code-somatic-biology'] = (codeScores['code-somatic-biology'] || 0) + 5;
  }
  if (moodLevel !== undefined && moodLevel <= 2) {
    codeScores['code-emotions-affect'] = (codeScores['code-emotions-affect'] || 0) + 3;
    scienceScores['emotion-regulation'] = (scienceScores['emotion-regulation'] || 0) + 3;
  }

  // Factor in free notes depth
  const freeNotesCharCount = userFreeNotes.join(' ').length;
  const baseConfidence = Math.min(
    94,
    Math.max(
      74,
      72 +
        Object.keys(answers).length * 3 +
        Math.min(10, Math.floor(freeNotesCharCount / 15)) +
        (text.length > 50 ? 5 : 2)
    )
  );

  // Generate dynamic probabilities
  const primaryCauses: { title: string; desc: string; codeId: string; weight: number; color: string }[] = [];

  if (category === 'habit' || text.includes('أكل') || text.includes('جوال') || text.includes('شاشات')) {
    primaryCauses.push({
      title: 'تسكين المشاعر وتفريغ الضغط عبر الدوبامين السريع',
      desc: 'الدماغ يلجأ إلى السلوك كوسيلة تهدئة فورية لتجاوز الشعور بالإجهاد أو الملل أو الفراغ العاطفي.',
      codeId: 'code-reward-reinforcement',
      weight: 42,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500'
    });
    primaryCauses.push({
      title: 'إشارة بيئية تلقائية راسخة (المكان والوقت)',
      desc: 'المسار العصبي يربط توقيتاً أو جلسة معينة بالإقدام التلقائي على الفعل دون تفكير مسبق.',
      codeId: 'code-habits-triggers',
      weight: 33,
      color: 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
    });
    primaryCauses.push({
      title: 'استنزاف الطاقة ومقاومة إنهاء اليوم (تسويف النوم)',
      desc: 'الرغبة في اقتناص ساعات حرة شخصية تعويضاً عن ضغوط العمل والمسؤوليات النهارية.',
      codeId: 'code-somatic-biology',
      weight: 25,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500'
    });
  } else if (category === 'reaction' || text.includes('أعصب') || text.includes('غضب') || text.includes('صوت')) {
    const sleepWeight = (sleepHours !== undefined && sleepHours < 6) ? 38 : 28;
    primaryCauses.push({
      title: 'استنزاف الطاقة والإنهاك العصبي (تأخر الكابح الدماغي)',
      desc: 'انخفاض الطاقة وقلة النوم يضعفان قشرة الدماغ الجبهية المسؤولة عن كبح الغضب والتروي.',
      codeId: 'code-somatic-biology',
      weight: sleepWeight,
      color: 'bg-gradient-to-r from-rose-500 to-red-500'
    });
    primaryCauses.push({
      title: 'تفسير الحدث كتهديد للمكانة أو انتهاك للاحترام',
      desc: 'العقل يطلق فكرة تلقائية سريعة تعتبر تصرف الطرف الآخر استهانة متعمدة تستدعي الهجوم الدفاعي.',
      codeId: 'code-threats-fears',
      weight: 37,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    });
    primaryCauses.push({
      title: 'فجوة في مهارات التعبير الهادئ وتسمية المشاعر',
      desc: 'تراكم الاحتقان الصامت لفترة قبل الانفجار المفاجئ على مواقف صغيرة لا تحتمل هذه الشدة.',
      codeId: 'code-emotion-regulation',
      weight: 100 - sleepWeight - 37,
      color: 'bg-gradient-to-r from-indigo-500 to-blue-500'
    });
  } else if (category === 'behavior' || text.includes('أقول لا') || text.includes('أوافق') || text.includes('أجامل')) {
    primaryCauses.push({
      title: 'الخوف من الرفض والحاجة الملحة للقبول والانتماء',
      desc: 'ربط قيمة الذات برضا المحيطين، وتجنب مشاعر الذنب القاسية المصاحبة لقول «لا».',
      codeId: 'code-psych-needs',
      weight: 46,
      color: 'bg-gradient-to-r from-purple-500 to-violet-500'
    });
    primaryCauses.push({
      title: 'نمط تجنب النزاع والحرج الاجتماعي',
      desc: 'اعتبار أي توتر أو اعتراض كارثة يجب تلافيها، حتى لو كان الثمن استنزاف الوقت والجهد الشخصي.',
      codeId: 'code-attachment-styles',
      weight: 32,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-500'
    });
    primaryCauses.push({
      title: 'مخطط التضحية المفرطة والشعور بالمسؤولية عن مشاعر الجميع',
      desc: 'افتراض غير واقعي بأنك ملزم بإسعاد وحل مشاكل كل من حولك لكي تكون شخصاً صالحاً.',
      codeId: 'code-beliefs-assumptions',
      weight: 22,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    });
  } else if (category === 'relationship') {
    primaryCauses.push({
      title: 'صدام في أنماط التعلّق (التجنبي ضد القلق)',
      desc: 'أحد الطرفين ينسحب بالصمت دفاعاً عن استقلاليته، بينما الآخر يلح في المطالبة دفاعاً عن أمان العلاقة.',
      codeId: 'code-attachment-styles',
      weight: 44,
      color: 'bg-gradient-to-r from-purple-500 to-rose-500'
    });
    primaryCauses.push({
      title: 'دفاعية مسبقة وإسقاط مخاوف قديمة',
      desc: 'سماع كلام الشريك عبر عدسة الشك والحرج المتراكم من خلافات غير محلولة سابقاً.',
      codeId: 'code-past-experiences',
      weight: 34,
      color: 'bg-gradient-to-r from-amber-500 to-pink-500'
    });
    primaryCauses.push({
      title: 'عجز في التواصل اللاعنفي وصياغة الطلبات',
      desc: 'استخدام أسلوب اللوم والنقد («أنت دائماً...») بدلاً من التعبير عن المشاعر والحاجة الحقيقية.',
      codeId: 'code-emotions-affect',
      weight: 22,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    });
  } else {
    // Thoughts / Mood general
    primaryCauses.push({
      title: 'تحيزات معرفية وتفسيرات تلقائية مشوهة',
      desc: 'قراءة أفكار الآخرين وافتراض نواياهم السلبية دون تحقق واقعي مباشر.',
      codeId: 'code-thoughts-appraisals',
      weight: 45,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500'
    });
    primaryCauses.push({
      title: 'حاجة غير مشبعة للأمان النفسي والتقدير',
      desc: 'الحساسية العالية تجاه أي إشارة تهميش ناجمة عن تعطش داخلي للاعتراف والاستقرار.',
      codeId: 'code-psych-needs',
      weight: 35,
      color: 'bg-gradient-to-r from-violet-500 to-pink-500'
    });
    primaryCauses.push({
      title: 'استنزاف عصبي وتراكم أعباء غير معالجة',
      desc: 'الإجهاد المزمن يجعل العقل مهيأً لتوليد السيناريوهات التشاؤمية لحماية الفرد من الصدمات.',
      codeId: 'code-somatic-biology',
      weight: 20,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500'
    });
  }

  const probabilities: ProbabilityBreakdown[] = primaryCauses.map(c => ({
    titleAr: c.title,
    percentage: c.weight,
    explanationAr: c.desc,
    codeId: c.codeId,
    color: c.color
  }));

  // Maslow prominent need
  let prominentMaslowNeed = {
    level: 'الحاجة إلى الأمان والاستقرار',
    nameAr: 'الأمان (Psychological Safety)',
    explanationAr: 'رغبة لاواعية لدرء التهديد والنقد والخوف من الفشل.'
  };
  if (category === 'behavior' || text.includes('يرضون') || text.includes('أقول لا')) {
    prominentMaslowNeed = {
      level: 'الحاجة إلى الانتماء والقبول',
      nameAr: 'الانتماء والقبول (Belonging & Love)',
      explanationAr: 'الخوف من فقدان المودة أو النبذ المجتمعي.'
    };
  } else if (category === 'habit' && (text.includes('نوم') || text.includes('أكل'))) {
    prominentMaslowNeed = {
      level: 'الحاجات الفسيولوجية والراحة',
      nameAr: 'الراحة الفسيولوجية (Homeostasis)',
      explanationAr: 'طلب الجسد لتسكين الإجهاد العصبي بدوبامين سريع.'
    };
  }

  // Emotional intelligence skill
  let eqSkill = {
    skillNameAr: 'الوعي بالذات وتسمية المشاعر (Emotional Granularity)',
    descriptionAr: 'ملاحظة تصاعد التوتر وتسمية الشعور بدقة قبل تحوله لسلوك تلقائي.',
    actionTipAr: 'وقفة 10 ثوانٍ مع نفس عميق قبل أي رد أو تصرف.'
  };
  if (category === 'behavior') {
    eqSkill = {
      skillNameAr: 'التوكيدية وحماية الحدود بلطف (Assertiveness)',
      descriptionAr: 'التعبير عن الرفض والرأي المستقل بثقة دون عدوانية أو ذنب.',
      actionTipAr: 'صيغة التأجيل الذكي: «سأراجع جدول مواعيدي وأخبرك لاحقاً».'
    };
  } else if (category === 'reaction') {
    eqSkill = {
      skillNameAr: 'تنظيم الانفعال والتوقف الفسيولوجي (Self-Soothing)',
      descriptionAr: 'تبريد استجابة الكر والفر وخفض النبض قبل الدخول في أي نقاش.',
      actionTipAr: 'غسل الوجه بالماء البارد وتغيير المكان فور استشعار تسارع النبض.'
    };
  }

  const isOther = perspective === 'other';

  // Behavioral loop
  const behavioralLoop: BehavioralLoopChain = isOther ? {
    trigger: text.length > 20 ? text.slice(0, 50) + '...' : 'المواقف الضاغطة وسياقات الخلاف معه',
    interpretation: probabilities[0]?.explanationAr || 'تفسيره للموقف كتهديد لمكانته أو استقلاليته',
    emotion: 'قلق وتوتر داخلي ورغبة بالسيطرة أو الهروب',
    action: 'صدور التصرف منه (انسحاب، استعراض، فرض رأي، أو عصبية)',
    immediatePayoff: 'أمان لحظي وتفادي الحرج أو انتزاع اهتمام وتفوق سريع',
    delayedCost: 'تدهور الثقة في العلاقة وتراكم الجفاء والنفور'
  } : {
    trigger: text.length > 20 ? text.slice(0, 50) + '...' : 'المواقف المشابهة وأوقات الضغط والتعب',
    interpretation: probabilities[0]?.explanationAr || 'تفسير الموقف كعبء ثقيل يتطلب تدخلاً سريعاً',
    emotion: 'توتر، حرج، خوف من الرفض، أو رغبة بإنهاء الضغط',
    action: category === 'habit' ? 'اللجوء للسلوك البديل (الأكل، الشاشات، التسويف)' : 'ردة فعل سريعة أو موافقة على مضض أو انسحاب دفاعي',
    immediatePayoff: 'ارتياح مؤقت، تفادي المواجهة، وجرعة دوبامين سريعة',
    delayedCost: 'ندم وتراكم المهام واستنزاف الطاقة النفسية'
  };

  // Dynamic Behavioral & Relational Change Plan with clinical depth and zero fluff
  const changePlan: ChangePlan = generateDynamicChangePlan(text, category, perspective, probabilities);

  // Dynamic Signals & Safety Alerts based on case, perspective, and category
  const signals: SignalsSection = generateDynamicSignals(text, category, perspective, probabilities);

  // Confirmed codes
  const confirmedCodes = probabilities.map(p => {
    const code = CODES_DATA.find(c => c.id === p.codeId) || CODES_DATA[0];
    return {
      codeId: code.id,
      codeNameAr: code.nameAr,
      relevanceAr: p.explanationAr
    };
  });

  // Referenced sciences
  const matchedSciences = SCIENCES_DATA.filter(s => {
    return (
      (scienceScores[s.id] && scienceScores[s.id] > 2) ||
      s.id === 'cbt' ||
      s.id === 'eq' ||
      s.id === 'maslow' ||
      (category === 'habit' && s.id === 'habit-loops') ||
      (category === 'reaction' && s.id === 'emotion-regulation') ||
      (category === 'relationship' && s.id === 'attachment') ||
      (sleepHours !== undefined && sleepHours < 6 && s.id === 'sleep-circadian')
    );
  }).slice(0, 6);

  // Textual reading summary: ultra-concise focused bullet points
  const textualReading = isOther
    ? `• النمط والسلوك: نمط تكيفي وآلية دفاعية غير عشوائية ناجمة عن «${probabilities[0]?.titleAr}».
• الدافع النفسي العميق: المثير يحفز في عقله حاجة ملحة غير مشبعة إلى «${prominentMaslowNeed.nameAr}».
• المكسب اللحظي والتكلفة: محاولة لكسب أمان فوري أو حماية مساحته على حساب عمق التواصل.
• التوجيه العملي السريع: فهم دوافعه يمنحك ثباتاً لرسم حدود صحية هادئة دون الانجرار لانفعالاته.`
    : `• النمط والسلوك: استجابة دفاعية ونمط وقائي متكرر نابع من «${probabilities[0]?.titleAr}».
• الدافع النفسي العميق: محرك لا واعي يسعى لإشباع حاجة «${prominentMaslowNeed.nameAr}».
• المكسب اللحظي والتكلفة: رغبة سريعة في تسكين الضغط المؤقت على حساب التكلفة المؤجلة.
• التوجيه العملي السريع: تسمية هذه الحلقة ورؤية محركاتها بوعي هو خطوتك الأولى لكسرها.`;

  // Alternative reading if secondary is > 25%
  let alternativeReading: string | undefined;
  if (probabilities[1] && probabilities[1].percentage >= 25) {
    alternativeReading = `قراءة بديلة محتملة: من الوارد جداً أيضاً أن يكون المحرك الجوهري الثانوي هو «${probabilities[1].titleAr}»، خاصة إذا تزامن ذلك مع فترات الإرهاق الذهني أو تراكم الخلافات غير المحسومة. يُنصح بمراقبة هذين المسارين بالتوازي.`;
  }

  // Question snapshot for report
  const questionsSnapshot = questions.map(q => {
    const ans = answers[q.id];
    return {
      questionAr: q.questionAr,
      chosenAnswerAr: ans?.optionText || (ans?.optionId ? 'إجابة محددة' : 'لم يتم اختيار خيار محدد'),
      userNote: ans?.freeText?.trim() || undefined
    };
  });

  return {
    id: 'decode-' + Date.now(),
    createdAt: new Date().toISOString(),
    inputText: text,
    category,
    perspective,
    confidenceScore: baseConfidence,
    textualReading,
    probabilities,
    confirmedCodes,
    prominentMaslowNeed,
    emotionalIntelligenceSkill: eqSkill,
    alternativeReading,
    userDetailsIntegrated: userFreeNotes,
    referencedSciences: matchedSciences,
    behavioralLoop,
    changePlan,
    signals,
    questionsSnapshot
  };
}

// -------------------------------------------------------------
// Dynamic Signals & Safety Alerts Engine
// Generates contextual, case-tailored observation signals and action steps
// -------------------------------------------------------------
export function generateDynamicSignals(
  text: string,
  category: BehaviorCategory,
  perspective: Perspective,
  probabilities: ProbabilityBreakdown[]
): SignalsSection {
  const isOther = perspective === 'other';
  const clean = text.toLowerCase();
  const primaryCode = probabilities[0]?.codeId || '';

  let whatToObserve: string[] = [];
  let practicalActions: string[] = [];
  let professionalAlerts: string[] = [];

  if (isOther) {
    // 👥 Other perspective (عن شخص آخر)
    if (clean.includes('سحب') || clean.includes('تجاهل') || clean.includes('يطنش') || clean.includes('صامت') || clean.includes('جوال') || primaryCode.includes('attachment')) {
      whatToObserve = [
        'أوقات انسحابه: هل يهرب لجواله أو يصمت فور بدء نقاش جاد أو مواجهة بمسؤولية؟',
        'لغة جسده الدفاعية: تجنب التواصل البصري، إغلاق الباب، أو التظاهر بالانشغال المفاجئ.',
        'مؤشر التقارب: هل يعود للمبادرة فقط عندما تبتعد أنت وتتوقف تماماً عن ملاحقته؟'
      ];
      practicalActions = [
        'التوقف الفوري عن الملاحقة والعتاب: امنحه مساحة هادئة ليدرك قيمة التواصل دون ضغط.',
        'تحديد وقت محايد ومحدد: «أحتاج 10 دقائق هادئة لنقاش هذا الأمر الليلة» دون مقاطعات.',
        'حماية استقرارك العاطفي: واصل يومك واهتماماتك دون ربط حالتك النفسية برد فعله.'
      ];
      professionalAlerts = [
        'إذا تحول الصمت إلى سلاح إذلال وعقاب نفسي متعمد (Stonewalling) يستمر لأيام.',
        'إذا ترافق الانسحاب مع إنكار تام لأي مسؤولية مشتركة أو إهمال للواجبات الأسرية.',
        'إذا بدأت تشعر بفقدان الأمان أو التشكيك المستمر في قيمتك وكرامتك.'
      ];
    } else if (clean.includes('مهايط') || clean.includes('استعراض') || clean.includes('تباهي') || clean.includes('فوقية') || clean.includes('مظاهر') || primaryCode.includes('psych-needs')) {
      whatToObserve = [
        'المثير المحفز للمباهاة: هل يتصاعد استعراضه أمام أشخاص معينين أو عند شعوره بالتهديد؟',
        'نبرة الكلام التنافسية: مقاطعة الآخرين وسرقة الأضواء وتحويل كل حديث لإنجازاته الشخصية.',
        'الهشاشة خلف القناع: كيف ينفعل أو يتوتر إذا تم تجاهل حديثه أو التشكيك في كلامه.'
      ];
      practicalActions = [
        'عدم تغذية حلقة الإيجو: لا تدخل معه في منافسة كلامية، واكتفِ بردود هادئة ومحايدة.',
        'توجيه الحديث للحقائق المجردة بلطف دون كسر هيبته أمام الناس.',
        'فصل قيمتك الذاتية عن مباهاة الآخرين وعدم الانجرار لمجاراة المظاهر المكلفة.'
      ];
      professionalAlerts = [
        'إذا تطور الاستعراض إلى تحقير صريح لك أو التقليل من شأنك أمام الآخرين.',
        'إذا ورط الطرف الآخر الأسرة أو العمل في ديون والتزامات مالية مرهقة لأجل المظاهر.',
        'ظهور نزعات استغلالية نرجسية تمنع أي تواصل إنساني متكافئ.'
      ];
    } else if (clean.includes('عصب') || clean.includes('غضب') || clean.includes('صراخ') || clean.includes('نرفزة') || category === 'reaction') {
      whatToObserve = [
        'مؤشرات الغليان المبكرة: احمرار الوجه، نبرة الصوت الحادة، وتصلب حركة اليدين.',
        'الشرارات المتكررة: هل ينفجر عند التعب، أم عند الشعور بقلة التقدير، أم عند التأخير؟',
        'نمط تفريغ الانفعال: هل يصرخ، أم يكسر أشياء، أم يلقي باللوم المطلق عليك؟'
      ];
      practicalActions = [
        'خفض نبرة الصوت واستخدام عبارة الحسم الهادئ: «سنتحدث عندما نهدأ سوياً».',
        'الانسحاب الجسدي المؤقت من المكان وتجنب أي رد دفاعي أثناء فورة غضبه.',
        'مناقشة سبب الانفجار في اليوم التالي بهدوء عندما تستقر وظائف الدماغ التحليلي.'
      ];
      professionalAlerts = [
        'إذا تضمن الانفعال أي تهديد للأمان الجسدي أو تكسيراً للمقتنيات أو سباباً مهيناً.',
        'إذا تكررت نوبات الغضب بشكل شبه يومي دون أي ندم أو مراجعة ذاتية لاحقة.',
        'إذا أصبحت تعيش في حالة رعب مستمر وتحسب لكل خطوة وكلمة خوفاً من انفجاره.'
      ];
    } else if (category === 'relationship') {
      whatToObserve = [
        'ديناميكية التقارب والتباعد: هل يتقرب عند رغبته ويبتعد عند احتياجك أنت لدعمه؟',
        'لغة الحوار عند الخلاف: هل يمارس الإنكار والتشكيك (Gaslighting) أم يعترف بدوره؟',
        'احترامه للحدود الشخصية: هل يتقبل كلمة «لا» أم يعتبرها تمرداً وعداءً؟'
      ];
      practicalActions = [
        'وضع حدود واضحة وغير قابلة للتفاوض: «لن أقبل الحديث بنبرة تهكمية أو تجريح».',
        'توثيق المواقف بوضوح والاعتماد على الأفعال الملموسة وليس على الوعود الشفهية.',
        'بناء شبكة دعم واستقلالية عاطفية تحميك من الاعتماد الكلي على رضاه.'
      ];
      professionalAlerts = [
        'محاولات عزلك التام عن عائلتك وأصدقائك للتحكم بك وبخياراتك الحياتية.',
        'التلاعب النفسي المتكرر الذي يجعلك تشك في ذاكرتك وقواك العقلية.',
        'استمرار الإهانة أو الإيذاء العاطفي المستنزف لصحتك النفسية.'
      ];
    } else {
      // General other
      whatToObserve = [
        'سياق تكرار السلوك: هل يحدث عند تعرضه للضغط والمسؤوليات، أم في مواقف اجتماعية محددة؟',
        'المكسب المباشر الذي يجنيه: هل يهدف لتفادي الإحراج، أم كسب الاهتمام، أم إشعارك بالذنب؟',
        'تغير استجابته عند تغيير رد فعلك أنت وتوقفك عن الاستجابة التلقائية المعتادة.'
      ];
      practicalActions = [
        'تعديل ردة فعلك المعتادة: إذا كنت تبرر فتوقف، وإذا كنت تلاحقه فامنحه مساحة.',
        'التواصل بلغة الاحتياج الهادئ بدلاً من توجيه أصابع الاتهام المباشرة.',
        'حماية طاقتك النفسية والتركيز على ما يقع في دائرة تحكمك فقط.'
      ];
      professionalAlerts = [
        'إذا استمر السلوك في إلحاق أذى نفسي أو معنوي مباشر بك دون أي إمكانية للحوار.',
        'انعدام التعاطف والمرونة التامة ورفض أي وسيلة للتفاهم الأسري أو الاجتماعي.',
        'تدهور صحتك النفسية وشعورك الدائم بالاستنزاف والعجز.'
      ];
    }
  } else {
    // 👤 Self perspective (عن النفس)
    if (clean.includes('تسويف') || clean.includes('أؤجل') || clean.includes('مماطلة') || clean.includes('جوال') || category === 'habit') {
      whatToObserve = [
        'إشارات الجوع الدوباميني: التململ، فتح التطبيقات بلا وعي، والهروب من أول 5 دقائق عمل.',
        'الحديث الداخلي المبرر: «سأبدأ بعد قليل» أو «المزاج غير مناسب الآن».',
        'المحفزات البيئية: وجود الهاتف أمام عينيك أو عدم وضوح الخطوة الأولى في المهمة.'
      ];
      practicalActions = [
        'تطبيق قاعدة الـ 5 دقائق: ابدأ في المهمة لمدة 5 دقائق فقط مع حقك في التوقف.',
        'إعادة هندسة البيئة: ضع الهاتف في غرفة أخرى أثناء جلسات العمل أو قبل النوم.',
        'تقسيم الهدف الضخم إلى مهمة ذرية واضحة (كتابة سطر واحد، فتح المستند).'
      ];
      professionalAlerts = [
        'إذا شلّ التسويف حياتك المهنية أو الأكاديمية وأدى لخسائر جوهرية متكررة.',
        'إذا تلازم الهروب مع جلد ذات حاد واكتئاب وشعور كامل بفقدان السيطرة.',
        'العجز عن ممارسة أبسط متطلبات اليوم الأساسية لأكثر من أسبوعين.'
      ];
    } else if (clean.includes('عصب') || clean.includes('غضب') || clean.includes('أصرخ') || category === 'reaction') {
      whatToObserve = [
        'جرس الإنذار الجسدي الفوري: تسارع ضربات القلب، شد الفك والكتف، وحرارة الوجه.',
        'الفكرة التلقائية المشعلة: «هو يتعمد إهانتي» أو «إذا سكتت سيستضعفني الجميع».',
        'مستوى الإرهاق العصبي ونقص النوم الذي يخفض عتبة تحملك للاستفزاز.'
      ];
      practicalActions = [
        'مهلة الـ 90 ثانية: صمت تام وأخذ 3 أنفاس بطيئة عميقة (زفير أطول من الشهيق).',
        'تغيير الوضعية الجسدية فوراً: الجلوس إذا كنت واقفاً، أو الخروج لغرفة أخرى.',
        'تأجيل الرد الحاسم: «أحتاج وقتاً للتفكير وسأجيبك لاحقاً».'
      ];
      professionalAlerts = [
        'إذا خرجت نوبات الغضب عن السيطرة وتحولت لعنف لفظي أو حركي متكرر.',
        'إذا أصبحت تشعر بتأنيب ضمير مدمر وانهيار في العلاقات الأسرية والمهنية.',
        'تكرار نوبات الذعر أو الخفقان الشديد المصاحب لأي موقف بسيط.'
      ];
    } else if (category === 'mood') {
      whatToObserve = [
        'توقيت هبوط المزاج وثقل الصدر: هل هو في الصباح الباكر أم مساء نهاية الأسبوع؟',
        'نمط الأفكار السوداوية: هل تقفز تلقائياً لتوقع الكوارث وتعميم الفشل؟',
        'مستوى التعرض لضوء الشمس والنشاط البدني وجودة ساعات النوم في الأيام السابقة.'
      ];
      practicalActions = [
        'بروتوكول الضوء والحركة: المشي 15 دقيقة صباحاً تحت ضوء النهار لتنظيم السيروتونين.',
        'تفريغ المشاعر بالكتابة الحرة لمدة 5 دقائق لإخراج الضغط من رأسك للورق.',
        'خفض التوقعات اليومية وإنجاز مهمة واحدة صغيرة وملموسة فقط لاستعادة الثقة.'
      ];
      professionalAlerts = [
        'استمرار هبوط المزاج وثقل الصدر يومياً لأكثر من أسبوعين متواصلين.',
        'فقدان تام للشغف بالطعام أو النوم أو مغادرة السرير.',
        'أي أفكار تتعلق بإيذاء النفس أو انعدام الرغبة في الحياة.'
      ];
    } else if (category === 'relationship') {
      whatToObserve = [
        'جرس القلق التعلّقي: هل تشعر برعب وتوتر إذا تأخر الرد لساعات قليلة؟',
        'فخ التنازل المفرط: كم مرة وافقت على ما يؤذيك خوفاً من أن تُهجر أو يُغضب منك؟',
        'المراقبة القهرية: مراقبة آخر ظهور وتتبع تفاصيل الطرف الآخر بالسوشل ميديا.'
      ];
      practicalActions = [
        'تمرين التهدئة الذاتية: ممارسة نشاط يخصك أنت فور شعورك بالقلق بدلاً من الانتظار.',
        'التعبير بلغة «أنا»: «أنا أحتاج لتواصل منتظم ليشعرني بالأمان» دون هجوم أو اتهام.',
        'تذكير النفس المستمر بأن قيمتك واستحقاقك لا يتحددان بمدى رضا أي شخص آخر.'
      ];
      professionalAlerts = [
        'البقاء في علاقة تستنزف سلامتك الجسدية أو النفسية مع عجز تام عن الخروج.',
        'فقدان الهوية الشخصية بالكامل والشعور بأنك لا شيء خارج إطار العلاقة.',
        'نوبات هلع واكتئاب حاد مرتبطة بتقلبات تصرفات الشريك.'
      ];
    } else {
      // General self
      whatToObserve = [
        'الأوقات التي يتكرر فيها السلوك: هل هي عند استنزاف الطاقة والضغط في نهاية اليوم؟',
        'التغيرات الجسدية المسبقة: شد عضلات الجسم، ضيق التنفس، وتسارع الأفكار.',
        'الحديث الداخلي السلبي: رصد الكلمات القطعية مثل «دائماً»، «مستحيل»، «أنا فاشل».'
      ];
      practicalActions = [
        'تسمية الشعور بدقة: «أنا الآن أشعر بالضغط، وهذا شعور مؤقت وطبيعي وسيزول».',
        'تقسيم الموقف الصعب إلى خطوات دقيقة مدتها دقائق معدودة.',
        'أخذ وقفة وعي مدتها 60 ثانية قبل أي رد أو تصرف تلقائي.'
      ];
      professionalAlerts = [
        'إذا استمر الشعور بالعجز والضيق الحاد يومياً لأكثر من أسبوعين.',
        'إذا تعطلت قدرتك على أداء عملك أو رعايتك لأسرتك بشكل جوهري.',
        'تكرار نوبات القلق الحاد أو اضطراب النوم والشهية المستمر.'
      ];
    }
  }

  return {
    whatToObserve,
    practicalActions,
    professionalAlerts,
    officialResources: [
      {
        name: 'خط المساعدة الوطني للصحة النفسية - قطر',
        org: 'وزارة الصحة العامة (MoPH) ومؤسسة حمد الطبية',
        url: 'https://www.moph.gov.qa',
        phoneOrNote: 'الاتصال المجاني على الرقم 16000 (الخيار 4) لخدمة سرية ومتخصصة'
      },
      {
        name: 'خدمات الصحة النفسية المجتمعية',
        org: 'مؤسسة حمد الطبية (HMC)',
        url: 'https://www.hamad.qa',
        phoneOrNote: 'عيادات الدعم النفسي والاستشارات التخصصية السلوكية'
      },
      {
        name: 'دليل الصحة النفسية والدعم السلوكي',
        org: 'منظمة الصحة العالمية (WHO)',
        url: 'https://www.who.int/ar/health-topics/mental-health',
        phoneOrNote: 'المعايير الدولية للتثقيف النفسي وإدارة الضغوط الحياتية'
      },
      {
        name: 'مركز الموارد السلوكية والمعرفية',
        org: 'جمعية علم النفس الأمريكية (APA)',
        url: 'https://www.apa.org/topics',
        phoneOrNote: 'أحدث الأدلة العلمية في تعديل العادات والعلاج المعرفي السلوكي'
      }
    ]
  };
}

// -------------------------------------------------------------
// Dynamic Behavioral & Relational Change Plan Engine
// Generates clinical-grade, actionable steps without text bloat
// -------------------------------------------------------------
export function generateDynamicChangePlan(
  text: string,
  category: BehaviorCategory,
  perspective: Perspective,
  probabilities: ProbabilityBreakdown[]
): ChangePlan {
  const isOther = perspective === 'other';
  const clean = text.toLowerCase();
  const primaryCode = probabilities[0]?.codeId || '';

  if (isOther) {
    // 👥 Other perspective: Strategic Dealing & Boundaries Protocol
    if (clean.includes('سحب') || clean.includes('تجاهل') || clean.includes('صامت') || clean.includes('يطنش') || clean.includes('جوال') || primaryCode.includes('attachment')) {
      return {
        step24Hours: 'الانفصال التكتيكي (Tactical Detachment): التوقف الفوري عن الملاحقة أو العتاب وقطع دائرة المطاردة العاطفية.',
        todayPlan: 'الامتناع عن قاعدة JADE: لا تبرر، لا تجادل، لا تدافع، لا تشرح؛ تعامل بحياد تام ولا تظهر أي انزعاج من صمته.',
        weeklyPlan: 'رسالة الحسم الهادئ بنمط NVC: «مستعد للنقاش عندما تكون جاهزاً، ولن أقبل التجاهل كأسلوب لحل الخلاف» دون نقاش إضافي.',
        monthlyPlan: 'إعادة توازن القوى النفسية: بناء اهتمامات وروابط اجتماعية مستقلة تجعل حضورك الداخلي غير معتمد على استجابته المزاجية.',
        ifThenRule: `إذا انسحب الطرف الآخر أو تجاهلني بالجوال، فإنني سألتزم بالصمت التام وأنصرف لاهتماماتي دون ملاحقة أو عتاب.`,
        progressIndicators: [
          'توقف نوبات القلق والترقب المصاحبة لتأخر رده أو انسحابه',
          'إجباره لاواعياً على مراجعة سلوكه عندما توقفت أنت عن دور المطارد',
          'استعادة السيطرة الكاملة على طاقتك اليومية وهدوئك الداخلي'
        ],
        relapseProtocol: 'إذا ضعفت ولاحقته بعتاب، لا تلمه ثانية؛ انسحب فوراً بهدوء ودع الأمور تأخذ مجراها دون استجداء لاهتمامه.'
      };
    }

    if (clean.includes('مهايط') || clean.includes('استعراض') || clean.includes('تباهي') || clean.includes('فوقية') || clean.includes('مظاهر') || primaryCode.includes('psych-needs')) {
      return {
        step24Hours: 'أسلوب الصخرة الرمادية (Gray Rock): الرد بكلمات محايدة وموجزة («جميل»، «بالتوفيق») لتجفيف وقود الإيجو لديه.',
        todayPlan: 'رفض الدخول في فخ المقارنة: لا تبرز إنجازاتك أمامه، ودع حديثه ينتهي دون تصفيق ودون صدام هجومي.',
        weeklyPlan: 'تثبيت حدود الاستنزاف: رفض أي التزامات مظهرية أو تكاليف استعراضية لا تناسب ميزانيتك بوضوح حاسم وهادئ.',
        monthlyPlan: 'تفكيك التأثير النفسي: إدراك أن استعراضه قناع لتعويض نقص دفين، مما يحول غضبك منه إلى فهم محايد لحالته.',
        ifThenRule: `إذا بدأ في التباهي أو التقليل من غيره، فإنني سأبتسم بحياد وأغير موضوع الحديث دون مجاملة أو تنافس.`,
        progressIndicators: [
          'تلاشي رغبتك في إثبات نفسك أو الدخول معه في سباق كلامي',
          'تراجع محاولاته للاستعراض أمامك لعدم حصوله على الوقود المنشود',
          'حماية استقرارك المالي وقناعتك الذاتية من عدوى المظاهر'
        ],
        relapseProtocol: 'إذا استفزك وانجررت لجدال تنافسي، أوقف الحديث فوراً بجملة: «كل شخص له طريقته»، وانسحب بوقار.'
      };
    }

    if (clean.includes('عصب') || clean.includes('غضب') || clean.includes('صراخ') || clean.includes('نرفزة') || category === 'reaction') {
      return {
        step24Hours: 'بروتوكول نزع الفتيل الفوري: الصمت التام وخفض وتيرة التنفس عند انفعاله دون مقاطعة أو دفاع.',
        todayPlan: 'التفريق بين الانفعال وقيمتك: انظر لصراخه كتفريغ لضغط أو ألم داخلي يخصه، ولا تمتصه كإهانة لقيمتك.',
        weeklyPlan: 'تقنية الأسطوانة المشروخة (Broken Record): تكرار جملة واحدة بحزم وهدوء: «أحترمك ولن أتحاور بنبرة صراخ».',
        monthlyPlan: 'فرض عواقب ملموسة: مغادرة الغرفة فوراً عند أي تجاوز لفظي، ليعلم أن الغضب وسيلة تفقد الحوار ولا تفرضه.',
        ifThenRule: `إذا رفع صوته أو بدأ بالصراخ، فإنني سأتنفس بعمق وأقول: «سنتحدث عندما نهدأ» وأغادر المكان فوراً.`,
        progressIndicators: [
          'انخفاض مدة نوبات غضبه لعدم وجود طرف ثانٍ يغذي النزاع',
          'إدراكه الصامت بأن الصراخ لم يعد وسيلة ضغط فعالة معك',
          'حماية جهازك العصبي من الرعب والتحفز الدائم'
        ],
        relapseProtocol: 'إذا صرخت في وجهه رداً على صراخه، اهدأ بعد الموقف وقل: «أخطأت برفع صوتي، وموقفي الرافض للصراخ ثابت».'
      };
    }

    // General other
    return {
      step24Hours: 'إعادة ضبط بوصلة التفاعل: التوقف عن التخمين وقراءة أفكاره، والتعامل حصراً مع الوقائع الملموسة.',
      todayPlan: 'ممارسة الحضور الذهني الحازم: لا تبادر بإصلاح أخطائه، ودعه يتحمل التبعات الطبيعية لتصرفاته دون تدخل.',
      weeklyPlan: 'إعادة صياغة الحدود الشخصية: تحديد ما هو مقبول وما هو مرفوض قطيعاً في التعامل بلغة واضحة ومقتضبة.',
      monthlyPlan: 'توزيع مصادر الدعم النفسي: عدم حصر احتياجاتك العاطفية في شخص واحد، وبناء شبكة علاقات متوازنة وصحية.',
      ifThenRule: `إذا حاول إلقاء اللوم عليّ وتصدير ذنبه، فإنني سأرد بهدوء: «أتحمل مسؤوليتي فقط ولن أحمل ما ليس لي».`,
      progressIndicators: [
        'تراجع الشعور بالذنب غير المبرر عند وضع حدودك الشخصية',
        'وضوح الرؤية والتفريق الدقيق بين مشاعرك ومشاعر الطرف الآخر',
        'انخفاض وتيرة الخلافات والاستنزاف المتبادل بنسبة ملحوظة'
      ],
      relapseProtocol: 'إذا تنازلت عن حدودك لتهدئة الموقف، أعد فتح الموضوع في وقت لاحق لتأكيد الحد الصحي بوضوح وحزم.'
    };
  }

  // 👤 Self perspective: Evidence-Based Behavioral Reprogramming Plan
  if (clean.includes('تسويف') || clean.includes('أؤجل') || clean.includes('مماطلة') || clean.includes('جوال') || category === 'habit') {
    return {
      step24Hours: 'تقنية الدخول المجهري (Micro-Entry): إزالة كل العوائق والبدء في المهمة لدقيقتين فقط مع حقك الكامل في التوقف.',
      todayPlan: 'تطهير بيئة العمل (Stimulus Control): وضع الهاتف في غرفة أخرى، وحجب الإشعارات تماماً في أول ساعتين من اليوم.',
      weeklyPlan: 'قاعدة البومودورو العكسية: 25 دقيقة إنجاز عميق تليها مكافأة مادية محددة (مشي خفيف، شاي، جلسة استرخاء).',
      monthlyPlan: 'إعادة ضبط حساسية الدوبامين: تخصيص نصف يوم أسبوعياً بدون شاشات ومشتتات لاستعادة صفاء الانتباه والتركيز.',
      ifThenRule: `إذا شعرت بالرغبة في تأجيل المهمة وفتح الجوال، فإنني سأتنفس 3 مرات وأكتب السطر الأول فوراً.`,
      progressIndicators: [
        'انخفاض زمن التردد قبل بدء المهمة من ساعات إلى دقائق معدودة',
        'إنجاز 3 مهام أساسية يومياً دون ترحيل مستمر للغد',
        'تلاشي ثقل تأنيب الضمير والتوتر المصاحب للتسويف'
      ],
      relapseProtocol: 'إذا سقطت في فخ التسويف لساعات، لا تجلد ذاتك؛ قم فوراً واشرب ماءً وابدأ مهمة جديدة مدتها 5 دقائق كإعادة تشغيل.'
    };
  }

  if (clean.includes('عصب') || clean.includes('غضب') || clean.includes('أصرخ') || category === 'reaction') {
    return {
      step24Hours: 'نافذة التهدئة الكيميائية (90-Second Rule): الامتناع التام عن الرد أو اتخاذ أي قرار في أول 90 ثانية من الاستثارة.',
      todayPlan: 'التبريد الفسيولوجي (TIPP): غسل الوجه بماء مثلج وإجراء زفير بطيء ممتد (تنفس الصندوق Box Breathing).',
      weeklyPlan: 'إعادة الهيكلة المعرفية: استبدال فكرة «هو يتعمد إهانتي» فوراً بـ «هذا الشخص يعكس ضغطه ونقصه الخاص».',
      monthlyPlan: 'تفريغ الشحنات التراكمية: ممارسة نشاط حركي مكثف 3 مرات أسبوعياً لتصريف هرمونات الأدرينالين والكورتيزول العالقة.',
      ifThenRule: `إذا أحسست بحرارة الغضب تتدفق في جسدي، فإنني سأضغط بقبضتي ثم أرخيها وأصمت حتى يهدأ نبضي.`,
      progressIndicators: [
        'القدرة على ملاحظة الشرارة الأولى قبل أن تتحول لانفجار لفظي',
        'تراجع نوبات الندم والاعتذارات اللاحقة بنسبة 70%',
        'شعور عميق بالسيطرة والوقار الداخلي عند الأزمات'
      ],
      relapseProtocol: 'إذا انفعلت ورفعت صوتك، انسحب فوراً واعتذر بإيجاز عن أسلوب الرد دون التنازل عن فكرتك الأساسية بعد الهدوء.'
    };
  }

  if (clean.includes('استحي') || clean.includes('أقول لا') || clean.includes('إرضاء') || clean.includes('مجاملة') || category === 'behavior') {
    return {
      step24Hours: 'مهلة الـ 24 ساعة الإلزامية: الرد على أي طلب مفاجئ بـ: «سأفحص جدول التزاماتي وأخبرك غداً».',
      todayPlan: 'فصل الرضا عن القيمة: تذكير نفسك بأن قول «لا» لطلب لا يعني قول «لا» للشخص، بل حماية لطاقتك وصدقك.',
      weeklyPlan: 'رفض طلب واحد غير ملائم أسبوعياً بلطف مقتضب دون اختلاق أعذار وهمية أو مبالغة في الاعتذار.',
      monthlyPlan: 'إعادة بناء حدود الوقت والطاقة: تخصيص أوقات غير قابلة للمساس للراحة والاهتمامات الشخصية.',
      ifThenRule: `إذا شعرت بالتحرج وأردت الموافقة على ما يرهقني، فإنني سأصمت 5 ثوانٍ وأقول: «يسعدني لكن لا أستطيع حالياً».`,
      progressIndicators: [
        'تراجع الشعور بالذنب والمغص المعوي عند الاعتذار عن تلبية طلبات الآخرين',
        'توفير ساعات أسبوعياً كانت تضيع في مجاملات مستنزفة',
        'زيادة احترام الآخرين لوقتك وحدودك المعلنة بوضوح'
      ],
      relapseProtocol: 'إذا وافقت على شيء يرهقك تسرعاً، تواصل بعد ساعة بلطف وقل: «راجعت التزاماتي وتبين لي تعذر المشاركة، أعتذر منك».'
    };
  }

  // General Self / Cognitive
  return {
    step24Hours: 'تطبيق قاعدة الملاحظ الصامت: تدوين السلوك في ورقة صغيرة فور حدوثه كوصف خارجي دون تقييم ذاتي.',
    todayPlan: 'تثبيت بروتوكول النوم والمزاج: ضبط موعد نوم ثابت والنوم 7 ساعات لمنح قشرة الفص الجبهي قدرتها التنفيذية.',
    weeklyPlan: 'تطبيق تقنية الاستبدال السلوكي (Habit Substitution): ربط الاستجابة الجديدة بمثير قديم راسخ.',
    monthlyPlan: 'ترسيخ المسار العصبي الجديد عبر التكرار اليومي الصغير المتصل (Micro-Habits) بدلاً من الطفرات المرهقة.',
    ifThenRule: `إذا داهمتني الأفكار التلقائية المقلقة، فإنني سأسأل نفسي: «هل هذا خطر حقيقي الآن أم مجرد سيناريو ذهني؟».`,
    progressIndicators: [
      'ارتفاع الفاصل الزمني بين المثير والاستجابة (عتبة الوعي)',
      'تحسن جودة النوم وانخفاض مستويات التوتر الصباحي',
      'تراجع تكرار العادة بنسبة تزيد عن 50% خلال شهر'
    ],
    relapseProtocol: 'إذا انتكست وعدت للسلوك القديم، تذكر أن الدماغ يعيد ترتيب مساراته؛ اعتبرها كبوة واستأنف الخطة في الموقف التالي فوراً.'
  };
}
