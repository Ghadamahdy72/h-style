import { BehaviorCategory, Perspective, QuestionItem } from '../types';
import {
  HAYAT_BOASTING_OTHER_QUESTIONS,
  HAYAT_BOASTING_SELF_QUESTIONS,
  WALKING_ALONE_OTHER_QUESTIONS,
  WALKING_ALONE_SELF_QUESTIONS,
  WITHDRAWAL_OTHER_QUESTIONS,
  WITHDRAWAL_SELF_QUESTIONS,
  EMOTIONAL_REACTION_OTHER_QUESTIONS,
  EMOTIONAL_REACTION_SELF_QUESTIONS,
  PROCRASTINATION_OTHER_QUESTIONS,
  PROCRASTINATION_SELF_QUESTIONS,
  JEALOUSY_OTHER_QUESTIONS,
  JEALOUSY_SELF_QUESTIONS,
  PEOPLE_PLEASING_OTHER_QUESTIONS,
  PEOPLE_PLEASING_SELF_QUESTIONS,
  CONTROLLING_OTHER_QUESTIONS,
  CONTROLLING_SELF_QUESTIONS,
  BASE_OTHER_QUESTIONS,
  BASE_SELF_QUESTIONS
} from '../data/questionsData';

export interface DialectAnalysis {
  category: BehaviorCategory;
  perspective: Perspective;
  severity: 'منخفضة' | 'متوسطة' | 'مرتفعة';
  themeKey: string;
  themeTitleAr: string;
  detectedSciences: string[];
  detectedCodes: string[];
}

// 1. Withdrawal / Stonewalling Questions (يسحب علي / يطنش)
export const WITHDRAWAL_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-withd-pattern',
    questionAr: 'كيف يظهر انسحاب الطرف الآخر وبروده غالباً؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم العلاقات وجدار الصمت — د. جون جوتمان',
    codeBadge: 'الشيفرة: أنماط التعلّق',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-withd-cold',
        textAr: 'صمت مفاجئ وتجاهل الرسائل والاتصالات',
        insightAr: 'حسب نظرية التعلّق لجون بولبي: جدار دفاعي يلجأ له النمط التجنبي عند الشعور بالغرق العاطفي.',
        weightTags: { 'attachment': 4, 'gottman': 4, 'code-attachment-styles': 4 }
      },
      {
        id: 'opt-withd-conflict',
        textAr: 'الهروب بمجرد بدء أي نقاش صريح',
        insightAr: 'وفق جون جوتمان: محاولة تجنب الاستثارة العصبية الحادة (Flooding) بالانسحاب الفوري.',
        weightTags: { 'gottman': 4, 'emotion-regulation': 3, 'code-emotion-regulation': 3 }
      },
      {
        id: 'opt-withd-moody',
        textAr: 'تقلب سريع بين القرب والابتعاد',
        insightAr: 'حسب علم النفس العلائقي: صراع بين الرغبة في الأمان والخوف من فقدان الاستقلالية.',
        weightTags: { 'attachment': 4, 'schema-therapy': 3 }
      },
      {
        id: 'opt-withd-excuses',
        textAr: 'التحجج الدائم بضيق الوقت والانشغال',
        insightAr: 'حسب نظرية الاختيار لجلاسر: وسيلة غير واعية للتحكم في المسافة العاطفية بينكما.',
        weightTags: { 'choice-theory': 3, 'code-motives-goals': 3 }
      }
    ]
  },
  {
    id: 'q-withd-reaction',
    questionAr: 'كيف يتصرف عندما تحاول كسر صمته؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نموذج تنظيم الانفعالات — د. جيمس جروس',
    codeBadge: 'الشيفرة: التهديدات والمخاوف',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-withd-deeper',
        textAr: 'يزداد بروداً وينسحب بشكل أعمق',
        insightAr: 'حسب علاج المخططات: يرى في الإلحاح تهديداً لحدوده فيتصلب دفاعياً.',
        weightTags: { 'attachment': 5, 'cbt': 3, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-withd-deflect',
        textAr: 'يغير الموضوع أو يتحجج بالانشغال',
        insightAr: 'وفق نموذج جروس: استراتيجية تحويل الانتباه لتفادي مواجهة المشاعر الصعبة.',
        weightTags: { 'emotion-regulation': 4, 'code-values-conscience': 4 }
      },
      {
        id: 'opt-withd-attack',
        textAr: 'ينفعل ويهاجم دفاعاً عن عزلته',
        insightAr: 'حسب علم التوازن العصبي: استجابة دفاعية سريعة لردع أي محاولة لاقتحام مساحته.',
        weightTags: { 'stress-allostasis': 4, 'code-threats-fears': 3 }
      },
      {
        id: 'opt-withd-ignore',
        textAr: 'يتجاهل المحاولة كأن شيئاً لم يحدث',
        insightAr: 'حسب نظرية التنافر المعرفي: إنكار وجود مشكلة لتفادي كلفة النقاش والاعتراف.',
        weightTags: { 'cbt': 4, 'code-thoughts-appraisals': 3 }
      }
    ]
  },
  {
    id: 'q-withd-root',
    questionAr: 'ما الدافع الأقرب لهروبه إلى الصمت؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'الذكاء العاطفي والتنظيم الانفعالي — دانييل جولمان',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-withd-incapable',
        textAr: 'عجز في مهارات التعبير ومواجهة الخلاف',
        insightAr: 'حسب الذكاء العاطفي: أمية عاطفية تجعل الصمت ملجأه الوحيد لتفادي العجز.',
        weightTags: { 'eq': 4, 'nvc': 4, 'code-emotion-regulation': 4 }
      },
      {
        id: 'opt-withd-punish',
        textAr: 'استخدام الصمت كسلاح ضغط وهيمنة',
        insightAr: 'وفق علم النفس السلوكي: الصمت العقابي أداة لفرض السيطرة وإجبار الطرف المقابل على التراجع.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 4 }
      },
      {
        id: 'opt-withd-fear',
        textAr: 'خوف من تصاعد الموقف والقطيعة',
        insightAr: 'حسب نظرية النظم: هروب بدائي لخفض حرارة الموقف وتفادي الانفجار.',
        weightTags: { 'systems-thinking': 3, 'code-threats-fears': 3 }
      },
      {
        id: 'opt-withd-space',
        textAr: 'حاجة حادة للعزلة واسترجاع طاقته',
        insightAr: 'حسب علم الأعصاب: استنزاف بطاريته الاجتماعية يدفعه للانعزال لإعادة الشحن.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
      }
    ]
  }
];

// 2. Control and Domination Questions (يتحكم / متسلط / رأيه وبس / نرجسي)
export const CONTROLLING_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-ctrl-style',
    questionAr: 'كيف يمارس الطرف الآخر محاولة فرض سيطرته؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار ومحاولات السيطرة — د. ويليام جلاسر',
    codeBadge: 'الشيفرة: الأهداف والدوافع',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-ctrl-micromanage',
        textAr: 'بالتدقيق في التفاصيل وتوجيه الأوامر',
        insightAr: 'حسب نظرية الاختيار: وهم السيطرة الخارجية لإسكات قلق داخلي من الفوضى.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 4 }
      },
      {
        id: 'opt-ctrl-guilt',
        textAr: 'بالإشعار بالذنب وتصوير نفسه كضحية',
        insightAr: 'وفق مثلث كاربمان: استخدام دور الضحية لإلزام المحيطين بالطاعة.',
        weightTags: { 'schema-therapy': 4, 'code-beliefs-assumptions': 4 }
      },
      {
        id: 'opt-ctrl-invalidation',
        textAr: 'بالتسفيه من الآراء والتقليل من القرارات',
        insightAr: 'حسب CBT: التشكيك لخلخلة ثقة المقابل وجعله تابعاً ومحتاجاً لتوجيهه.',
        weightTags: { 'cbt': 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-ctrl-anger',
        textAr: 'بالغضب السريع والتلويح بالمقاطعة',
        insightAr: 'حسب علم السلوكيات: سلوك قسري فعال يتم تعزيزه كلما خضع الطرف الآخر لتفادي الأزمة.',
        weightTags: { 'habit-loops': 3, 'choice-theory': 4 }
      }
    ]
  }
];

// Helper to normalize Arabic text
export function normalizeArabic(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '') // remove tashkeel
    .trim();
}

// Clean text to extract core topic for dynamic generation
export function extractCleanTopic(raw: string): string {
  let cleaned = (raw || '').trim();
  cleaned = cleaned.replace(/^(ليه|ليش|لماذا|كيف|وش سبب|ما سبب|ماهو سبب|شنو سبب)\s+/i, '');
  cleaned = cleaned.replace(/^(احب|أحب|ودّي|ودي|صرت|اصبحت|أصبحت|دايم|دائما)\s+/i, '');
  cleaned = cleaned.replace(/[؟?!\.]/g, '').trim();
  return cleaned || raw;
}

// 3. Dynamic Contextual Questions Generator (Used for ANY input that doesn't match a static theme)
export function generateContextualQuestions(
  text: string,
  category: BehaviorCategory,
  perspective: Perspective
): QuestionItem[] {
  const topic = extractCleanTopic(text);
  const isOther = perspective === 'other';

  if (isOther) {
    return [
      {
        id: 'dyn-ctx-trigger',
        questionAr: 'متى يظهر هذا التصرف غالباً من الطرف الآخر؟',
        subtitleAr: 'اختر إجابة أو أكثر',
        scienceBadge: 'علم العادات وحلقات السلوك — جيمس كلير (James Clear)',
        codeBadge: 'الشيفرة: المثيرات والعادات',
        allowMultiple: true,
        perspective: 'other',
        options: [
          {
            id: 'dyn-opt-other-trig-stress',
            textAr: 'عند تعرضه لضغط مفاجئ أو إرهاق',
            insightAr: 'حسب علم التوازن العصبي: تفريغ تلقائي للتوتر وخفض استثارة جهازه العصبي.',
            weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
          },
          {
            id: 'dyn-opt-other-trig-social',
            textAr: 'أمام الناس وفي التجمعات لإثبات حضوره',
            insightAr: 'وفق ألفريد أدلر: تعويض نفسي وإثبات للأهمية والمكانة الاجتماعية.',
            weightTags: { 'habit-loops': 4, 'code-social-influence': 4 }
          },
          {
            id: 'dyn-opt-other-trig-conflict',
            textAr: 'أثناء الخلافات والنقاشات الجادة',
            insightAr: 'حسب نظرية التهديدات: آلية دفاعية سريعة لحماية حدوده وصيانة كبريائه.',
            weightTags: { 'cbt': 4, 'code-threats-fears': 4 }
          },
          {
            id: 'dyn-opt-other-trig-routine',
            textAr: 'كنمط تلقائي متكرر دون سبب ظاهر',
            insightAr: 'حسب نموذج فوج: برمجة سلوكية راسخة تصدر دون تفكير واعي مسبق.',
            weightTags: { 'fogg': 4, 'code-habits-triggers': 4 }
          }
        ]
      },
      {
        id: 'dyn-ctx-need',
        questionAr: 'ما الدافع الخفي الأقرب لتصرفه؟',
        subtitleAr: 'اختر إجابة أو أكثر',
        scienceBadge: 'العلاج المعرفي السلوكي (CBT) — د. آرون بيك (Aaron T. Beck)',
        codeBadge: 'الشيفرة: الأفكار والتفسيرات',
        allowMultiple: true,
        perspective: 'other',
        options: [
          {
            id: 'dyn-opt-other-need-control',
            textAr: 'فرض السيطرة لتفادي الشعور بالعجز',
            insightAr: 'حسب نظرية الاختيار لجلاسر: محاولة التحكم لتسكين قلق الفوضى والضعف.',
            weightTags: { 'choice-theory': 5, 'code-psych-needs': 4 }
          },
          {
            id: 'dyn-opt-other-need-validation',
            textAr: 'طلب الاهتمام وإثبات قيمته الشخصية',
            insightAr: 'وفق هرم ماسلو: جوع لحاجة التقدير والاحترام يدفع لسلوكيات انتزاع القبول.',
            weightTags: { 'sdt': 4, 'code-psych-needs': 5 }
          },
          {
            id: 'dyn-opt-other-need-avoidance',
            textAr: 'تجنب المواجهة والهروب من الالتزام',
            insightAr: 'حسب نظرية التعلّق لبولبي: انسحاب تجنبي لحماية نفسه من الضغط والمسؤولية.',
            weightTags: { 'cbt': 4, 'code-thoughts-appraisals': 4 }
          },
          {
            id: 'dyn-opt-other-need-regulation',
            textAr: 'صعوبة تفريغ التوتر وضبط الانفعالات',
            insightAr: 'وفق الذكاء العاطفي لجولمان: ضعف التنظيم الانفعالي يدفع للتفريغ غير المحسوب.',
            weightTags: { 'eq': 4, 'code-emotions-affect': 4 }
          }
        ]
      },
      {
        id: 'dyn-ctx-payoff',
        questionAr: 'ما المكسب اللحظي الفوري له من هذا التصرف؟',
        subtitleAr: 'اختر إجابة أو أكثر',
        scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
        codeBadge: 'الشيفرة: المكافأة والتعزيز',
        allowMultiple: true,
        perspective: 'other',
        options: [
          {
            id: 'dyn-opt-other-pay-dominance',
            textAr: 'حسم الموقف لصالحه والشعور بالتفوق',
            insightAr: 'وفق نظرية التعزيز: الشعور اللحظي بالقوة يُثبت السلوك كأداة معتمدة لديه.',
            weightTags: { 'choice-theory': 4, 'code-reward-reinforcement': 4 }
          },
          {
            id: 'dyn-opt-other-pay-relief',
            textAr: 'الارتياح المؤقت والتخلص من النقاش',
            insightAr: 'حسب CBT: مكسب التجنب السريع (Avoidance Payoff) الذي يخفف القلق الفوري.',
            weightTags: { 'cbt': 4, 'code-reward-reinforcement': 4 }
          },
          {
            id: 'dyn-opt-other-pay-attention',
            textAr: 'جذب الانتباه والتعاطف ممن حوله',
            insightAr: 'وفق علم النفس الاجتماعي: استجابة المحيطين تمنح السلوك مكافأة اجتماعية لتكراره.',
            weightTags: { 'habit-loops': 4, 'code-social-influence': 3 }
          },
          {
            id: 'dyn-opt-other-pay-defense',
            textAr: 'حماية نفسه وتفادي كشف نقاط ضعفه',
            insightAr: 'حسب علاج المخططات: درع حماية نفسي لتفادي الانكشاف العاطفي أمام الناس.',
            weightTags: { 'emotion-regulation': 4, 'code-threats-fears': 4 }
          }
        ]
      }
    ];
  }

  // Self perspective
  return [
    {
      id: 'dyn-ctx-trigger',
      questionAr: `متى يظهر هذا السلوك لديك غالباً؟`,
      subtitleAr: 'اختر إجابة أو أكثر',
      scienceBadge: 'علم العادات وحلقات السلوك — جيمس كلير (James Clear)',
      codeBadge: 'الشيفرة: المثيرات والعادات',
      allowMultiple: true,
      perspective: 'self',
      options: [
        {
          id: 'dyn-opt-trig-stress',
          textAr: 'عند تراكم الضغوط والإرهاق اليومي',
          insightAr: 'حسب علم التوازن العصبي: تفريغ سريع لخفض هرمونات التوتر والإجهاد.',
          weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
        },
        {
          id: 'dyn-opt-trig-alone',
          textAr: 'في أوقات الفراغ وتصفية الذهن',
          insightAr: 'وفق علم العادات: الفراغ غير المنظم يدفع الدماغ التلقائي لسلوكيات مهدئة.',
          weightTags: { 'habit-loops': 4, 'code-reward-reinforcement': 3 }
        },
        {
          id: 'dyn-opt-trig-social',
          textAr: 'بعد الاحتكاك الطويل بالآخرين',
          insightAr: 'حسب الذكاء العاطفي: حاجة بيولوجية لتفريغ الحمل الحسي واستعادة التوازن.',
          weightTags: { 'eq': 4, 'code-social-influence': 3 }
        },
        {
          id: 'dyn-opt-trig-routine',
          textAr: 'كنمط روتيني تلقائي غير مخطط',
          insightAr: 'حسب نموذج فوج: عادة متأصلة تعمل بمجرد التقاء الإشارة مع سهولة الفعل.',
          weightTags: { 'fogg': 4, 'code-habits-triggers': 4 }
        }
      ]
    },
    {
      id: 'dyn-ctx-need',
      questionAr: 'ما الشعور أو الدافع الداخلي الأبرز حينها؟',
      subtitleAr: 'اختر إجابة أو أكثر',
      scienceBadge: 'العلاج المعرفي السلوكي (CBT) — د. آرون بيك (Aaron T. Beck)',
      codeBadge: 'الشيفرة: الأفكار والتفسيرات',
      allowMultiple: true,
      perspective: 'self',
      options: [
        {
          id: 'dyn-opt-need-escape',
          textAr: 'الرغبة في الهدوء والابتعاد عن الضجيج',
          insightAr: 'حسب CBT: تجنب تكيفي مؤقت لحماية الصفاء الذهني من الاستنزاف.',
          weightTags: { 'cbt': 4, 'code-thoughts-appraisals': 4 }
        },
        {
          id: 'dyn-opt-need-autonomy',
          textAr: 'الحاجة للاستقلالية والحرية التامة',
          insightAr: 'حسب نظرية تقرير المصير (SDT): الاستقلالية من أعمق الحاجات النفسية للسلامة.',
          weightTags: { 'sdt': 5, 'code-psych-needs': 4 }
        },
        {
          id: 'dyn-opt-need-pleasure',
          textAr: 'البحث عن راحة وتعويض عاطفي سريع',
          insightAr: 'وفق كيمياء الأعصاب: طلب مكافأة حسية تفرز الدوبامين لتعويض الإجهاد.',
          weightTags: { 'habit-loops': 3, 'code-reward-reinforcement': 4 }
        },
        {
          id: 'dyn-opt-need-soothe',
          textAr: 'تسكين ضيق وتوتر داخلي متراكم',
          insightAr: 'حسب علم تنظيم المشاعر: وسيلة تهدئة ذاتية (Self-Soothing) لإعادة التوازن.',
          weightTags: { 'emotion-regulation': 4, 'code-emotions-affect': 4 }
        }
      ]
    },
    {
      id: 'dyn-ctx-payoff',
      questionAr: 'ما المكسب الفوري الذي يمنحك إياه هذا السلوك؟',
      subtitleAr: 'اختر إجابة أو أكثر',
      scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
      codeBadge: 'الشيفرة: المكافأة والتعزيز',
      allowMultiple: true,
      perspective: 'self',
      options: [
        {
          id: 'dyn-opt-pay-clarity',
          textAr: 'صفاء ذهني وتخفيف فوري للضغط',
          insightAr: 'حسب ويليام جلاسر: مكافأة فورية تلبي حاجة الأمان والسلام الداخلي.',
          weightTags: { 'choice-theory': 4, 'code-reward-reinforcement': 4 }
        },
        {
          id: 'dyn-opt-pay-recharge',
          textAr: 'شحن الطاقة واستعادة التوازن النفسي',
          insightAr: 'وفق علم النفس الإيجابي: الأنشطة المهدئة ترفع المخزون الاحتياطي للمرونة النفسية.',
          weightTags: { 'positive-psych': 4, 'code-values-conscience': 3 }
        },
        {
          id: 'dyn-opt-pay-relief',
          textAr: 'تفريغ فوري لثقل المشاعر المرهقة',
          insightAr: 'وفق علم الأحياء السلوكي: زوال التوتر العصبي هو المعزز الأقوى لتكرار السلوك.',
          weightTags: { 'habit-loops': 4, 'code-somatic-biology': 3 }
        },
        {
          id: 'dyn-opt-pay-delay',
          textAr: 'تأجيل مواجهة ما يقلقني مؤقتاً',
          insightAr: 'حسب CBT: راحة لحظية من كلفة المواجهة مقابل زيادة تراكمها لاحقاً.',
          weightTags: { 'cbt': 4, 'code-reward-reinforcement': 4 }
        }
      ]
    }
  ];
}

export function parseDialectAndIntent(text: string): DialectAnalysis {
  const norm = normalizeArabic(text);

  // 1. Perspective detection
  const isOther =
    norm.includes('ليش الشخص') ||
    norm.includes('ليه الشخص') ||
    norm.includes('ليش يهايط') ||
    norm.includes('ليه يهايط') ||
    norm.includes('ليش فلان') ||
    norm.includes('ليه فلان') ||
    norm.includes('ليش الناس') ||
    norm.includes('ليه الناس') ||
    norm.includes('الشخص اللي') ||
    norm.includes('الشخص يهايط') ||
    norm.includes('الشخص') ||
    norm.includes('شريكي') ||
    norm.includes('زوجي') ||
    norm.includes('زوجتي') ||
    norm.includes('مديري') ||
    norm.includes('خويي') ||
    norm.includes('صديقي') ||
    norm.includes('زميلي') ||
    norm.includes('امي') ||
    norm.includes('ابوي') ||
    norm.includes('اخوي') ||
    norm.includes('اختي') ||
    norm.includes('يسحب علي') ||
    norm.includes('سحب علي') ||
    norm.includes('يطنشني') ||
    norm.includes('مطنش') ||
    norm.includes('يتحكم') ||
    norm.includes('ينتقدني') ||
    norm.includes('يستفزني') ||
    norm.includes('يغار مني') ||
    norm.includes('فلان') ||
    norm.includes('الناس');

  const perspective: Perspective = isOther ? 'other' : 'self';

  // 2. Severity detection
  let severity: 'منخفضة' | 'متوسطة' | 'مرتفعة' = 'متوسطة';
  if (
    norm.includes('جدا') ||
    norm.includes('حيل') ||
    norm.includes('بجنون') ||
    norm.includes('تعبت') ||
    norm.includes('ما اتحمل') ||
    norm.includes('انفجار') ||
    norm.includes('كارثه') ||
    norm.includes('اكره') ||
    norm.includes('انهيار') ||
    norm.includes('!')
  ) {
    severity = 'مرتفعة';
  }

  // 3. Theme Identification using Robust Multi-Word Semantic Patterns
  let themeKey = 'general';
  let themeTitleAr = 'سلوك عام';
  let category: BehaviorCategory = 'behavior';
  let detectedSciences = ['cbt', 'choice-theory'];
  let detectedCodes = ['code-motives-goals', 'code-thoughts-appraisals'];

  // Match 1: Boasting / Hayat / Fashkhara (يهايط / هياط / استعراض)
  const isHayat =
    norm.includes('يهايط') ||
    norm.includes('تهايط') ||
    norm.includes('مهايط') ||
    norm.includes('هياط') ||
    norm.includes('فشخره') ||
    norm.includes('يفوشر') ||
    norm.includes('فوشره') ||
    norm.includes('استعراض') ||
    norm.includes('تباهي') ||
    norm.includes('مباهاه') ||
    norm.includes('مظاهر') ||
    norm.includes('شوفوني') ||
    norm.includes('يتفلسف') ||
    norm.includes('رافع خشمه') ||
    norm.includes('شايف نفسه') ||
    norm.includes('متكبر') ||
    norm.includes('تكبر') ||
    norm.includes('غرور') ||
    norm.includes('مغرور');

  // Match 2: Walking Alone / Solitude / Seeking Quiet (أمشي لوحدي / أمشي لحالي / عزلة)
  const hasWalkWord =
    norm.includes('امشي') ||
    norm.includes('مشي') ||
    norm.includes('اتمشي') ||
    norm.includes('تتمشي') ||
    norm.includes('يتمشي');

  const hasAloneWord =
    norm.includes('لوحدي') ||
    norm.includes('لحالي') ||
    norm.includes('وحدي') ||
    norm.includes('منفرد') ||
    norm.includes('لحال') ||
    norm.includes('بدون احد') ||
    norm.includes('بدون الناس') ||
    norm.includes('لوحده') ||
    norm.includes('لحاله') ||
    norm.includes('وحده');

  const isWalkingAlone =
    (hasWalkWord && hasAloneWord) ||
    norm.includes('لوحدي') ||
    norm.includes('لحالي') ||
    norm.includes('عزله') ||
    norm.includes('انعزال') ||
    norm.includes('انطواء') ||
    norm.includes('اكون لوحدي') ||
    norm.includes('اكون لحالي') ||
    norm.includes('اقعد لوحدي') ||
    norm.includes('اقعد لحالي') ||
    norm.includes('اجلس لوحدي') ||
    norm.includes('اجلس لحالي') ||
    norm.includes('احب الوحده') ||
    norm.includes('افضل الوحده') ||
    norm.includes('احب الهدوء') ||
    norm.includes('تعبت من الناس') ||
    norm.includes('مالي خلق احد') ||
    norm.includes('بطاريتي فضيت');

  // Match 3: Stonewalling / Withdrawal / Ghosting (يسحب علي / يطنش)
  const isWithdrawal =
    norm.includes('يسحب') ||
    norm.includes('سحب') ||
    norm.includes('ساحب') ||
    norm.includes('يطنش') ||
    norm.includes('طنش') ||
    norm.includes('مطنش') ||
    norm.includes('تجاهل') ||
    norm.includes('يتجاهل') ||
    norm.includes('صمت عقابي') ||
    norm.includes('ما يرد') ||
    norm.includes('برود') ||
    norm.includes('جفاء') ||
    norm.includes('ما يكلمني') ||
    norm.includes('يعطيني ركبه') ||
    norm.includes('يقلب وجهه');

  // Match 4: Quick Temper / Anger / Emotion Spark (أعصب / نرفزة / غضب)
  const isEmotionalReaction =
    norm.includes('اعصب') ||
    norm.includes('يعصب') ||
    norm.includes('عصبيه') ||
    norm.includes('نرفزه') ||
    norm.includes('اتنرفز') ||
    norm.includes('يتنرفز') ||
    norm.includes('غضب') ||
    norm.includes('يغضب') ||
    norm.includes('صراخ') ||
    norm.includes('يصرخ') ||
    norm.includes('انفعل') ||
    norm.includes('ينفعل') ||
    norm.includes('انفجار') ||
    norm.includes('يفصل مخي') ||
    norm.includes('يرتفع ضغطي') ||
    norm.includes('انغث') ||
    norm.includes('قهر') ||
    norm.includes('يقهرني') ||
    norm.includes('شراره');

  // Match 5: Procrastination / Delaying (تسويف / مماطلة / أأجل)
  const isProcrastination =
    norm.includes('تسويف') ||
    norm.includes('مماطله') ||
    norm.includes('اماطل') ||
    norm.includes('يماطل') ||
    norm.includes('ااجل') ||
    norm.includes('ياجل') ||
    norm.includes('تاجيل') ||
    norm.includes('كسل') ||
    norm.includes('كسلان') ||
    norm.includes('مالي خلق اذاكر') ||
    norm.includes('مالي خلق اشتغل') ||
    norm.includes('اهرب للجوال') ||
    norm.includes('تضييع وقت');

  // Match 6: Jealousy / Envy (غيرة / حسد / مقارنة)
  const isJealousy =
    norm.includes('غيره') ||
    norm.includes('يغار') ||
    norm.includes('اغار') ||
    norm.includes('تغار') ||
    norm.includes('حسد') ||
    norm.includes('يحسد') ||
    norm.includes('احسد') ||
    norm.includes('مقارنه') ||
    norm.includes('اقارن') ||
    norm.includes('يقارن') ||
    norm.includes('محتره') ||
    norm.includes('ليش هو') ||
    norm.includes('ليش هي');

  // Match 7: People Pleasing (ما أقدر أقول لا / إرضاء الناس)
  const isPeoplePleasing =
    norm.includes('ما اقدر اقول لا') ||
    norm.includes('استحي ارفض') ||
    norm.includes('يستحي يرفض') ||
    norm.includes('ارضاء الناس') ||
    norm.includes('استغلال') ||
    norm.includes('يستغلوني') ||
    norm.includes('اجامل') ||
    norm.includes('يكسر خاطري') ||
    norm.includes('ضعف شخصيه');

  // Match 8: Control (يتحكم / متسلط / رأيه وبس)
  const isControlling =
    norm.includes('يتحكم') ||
    norm.includes('تحكم') ||
    norm.includes('متسلط') ||
    norm.includes('تسلط') ||
    norm.includes('نرجسي') ||
    norm.includes('نرجسيه') ||
    norm.includes('رايه وبس') ||
    norm.includes('يفرض رايه') ||
    norm.includes('يدقق');

  if (isHayat) {
    themeKey = 'hayat_boasting';
    themeTitleAr = 'الاستعراض والتباهي (الهياط)';
    category = 'behavior';
    detectedSciences = ['adler', 'maslow', 'schema-therapy', 'choice-theory'];
    detectedCodes = ['code-psych-needs', 'code-threats-fears', 'code-motives-goals'];
  } else if (isWalkingAlone) {
    themeKey = 'walking_alone';
    themeTitleAr = 'المشي وحيداً واستعادة الطاقة';
    category = 'habit';
    detectedSciences = ['sdt', 'eq', 'sleep-circadian', 'cbt'];
    detectedCodes = ['code-psych-needs', 'code-somatic-biology', 'code-habits-triggers'];
  } else if (isWithdrawal) {
    themeKey = 'withdrawal_stonewalling';
    themeTitleAr = 'التجاهل والانسحاب العاطفي (السحبة)';
    category = 'relationship';
    detectedSciences = ['attachment', 'gottman', 'nvc', 'eq'];
    detectedCodes = ['code-attachment-styles', 'code-emotion-regulation', 'code-threats-fears'];
  } else if (isEmotionalReaction) {
    themeKey = 'emotional_reaction';
    themeTitleAr = 'الشرارة الانفعالية وسرعة الغضب';
    category = 'reaction';
    detectedSciences = ['emotion-regulation', 'dbt', 'cbt', 'stress-allostasis'];
    detectedCodes = ['code-emotions-affect', 'code-somatic-biology', 'code-thoughts-appraisals'];
  } else if (isProcrastination) {
    themeKey = 'procrastination';
    themeTitleAr = 'التسويف والمماطلة والهروب الدوباميني';
    category = 'habit';
    detectedSciences = ['habit-loops', 'fogg', 'cbt', 'growth-mindset'];
    detectedCodes = ['code-reward-reinforcement', 'code-habits-triggers', 'code-cognitive-biases'];
  } else if (isJealousy) {
    themeKey = 'jealousy';
    themeTitleAr = 'الغيرة والمقارنة الاجتماعية المؤلمة';
    category = 'mood';
    detectedSciences = ['cbt', 'growth-mindset', 'schema-therapy', 'maslow'];
    detectedCodes = ['code-social-influence', 'code-beliefs-assumptions', 'code-threats-fears'];
  } else if (isPeoplePleasing) {
    themeKey = 'people_pleasing';
    themeTitleAr = 'صعوبة الرفض وإرضاء الناس على حساب الذات';
    category = 'behavior';
    detectedSciences = ['nvc', 'schema-therapy', 'attachment', 'eq'];
    detectedCodes = ['code-values-conscience', 'code-social-influence', 'code-attachment-styles'];
  } else if (isControlling) {
    themeKey = 'controlling';
    themeTitleAr = 'محاولات السيطرة والتسلط وفرض الرأي';
    category = 'relationship';
    detectedSciences = ['choice-theory', 'cbt', 'schema-therapy', 'gottman'];
    detectedCodes = ['code-motives-goals', 'code-beliefs-assumptions', 'code-threats-fears'];
  }

  return {
    category,
    perspective,
    severity,
    themeKey,
    themeTitleAr,
    detectedSciences,
    detectedCodes
  };
}

export function getDialectQuestions(
  text: string,
  themeKey: string,
  category: BehaviorCategory,
  perspective: Perspective
): QuestionItem[] {
  if (perspective === 'other') {
    // When analyzing another person, only use question sets specifically authored for the other perspective
    switch (themeKey) {
      case 'hayat_boasting':
        return HAYAT_BOASTING_OTHER_QUESTIONS;
      case 'walking_alone':
        return WALKING_ALONE_OTHER_QUESTIONS;
      case 'withdrawal_stonewalling':
        return WITHDRAWAL_OTHER_QUESTIONS;
      case 'emotional_reaction':
        return EMOTIONAL_REACTION_OTHER_QUESTIONS;
      case 'procrastination':
        return PROCRASTINATION_OTHER_QUESTIONS;
      case 'jealousy':
        return JEALOUSY_OTHER_QUESTIONS;
      case 'people_pleasing':
        return PEOPLE_PLEASING_OTHER_QUESTIONS;
      case 'controlling':
        return CONTROLLING_OTHER_QUESTIONS;
      default:
        return generateContextualQuestions(text, category, 'other');
    }
  }

  // Self perspective: user analyzing their own behaviors, thoughts, and feelings
  switch (themeKey) {
    case 'hayat_boasting':
      return HAYAT_BOASTING_SELF_QUESTIONS;
    case 'walking_alone':
      return WALKING_ALONE_SELF_QUESTIONS;
    case 'withdrawal_stonewalling':
      return WITHDRAWAL_SELF_QUESTIONS;
    case 'emotional_reaction':
      return EMOTIONAL_REACTION_SELF_QUESTIONS;
    case 'procrastination':
      return PROCRASTINATION_SELF_QUESTIONS;
    case 'jealousy':
      return JEALOUSY_SELF_QUESTIONS;
    case 'people_pleasing':
      return PEOPLE_PLEASING_SELF_QUESTIONS;
    case 'controlling':
      return CONTROLLING_SELF_QUESTIONS;
    default:
      return generateContextualQuestions(text, category, 'self');
  }
}
