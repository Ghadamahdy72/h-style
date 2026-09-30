import { QuestionItem, Perspective, BehaviorCategory } from '../types';
import { parseDialectAndIntent, getDialectQuestions } from '../services/dialectEngine';

// ============================================================================
// 1. الاستعراض والتباهي والهياط (Alfred Adler Inferiority Compensation & Maslow Esteem)
// ============================================================================

export const HAYAT_BOASTING_OTHER_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-hayat-oth-context',
    questionAr: 'متى يتصاعد استعراض وتباهي الطرف الآخر (الهياط)؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم النفس الفردي — ألفريد أدلر (Alfred Adler)',
    codeBadge: 'الشيفرة: المثيرات والعادات',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-hy-oth-crowd',
        textAr: 'أمام المجالس والتجمعات للفت الأنظار',
        insightAr: 'حسب ألفريد أدلر: آلية تعويضية لإخفاء قلق عميق من التهميش.',
        weightTags: { cbt: 3, 'code-threats-fears': 3, 'code-psych-needs': 3 }
      },
      {
        id: 'opt-hy-oth-rival',
        textAr: 'عند وجود منافس يهدد مكانته وقيمته',
        insightAr: 'وفق علم التطور الاجتماعي: درع حماية رمزي للموقع داخل المجموعة.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 3, 'code-social-influence': 3 }
      },
      {
        id: 'opt-hy-oth-material',
        textAr: 'عند استعراض المقتنيات والعلاقات والإنجازات',
        insightAr: 'وفق علم الاجتماع النفسي: شراء القيمة الذاتية المشروطة بإعجاب الآخرين.',
        weightTags: { maslow: 4, 'code-values-conscience': 2, 'code-reward-reinforcement': 3 }
      },
      {
        id: 'opt-hy-oth-ignore',
        textAr: 'عندما ينصرف عنه انتباه الحاضرين',
        insightAr: 'حسب هرم ماسلو: جوع التقدير يدفعه للمبالغة الفورية لاستعادة الانتباه.',
        weightTags: { maslow: 4, 'code-psych-needs': 4, sdt: 3 }
      }
    ]
  },
  {
    id: 'q-hayat-oth-belief',
    questionAr: 'ما الخوف الدفين الأقرب وراء استعراضه المستمر؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علاج المخططات المعرفية — جيفري يونغ (Jeffrey Young)',
    codeBadge: 'الشيفرة: التهديدات والمخاوف',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-hy-oth-defect',
        textAr: 'الخوف من أن يُرى عادياً أو مهمشاً',
        insightAr: 'حسب علاج المخططات: مخطط العيب يدفع لارتداء قناع التفوق التام.',
        weightTags: { 'schema-therapy': 4, 'code-beliefs-assumptions': 4, cbt: 3 }
      },
      {
        id: 'opt-hy-oth-unloved',
        textAr: 'الخوف من التجاهل وفقدان هيبته وحضوره',
        insightAr: 'وفق نظرية التعلّق: استجلاب انتباه قسري لحماية الوجود الاجتماعي.',
        weightTags: { attachment: 4, 'code-attachment-styles': 3 }
      },
      {
        id: 'opt-hy-oth-fragile',
        textAr: 'اعتقاد أن الاحترام مشروط بالمظاهر الخارجية',
        insightAr: 'وفق CBT: قاعدة مشوهة تربط الاحترام بالصورة الخارجية لا بالجوهر.',
        weightTags: { cbt: 4, 'code-thoughts-appraisals': 3 }
      },
      {
        id: 'opt-hy-oth-envy',
        textAr: 'محاولة استباقية لردع أي نقد أو سخرية',
        insightAr: 'حسب علم النفس الدفاعي: استراتيجية هجومية لتخويف المحيطين وردع النقد.',
        weightTags: { 'choice-theory': 3, 'code-threats-fears': 4 }
      }
    ]
  },
  {
    id: 'q-hayat-oth-payoff',
    questionAr: 'ما المكسب اللحظي الفوري له من هذا الاستعراض؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
    codeBadge: 'الشيفرة: المكافأة والتعزيز',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-hy-oth-dopamine',
        textAr: 'نشوة فورية من لفت الأنظار والشعور بالقوة',
        insightAr: 'حسب جلاسر: إشباع فوري ولحظي لحاجة القوة والاعتراف.',
        weightTags: { 'choice-theory': 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-hy-oth-relief',
        textAr: 'تسكين مؤقت للتوتر والشعور بالدونية',
        insightAr: 'وفق علم الأعصاب: الحديث الفخري يفرز الدوبامين في مراكز المكافأة.',
        weightTags: { 'habit-loops': 3, 'code-somatic-biology': 3 }
      },
      {
        id: 'opt-hy-oth-distance',
        textAr: 'صنع هيبة تمنع كشف نقاط ضعفه',
        insightAr: 'حسب دروع الأنا: تضخيم الهالة يمنع الاقتراب من مناطق الهشاشة.',
        weightTags: { 'schema-therapy': 3, 'code-motives-goals': 3 }
      },
      {
        id: 'opt-hy-oth-superior',
        textAr: 'الشعور بالتفوق وطمأنة الذات القلقة',
        insightAr: 'وفق المقارنة الاجتماعية: إيهام النفس بالتفوق لتهدئة قلق النقص.',
        weightTags: { cbt: 3, 'code-cognitive-biases': 3 }
      }
    ]
  }
];

export const HAYAT_BOASTING_SELF_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-hayat-slf-context',
    questionAr: 'متى تجد نفسك تميل للاستعراض أو المبالغة أمام الآخرين؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم النفس الفردي — ألفريد أدلر (Alfred Adler)',
    codeBadge: 'الشيفرة: المثيرات والعادات',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-hy-slf-crowd',
        textAr: 'أمام التجمعات لإثبات مكانتي وحضوري',
        insightAr: 'حسب أدلر: رغبة تعويضية لضمان عدم الشعور بالضآلة أو التهميش.',
        weightTags: { cbt: 3, 'code-threats-fears': 3, 'code-psych-needs': 3 }
      },
      {
        id: 'opt-hy-slf-rival',
        textAr: 'عند شعوري بأن شخصاً يسرق الأضواء مني',
        insightAr: 'وفق المقارنة الاجتماعية: استجابة دفاعية لحماية ترتيبي وقيمتي الرمزية.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 3 }
      },
      {
        id: 'opt-hy-slf-material',
        textAr: 'عند الحديث عن الإنجازات والمقتنيات',
        insightAr: 'حسب ماسلو: التطلع لانتزاع إشارات التقدير لتسكين الشك الذاتي.',
        weightTags: { maslow: 4, 'code-reward-reinforcement': 3 }
      },
      {
        id: 'opt-hy-slf-insecure',
        textAr: 'عندما ينتابني قلق من أن أكون عادياً',
        insightAr: 'حسب علاج المخططات: الهروب من مخطط النقص بارتداء قناع الإبهار.',
        weightTags: { 'schema-therapy': 4, 'code-beliefs-assumptions': 3 }
      }
    ]
  },
  {
    id: 'q-hayat-slf-feeling',
    questionAr: 'ما الشعور أو الدافع الداخلي الذي يحرك هذه المبالغة لديك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علاج المخططات المعرفية — د. جيفري يونغ (Jeffrey Young)',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-hy-slf-need-esteem',
        textAr: 'حاجتي الماسة للشعور بالاحترام والقبول',
        insightAr: 'وفق نظرية تقرير المصير (SDT): حاجة فطرية للأهمية والكفاءة.',
        weightTags: { sdt: 4, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-hy-slf-fear-rejection',
        textAr: 'خوفي من أن يُنظر لي بدونية أو ضعف',
        insightAr: 'وفق CBT: فكرة كارثية مفادها أن العادية تعني الرفض التام.',
        weightTags: { cbt: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-hy-slf-shield',
        textAr: 'رغبتي في بناء درع يحميني من النقد',
        insightAr: 'حسب علم النفس الدفاعي: إظهار القوة لمنع أي محاولة للمساس بالثقة.',
        weightTags: { 'choice-theory': 3, 'code-boundaries-assertiveness': 3 }
      },
      {
        id: 'opt-hy-slf-perfection',
        textAr: 'اعتقادي بأن قيمتي مشروطة بنجاحي وإبهاري',
        insightAr: 'حسب المخططات: معايير صارمة تجعل الراحة مشروطة بإعجاب المحيطين.',
        weightTags: { 'schema-therapy': 4, 'code-values-conscience': 3 }
      }
    ]
  },
  {
    id: 'q-hayat-slf-payoff',
    questionAr: 'ما المكسب الفوري أو الارتياح الذي تمنحه لك هذه المبالغة؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
    codeBadge: 'الشيفرة: المكافأة والتعزيز',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-hy-slf-rush',
        textAr: 'نشوة لحظية ورضا من نظرات الإعجاب',
        insightAr: 'وفق علم الأعصاب: تدفق الدوبامين في مراكز المكافأة يعزز السلوك فورياً.',
        weightTags: { 'habit-loops': 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-hy-slf-soothe',
        textAr: 'تسكين مؤقت لقلق الشك في الذات',
        insightAr: 'حسب جلاسر: سلوك تعويضي سريع لتسكين ألم الحاجة غير المشبعة.',
        weightTags: { 'choice-theory': 4, 'code-psych-needs': 3 }
      },
      {
        id: 'opt-hy-slf-power',
        textAr: 'شعور بالسيطرة والقوة بين الحاضرين',
        insightAr: 'حسب جلاسر: إشباع حاجة القوة والحرية المشوهة.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 3 }
      },
      {
        id: 'opt-hy-slf-safety',
        textAr: 'إخفاء نقاط ضعفي والاطمئنان المؤقت',
        insightAr: 'وفق دروع الأنا: حماية الهشاشة خلف جدار المظهر المتفوق.',
        weightTags: { 'schema-therapy': 3, 'code-threats-fears': 3 }
      }
    ]
  }
];

// ============================================================================
// 2. المشي وحيداً والعزلة واستعادة الطاقة (Sensory Processing & Social Battery)
// ============================================================================

export const WALKING_ALONE_SELF_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-walk-slf-timing',
    questionAr: 'متى تحب أن تمشي وحدك أكثر؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم النفس الاجتماعي وتنظيم الطاقة — سوزان كين (Susan Cain)',
    codeBadge: 'الشيفرة: المثيرات والعادات',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-wk-slf-people',
        textAr: 'بعد يوم حافل بالناس واللقاءات',
        insightAr: 'حسب سوزان كين: تفريغ الحمل الحسي وإعادة شحن البطارية الاجتماعية.',
        weightTags: { eq: 4, 'code-social-influence': 3, 'code-somatic-biology': 3 }
      },
      {
        id: 'opt-wk-slf-stress',
        textAr: 'عند التعب وضغط اليوم وتراكم الأفكار',
        insightAr: 'حسب علم الأعصاب: الخطوات الإيقاعية تخفض الكورتيزول وتسكن التوتر.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 4 }
      },
      {
        id: 'opt-wk-slf-quiet',
        textAr: 'عند الحاجة لتفكير هادئ وتصفية الذهن',
        insightAr: 'وفق علم النفس المعرفي: المشي ينشط شبكة التفكير الإبداعي والوضوح.',
        weightTags: { cbt: 3, 'code-thoughts-appraisals': 3 }
      },
      {
        id: 'opt-wk-slf-free',
        textAr: 'بلا سبب محدد حبّاً للمشي والانفراد',
        insightAr: 'حسب SDT: المشي المنفرد يشبع حاجة الاستقلالية والحرية الفطرية.',
        weightTags: { sdt: 4, 'code-psych-needs': 3 }
      }
    ]
  },
  {
    id: 'q-walk-slf-feeling',
    questionAr: 'ما أقرب شعور لك وأنت تمشي وحدك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم النفس الإدراكي ونظرية استعادة الانتباه (ART)',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-wk-slf-relief',
        textAr: 'راحة من ضجيج مجاملة الناس',
        insightAr: 'حسب علم النفس الاجتماعي: راحة من مجهود التمثيل الاجتماعي وارتداء الأقنعة.',
        weightTags: { eq: 4, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-wk-slf-calm',
        textAr: 'هدوء يريح جسدي وأعصابي المتشنجة',
        insightAr: 'وفق علم الأعصاب: تنشيط الجهاز العصبي اللاودي المسؤول عن التعافي.',
        weightTags: { 'sleep-circadian': 3, 'code-somatic-biology': 4 }
      },
      {
        id: 'opt-wk-slf-clarity',
        textAr: 'صفاء يوضح لي نفسي وأولوياتي',
        insightAr: 'حسب التأمل الواعي: الصمت الحركي يتيح الاستماع لحديثك الداخلي دون تشويش.',
        weightTags: { act: 3, 'code-values-conscience': 3 }
      },
      {
        id: 'opt-wk-slf-liberty',
        textAr: 'حرية كاملة بلا أي قيود أو رقابة',
        insightAr: 'وفق نظرية الاختيار: التحكم بالسرعة والوجهة يشبع الرغبة في الانعتاق.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 3 }
      }
    ]
  },
  {
    id: 'q-walk-slf-value',
    questionAr: 'ما الأثر الذي يتركه المشي في يومك بعد عودتك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم النفس الإيجابي وعلم الازدهار — مارتن سيليجمان (Martin Seligman)',
    codeBadge: 'الشيفرة: المكافأة والتعزيز',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-wk-slf-balance',
        textAr: 'اتزان وقدرة على التعامل بلطف وهدوء',
        insightAr: 'حسب الذكاء العاطفي: الانفصال المؤقت يعيد ضبط سعة الصدر وتفادي الانفعال.',
        weightTags: { eq: 4, 'code-emotion-regulation': 4 }
      },
      {
        id: 'opt-wk-slf-clarity-sol',
        textAr: 'وضوح الرؤية وحل مسألة كانت معقدة',
        insightAr: 'وفق علم النفس الإدراكي: الابتعاد الجسدي يمنح منظوراً أوسع للمشكلات.',
        weightTags: { cbt: 3, 'code-cognitive-biases': 3 }
      },
      {
        id: 'opt-wk-slf-resilience',
        textAr: 'شعور بالأمان والصلابة الداخلية',
        insightAr: 'حسب نظرية التعلّق: الاستمتاع بالوحدة مؤشر نضج على التهدئة الذاتية الآمنة.',
        weightTags: { attachment: 4, 'code-attachment-styles': 3 }
      },
      {
        id: 'opt-wk-slf-detox',
        textAr: 'تفريغ تشنج العضلات والإجهاد الجسدي',
        insightAr: 'وفق علم الجسد: إطلاق الإندورفين وتفكيك شحنات التشنج في الرقبة والكتف.',
        weightTags: { 'stress-allostasis': 3, 'code-somatic-biology': 3 }
      }
    ]
  }
];

export const WALKING_ALONE_OTHER_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-walk-oth-reason',
    questionAr: 'ما الدافع الأرجح لتفضيل الطرف الآخر للمشي والانعزال وحيداً؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم النفس الاجتماعي وتنظيم الطاقة — سوزان كين (Susan Cain)',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-wk-oth-drain',
        textAr: 'استنزاف طاقته الاجتماعية وحاجته للهدوء',
        insightAr: 'حسب سوزان كين: تفريغ الحمل الحسي وإعادة شحن البطارية الاجتماعية بعيداً عن الضغط.',
        weightTags: { eq: 4, 'code-somatic-biology': 4 }
      },
      {
        id: 'opt-wk-oth-avoid',
        textAr: 'تجنبه للنقاشات وتفضيله الصمت والابتعاد',
        insightAr: 'حسب نظرية التعلّق: انسحاب تكيفي للنمط التجنبي لتفادي الغرق العاطفي.',
        weightTags: { attachment: 4, 'code-attachment-styles': 4 }
      },
      {
        id: 'opt-wk-oth-stress',
        textAr: 'محاولة لتفريغ توتر وضغوط العمل والحياة',
        insightAr: 'وفق علم الأعصاب: الخطوات الإيقاعية آلية بيولوجية لخفض الكورتيزول والتهدئة.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
      },
      {
        id: 'opt-wk-oth-nature',
        textAr: 'طبيعة شخصيته المستقلة التي تميل للانفراد',
        insightAr: 'حسب نظرية تقرير المصير (SDT): تلبية حاجة الاستقلالية والحرية الذاتية.',
        weightTags: { sdt: 4, 'code-psych-needs': 3 }
      }
    ]
  },
  {
    id: 'q-walk-oth-impact',
    questionAr: 'كيف ينعكس انعزاله ومشيه وحيداً على علاقته معك ومع المحيطين؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم العلاقات — د. جون وجولي جوتمان (John & Julie Gottman)',
    codeBadge: 'الشيفرة: ديناميكيات التواصل',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-wk-oth-refresh',
        textAr: 'يعود أكثر هدوءاً وقدرة على الحوار',
        insightAr: 'حسب جوتمان: التهدئة الفسيولوجية الذاتية تمنع الانفجار وتخفض فرص الصدام.',
        weightTags: { gottman: 4, 'code-emotion-regulation': 4 }
      },
      {
        id: 'opt-wk-oth-wall',
        textAr: 'يستخدمه كجدار للهروب وتجنب المسؤوليات المشتركة',
        insightAr: 'حسب جوتمan: إذا تحول الانعزال لجدار صمت دائم فإنه يهدد استقرار الرابطة.',
        weightTags: { gottman: 4, 'code-communication-dynamics': 4 }
      },
      {
        id: 'opt-wk-oth-distant',
        textAr: 'يصنع مسافة وبروداً في التواصل',
        insightAr: 'وفق نظرية التعلّق: تباعد يثير قلق الطرف المقابل إذا لم يرافقه تطمين واضح.',
        weightTags: { attachment: 4, 'code-attachment-styles': 3 }
      },
      {
        id: 'opt-wk-oth-healthy',
        textAr: 'مساحة صحية طبيعية تحافظ على استقلاليته',
        insightAr: 'حسب نظرية النظم: المساحة الفردية ضرورة لنضج العلاقة ومنع الاعتمادية المفرطة.',
        weightTags: { 'choice-theory': 4, 'code-boundaries-assertiveness': 4 }
      }
    ]
  }
];

// ============================================================================
// 3. الانسحاب والتجاهل العاطفي (السحبة / جدار الصمت / Stonewalling)
// ============================================================================

export const WITHDRAWAL_OTHER_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-withd-oth-pattern',
    questionAr: 'كيف يظهر انسحاب الطرف الآخر وتجاهله غالباً؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم العلاقات وجدار الصمت — د. جون جوتمان (John Gottman)',
    codeBadge: 'الشيفرة: أنماط التعلّق',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-wtd-oth-cold',
        textAr: 'صمت مفاجئ وتجاهل الرسائل والاتصالات',
        insightAr: 'حسب نظرية التعلّق: جدار دفاعي يلجأ له النمط التجنبي عند الشعور بالغرق العاطفي.',
        weightTags: { attachment: 4, gottman: 4, 'code-attachment-styles': 4 }
      },
      {
        id: 'opt-wtd-oth-escape',
        textAr: 'الهروب بمجرد بدء أي نقاش صريح',
        insightAr: 'وفق جون جوتمان: محاولة تجنب الاستثارة العصبية الحادة (Flooding) بالانسحاب الفوري.',
        weightTags: { gottman: 4, 'emotion-regulation': 3, 'code-emotion-regulation': 3 }
      },
      {
        id: 'opt-wtd-oth-moody',
        textAr: 'تقلب سريع بين القرب المفاجئ والابتعاد',
        insightAr: 'حسب علم النفس العلائقي: صراع بين الرغبة في الأمان والخوف من فقدان الاستقلالية.',
        weightTags: { attachment: 4, 'schema-therapy': 3 }
      },
      {
        id: 'opt-wtd-oth-busy',
        textAr: 'التحجج الدائم بضيق الوقت والانشغال المفرط',
        insightAr: 'حسب نظرية الاختيار لجلاسر: وسيلة غير واعية للتحكم في المسافة العاطفية بينكما.',
        weightTags: { 'choice-theory': 3, 'code-motives-goals': 3 }
      }
    ]
  },
  {
    id: 'q-withd-oth-trigger',
    questionAr: 'ما الدافع الأقرب لهروبه إلى الصمت والتجاهل؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'الذكاء العاطفي والتنظيم الانفعالي — دانييل جولمان (Daniel Goleman)',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-wtd-oth-incapable',
        textAr: 'عجز في مهارات التعبير ومواجهة الخلاف',
        insightAr: 'حسب الذكاء العاطفي: فقر المفردات العاطفية يجعل الصمت ملجأه الوحيد لتفادي العجز.',
        weightTags: { eq: 4, nvc: 4, 'code-emotion-regulation': 4 }
      },
      {
        id: 'opt-wtd-oth-punish',
        textAr: 'استخدام الصمت كسلاح ضغط وهيمنة',
        insightAr: 'وفق علم النفس السلوكي: الصمت العقابي أداة لفرض السيطرة وإجبار الطرف المقابل على التراجع.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 4 }
      },
      {
        id: 'opt-wtd-oth-fear',
        textAr: 'خوف من تصاعد الموقف وحدوث قطيعة',
        insightAr: 'حسب نظرية النظم: هروب بدائي لخفض حرارة الموقف وتفادي الانفجار.',
        weightTags: { 'stress-allostasis': 3, 'code-threats-fears': 3 }
      },
      {
        id: 'opt-wtd-oth-space',
        textAr: 'حاجة حادة للعزلة واسترجاع طاقته المستنزفة',
        insightAr: 'حسب علم الأعصاب: استنزاف بطاريته الاجتماعية يدفعه للانعزال لإعادة الشحن.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
      }
    ]
  },
  {
    id: 'q-withd-oth-reaction',
    questionAr: 'كيف يتصرف الطرف الآخر عندما تحاول كسر صمته؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نموذج تنظيم الانفعالات — د. جيمس جروس (James J. Gross)',
    codeBadge: 'الشيفرة: التهديدات والمخاوف',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-wtd-oth-deeper',
        textAr: 'يزداد بروداً وينسحب بشكل أعمق',
        insightAr: 'حسب علاج المخططات: يرى في الإلحاح تهديداً لحدوده فيتصلب دفاعياً.',
        weightTags: { attachment: 5, cbt: 3, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-wtd-oth-deflect',
        textAr: 'يغير الموضوع أو يتحجج بالانشغال',
        insightAr: 'وفق نموذج جروس: استراتيجية تحويل الانتباه لتفادي مواجهة المشاعر الصعبة.',
        weightTags: { 'emotion-regulation': 4, 'code-coping-mechanisms': 4 }
      },
      {
        id: 'opt-wtd-oth-attack',
        textAr: 'ينفعل ويهاجم دفاعاً عن عزلته',
        insightAr: 'حسب علم التوازن العصبي: استجابة دفاعية سريعة لردع أي محاولة لاقتحام مساحته.',
        weightTags: { 'stress-allostasis': 4, 'code-threats-fears': 3 }
      },
      {
        id: 'opt-wtd-oth-ignore',
        textAr: 'يتجاهل المحاولة كأن شيئاً لم يحدث',
        insightAr: 'حسب نظرية التنافر المعرفي: إنكار وجود مشكلة لتفادي كلفة النقاش والاعتراف.',
        weightTags: { cbt: 4, 'code-thoughts-appraisals': 3 }
      }
    ]
  }
];

export const WITHDRAWAL_SELF_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-withd-slf-pattern',
    questionAr: 'متى تجد نفسك تميل للانسحاب وتجاهل الرد على الناس (السحب)؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية التعلّق وأنماط الحماية — جون بولبي (John Bowlby)',
    codeBadge: 'الشيفرة: أنماط التعلّق',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-wtd-slf-drain',
        textAr: 'عندما أشعر بالإرهاق الاجتماعي ونفاد طاقتي',
        insightAr: 'حسب سوزان كين: تفريغ الحمل الحسي وإعادة شحن البطارية الاجتماعية المستنزفة.',
        weightTags: { eq: 4, 'code-somatic-biology': 4 }
      },
      {
        id: 'opt-wtd-slf-conflict',
        textAr: 'لتفادي أي نقاش صدامي أو حاد يوترني',
        insightAr: 'وفق بولبي: هروب تجنبي لحماية الأمان الداخلي وتفادي التوتر العصبي.',
        weightTags: { attachment: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-wtd-slf-useless',
        textAr: 'عندما أشعر أن كلامي لن يغير شيئاً في الموقف',
        insightAr: 'حسب عقلية التكيف: يأس مكتسب يدفع للصمت السلبي بديلاً عن المحاولة.',
        weightTags: { cbt: 3, 'code-beliefs-assumptions': 3 }
      },
      {
        id: 'opt-wtd-slf-anger',
        textAr: 'كرغبة في الصمت لحماية نفسي من الانفعال',
        insightAr: 'وفق الذكاء العاطفي: فرملة واعية لتفادي التفوه بكلمات جارحة لحظة الغضب.',
        weightTags: { eq: 4, 'code-emotion-regulation': 4 }
      }
    ]
  },
  {
    id: 'q-withd-slf-feeling',
    questionAr: 'ما الحاجة النفسية أو الخوف الذي يجعلك تصمت وتنسحب؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'هرم ماسلو للحاجات — أبراهام ماسلو (Abraham Maslow)',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-wtd-slf-safety',
        textAr: 'حاجتي الشديدة للسلام والأمان النفسي',
        insightAr: 'حسب ماسلو: حماية الأمان الداخلي تتقدم على أي تواصل اجتماعي مهدد.',
        weightTags: { maslow: 4, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-wtd-slf-incapable',
        textAr: 'عجزي عن التعبير عن مشاعري بوضوح',
        insightAr: 'حسب الذكاء العاطفي: صعوبة تسمية المشاعر تحول الألم إلى صمت وانسحاب.',
        weightTags: { eq: 4, nvc: 4 }
      },
      {
        id: 'opt-wtd-slf-control',
        textAr: 'رغبتي في وضع مسافة وحماية حدودي',
        insightAr: 'وفق نظرية الاختيار: السيطرة على المسافة هي الطريقة الوحيدة للشعور بالحرية.',
        weightTags: { 'choice-theory': 4, 'code-boundaries-assertiveness': 4 }
      },
      {
        id: 'opt-wtd-slf-fear-loss',
        textAr: 'خوفي من تصاعد الخلاف والوصول للقطيعة',
        insightAr: 'وفق CBT: فكرة كارثية ترى في النقاش بداية النهاية للعلاقة.',
        weightTags: { cbt: 4, 'code-threats-fears': 3 }
      }
    ]
  },
  {
    id: 'q-withd-slf-payoff',
    questionAr: 'ما المكسب اللحظي الذي يمنحه لك هذا الانسحاب؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
    codeBadge: 'الشيفرة: المكافأة والتعزيز',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-wtd-slf-relief',
        textAr: 'راحة فورية وتسكين سريع للضغط العصبي',
        insightAr: 'حسب جلاسر: مكسب التجنب السريع (Avoidance Payoff) الذي يخفف القلق فوراً.',
        weightTags: { 'choice-theory': 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-wtd-slf-delay',
        textAr: 'تأجيل مواجهة الصراع وتفادي الإحراج',
        insightAr: 'حسب CBT: راحة لحظية من كلفة المواجهة مقابل زيادة تراكمها لاحقاً.',
        weightTags: { cbt: 4, 'code-reward-reinforcement': 3 }
      },
      {
        id: 'opt-wtd-slf-energy',
        textAr: 'حماية طاقتي الذهنية من الاستنزاف',
        insightAr: 'وفق كيمياء الأعصاب: وقف استنزاف الكورتيزول بالحصول على عزلة آمنة.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
      },
      {
        id: 'opt-wtd-slf-calm-down',
        textAr: 'فرصة للهدوء قبل اتخاذ أي قرار',
        insightAr: 'وفق تنظيم المشاعر: التهدئة الفسيولوجية تتيح للفص الجبهي استعادة السيطرة.',
        weightTags: { 'emotion-regulation': 4, eq: 3 }
      }
    ]
  }
];

// ============================================================================
// 4. ردود الفعل الانفعالية وسرعة الغضب (Emotional Spark & Amygdala Hijack)
// ============================================================================

export const EMOTIONAL_REACTION_OTHER_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-react-oth-spark',
    questionAr: 'ما الموقف الذي يفجر غضب وعصبية الطرف الآخر عادة؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم الأعصاب الانفعالي — د. ليزا فيلدمان باريت (Lisa Feldman Barrett)',
    codeBadge: 'الشيفرة: المثيرات والعادات',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-rc-oth-disrespect',
        textAr: 'شعوره بعدم الامتثال لأوامره أو مقاطعته',
        insightAr: 'حسب ليزا باريت: يفسر الدماغ نبرة المقاطعة كتهديد وجودي للمكانة فيقاتل.',
        weightTags: { cbt: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-rc-oth-criticism',
        textAr: 'تعرضه لأي انتقاد مباشر أو تصحيح لخطئه',
        insightAr: 'حسب علاج المخططات: يلمس النقد جرح الهشاشة فيستجيب بهجوم مضاد.',
        weightTags: { 'schema-therapy': 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-rc-oth-surprise',
        textAr: 'عند تعرضه لضغط مفاجئ أو تعطل خططه',
        insightAr: 'وفق علم التوازن العصبي: امتلاء الذاكرة العاملة ينهار معه كابح الغضب الفوري.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
      },
      {
        id: 'opt-rc-oth-control-loss',
        textAr: 'عند شعوره بفقدان السيطرة على المحيطين',
        insightAr: 'حسب نظرية الاختيار: الغضب وسيلة قسرية لإجبار الآخرين على الانصياع.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 4 }
      }
    ]
  },
  {
    id: 'q-react-oth-style',
    questionAr: 'كيف يعبر الطرف الآخر عن انفعاله وغضبه معك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'العلاج السلوكي الجدلي DBT — د. مارشا لينهان (Marsha Linehan)',
    codeBadge: 'الشيفرة: تنظيم الانفعالات',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-rc-oth-yelling',
        textAr: 'بالصراخ والكلمات القاسية والاتهامات',
        insightAr: 'حسب DBT: اختطاف لوزي حاد وتفريغ انفعالي غير موجه.',
        weightTags: { dbt: 4, 'code-emotion-regulation': 4 }
      },
      {
        id: 'opt-rc-oth-stonewall',
        textAr: 'بالصمت البارد والتجاهل والتحديق الحاد',
        insightAr: 'وفق جوتمان: انسحاب غاضب يهدف لمعاقبة الطرف المقابل وإشعاره بالذنب.',
        weightTags: { gottman: 4, 'code-communication-dynamics': 4 }
      },
      {
        id: 'opt-rc-oth-threat',
        textAr: 'بالتهديد بالقطيعة أو بالانتقام',
        insightAr: 'حسب نظرية الاختيار: محاولة فرض القوة عبر الترويع النفسي.',
        weightTags: { 'choice-theory': 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-rc-oth-blame',
        textAr: 'بلوم المحيطين وتصوير نفسه ضحية لإهمالهم',
        insightAr: 'حسب CBT: انحياز الإسناد الخارجي لتبرئة النفس من المسؤولية.',
        weightTags: { cbt: 4, 'code-cognitive-biases': 3 }
      }
    ]
  },
  {
    id: 'q-react-oth-payoff',
    questionAr: 'ما المكسب اللحظي الخفي لانفعاله وعصبيته في نظرك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
    codeBadge: 'الشيفرة: المكافأة والتعزيز',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-rc-oth-dominate',
        textAr: 'إجبار الجميع على التراجع والخضوع لرغبته',
        insightAr: 'وفق نظرية التعزيز: استجابة المحيطين بالخضوع تثبت الغضب كسلوك ناجح لديه.',
        weightTags: { 'choice-theory': 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-rc-oth-dump',
        textAr: 'تفريغ توتر داخلي عاجز عن ضبطه بهدوء',
        insightAr: 'حسب كيمياء الأعصاب: الصراخ يفرغ شحنات الأدرينالين المتراكمة بالجسد.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
      },
      {
        id: 'opt-rc-oth-shield',
        textAr: 'إخفاء شعوره بالخطأ وراء درع الهجوم',
        insightAr: 'حسب علاج المخططات: الهجوم أفضل وسيلة دفاعية لمنع كشف هشاشته.',
        weightTags: { 'schema-therapy': 4, 'code-threats-fears': 3 }
      },
      {
        id: 'opt-rc-oth-victim',
        textAr: 'ابتزاز التعاطف وجعل المحيطين يعتذرون له',
        insightAr: 'وفق مثلث كاربمان: التحول السريع بين دور الجلاد والضحية لانتزاع المكاسب.',
        weightTags: { 'schema-therapy': 3, 'code-motives-goals': 3 }
      }
    ]
  }
];

export const EMOTIONAL_REACTION_SELF_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-react-slf-spark',
    questionAr: 'ما الشرارة التي تسبق ردّة فعلك الغاضبة عادة؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم الأعصاب الانفعالي — د. ليزا فيلدمان باريت (Lisa Feldman Barrett)',
    codeBadge: 'الشيفرة: المثيرات والعادات',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-rc-slf-disrespect',
        textAr: 'شعوري بنبرة تقلل من احترامي وقيمتي',
        insightAr: 'حسب ليزا باريت: يفسر الدماغ نبرة التقليل كتهديد وجودي للمكانة فيقاتل.',
        weightTags: { cbt: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-rc-slf-ignored',
        textAr: 'تجاهل أو إهمال كلامي واحتياجاتي',
        insightAr: 'وفق نظرية التعلّق: التجاهل يوقظ جرح الإهمال القديم فيضاعف الغضب.',
        weightTags: { attachment: 4, 'code-attachment-styles': 3 }
      },
      {
        id: 'opt-rc-slf-overload',
        textAr: 'تراكم الأعباء والضغوط حتى نفاد طاقتي',
        insightAr: 'حسب الحمل الإدراكي: امتلاء الذاكرة العاملة ينهار معه كابح الغضب.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 4 }
      },
      {
        id: 'opt-rc-slf-helpless',
        textAr: 'إحساسي بالعجز أو الظلم في الموقف',
        insightAr: 'حسب التواصل اللاعنفي: الغضب رسالة عن حاجة عدالة أصيلة غير مشبعة.',
        weightTags: { nvc: 4, 'code-values-conscience': 3 }
      }
    ]
  },
  {
    id: 'q-react-slf-body',
    questionAr: 'ما التغير الجسدي أو العصبي الذي يباغتك في تلك اللحظة؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'العلاج السلوكي الجدلي DBT — د. مارشا لينهان (Marsha Linehan)',
    codeBadge: 'الشيفرة: تنظيم الانفعالات',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-rc-slf-heat',
        textAr: 'حرارة بالوجه وخفقان ورغبة بالصراخ',
        insightAr: 'حسب DBT: اختطاف لوزي حاد يتطلب تبريداً فسيولوجياً عاجلاً (مهارة TIPP).',
        weightTags: { dbt: 4, 'code-somatic-biology': 4 }
      },
      {
        id: 'opt-rc-slf-tense',
        textAr: 'تشنج في العضلات واندفاع للكلام الحاد',
        insightAr: 'وفق علم التوازن العصبي: تدفق الأدرينالين يدفع للأفعال الدفاعية السريعة.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
      },
      {
        id: 'opt-rc-slf-choke',
        textAr: 'ثقل في الصدر وشعور بالاختناق والضيق',
        insightAr: 'حسب ACT: الكبت اللحظي يحول التوتر لشحنة جسدية مؤلمة في الصدر.',
        weightTags: { act: 4, 'code-emotions-affect': 4 }
      },
      {
        id: 'opt-rc-slf-hijack',
        textAr: 'انفصال سريع عن التعقل (يفصل مخي)',
        insightAr: 'حسب جولمان: الاختطاف اللوزي يعطل الفص الجبهي التفكيري لمدة 20 دقيقة.',
        weightTags: { eq: 4, 'code-emotion-regulation': 4 }
      }
    ]
  },
  {
    id: 'q-react-slf-payoff',
    questionAr: 'ما المكسب الفوري أو النتيجة لانفعالك في البداية؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
    codeBadge: 'الشيفرة: المكافأة والتعزيز',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-rc-slf-relief',
        textAr: 'تفريغ فوري للضغط المكبوت ولو تبعه ندم',
        insightAr: 'حسب جلاسر: تفريغ شحنة الألم يقدم راحة لحظية خادعة تثبت السلوك.',
        weightTags: { 'choice-theory': 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-rc-slf-boundaries',
        textAr: 'إيقاف الآخرين عن التمادي ووضع حد لهم',
        insightAr: 'حسب الحزم النفسي: استخدام الغضب كبديل بدائي لغياب مهارات التوكيد الهادئ.',
        weightTags: { 'choice-theory': 3, 'code-boundaries-assertiveness': 4 }
      },
      {
        id: 'opt-rc-slf-power',
        textAr: 'استعادة الشعور بالقوة بعد إحساس بالعجز',
        insightAr: 'وفق علم النفس الفردي: الغضب محاولة فورية لقلب موازين القوة.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 3 }
      },
      {
        id: 'opt-rc-slf-heard',
        textAr: 'إجبار الطرف المقابل على الاستماع والانتباه',
        insightAr: 'حسب NVC: الصراخ محاولة يائسة لجعل الطرف المقابل يسمع الألم الداخلي.',
        weightTags: { nvc: 4, 'code-communication-dynamics': 3 }
      }
    ]
  }
];

// ============================================================================
// 5. التسويف والمماطلة (Procrastination & Dopamine Escape)
// ============================================================================

export const PROCRASTINATION_SELF_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-proc-slf-trick',
    questionAr: 'ما الحيلة الذهنية التي تقنعك بالتأجيل في تلك اللحظة؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'العلاج المعرفي السلوكي CBT — د. آرون بيك (Aaron T. Beck)',
    codeBadge: 'الشيفرة: الأفكار والتفسيرات',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-pr-slf-tomorrow',
        textAr: 'سأبدأ غداً بطاقة أفضل ومزاج أروق',
        insightAr: 'حسب CBT: انحياز التفاؤل غير الواقعي تجاه نسخة المستقبل من أنفسنا.',
        weightTags: { cbt: 4, 'code-thoughts-appraisals': 4 }
      },
      {
        id: 'opt-pr-slf-perfect',
        textAr: 'المهمة صعبة وتحتاج وقتاً طويلاً ومثالية',
        insightAr: 'وفق كيمياء الأعصاب: استعظام المهمة يفعل مراكز الألم بالدماغ فيهرب للجوال.',
        weightTags: { fogg: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-pr-slf-reward-first',
        textAr: 'أحتاج لمكافأة سريعة بالجوال قبل البدء',
        insightAr: 'حسب حلقات العادات: طلب الدوبامين السهل يؤخر البدء في العمل ذي المكافأة المؤجلة.',
        weightTags: { 'habit-loops': 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-pr-slf-later',
        textAr: 'ما زال هناك وقت كافٍ للموعد النهائي',
        insightAr: 'وفق قانون باركنسون: العمل يتمدد ليمتد في الوقت المتاح لإنجازه.',
        weightTags: { cbt: 3, 'code-cognitive-biases': 3 }
      }
    ]
  },
  {
    id: 'q-proc-slf-emotion',
    questionAr: 'ما الشعور الدفين الذي تهرب منه بالتسويف؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علاج القبول والالتزام ACT — د. ستيفن هايز (Steven C. Hayes)',
    codeBadge: 'الشيفرة: المشاعر والانفعالات',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-pr-slf-fear-fail',
        textAr: 'الخوف من الفشل أو ألا تخرج النتيجة مثالية',
        insightAr: 'حسب ACT: تجنب الضيق المرتبط بالتقييم والخوف من النقد.',
        weightTags: { act: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-pr-slf-boredom',
        textAr: 'الشعور بالملل وثقل المهمة غير المحفزة',
        insightAr: 'وفق SDT: غياب الدافع الذاتي الداخلي يحول المهمة لعبء ثقيل.',
        weightTags: { sdt: 4, 'code-psych-needs': 3 }
      },
      {
        id: 'opt-pr-slf-rebellion',
        textAr: 'مقاومة داخلية للأوامر والإلزام المفروض',
        insightAr: 'حسب نظرية الاختيار: تمرد غير واعٍ لحماية الشعور بالحرية والاستقلالية.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 3 }
      },
      {
        id: 'opt-pr-slf-fog',
        textAr: 'التشتت والإرهاق الذهني وتدني الطاقة',
        insightAr: 'حسب علم النوم والإيقاع الحيوي: نقص النوم يضعف قوة الإرادة بنسبة 40%.',
        weightTags: { 'sleep-circadian': 4, 'code-somatic-biology': 4 }
      }
    ]
  }
];

export const PROCRASTINATION_OTHER_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-proc-oth-pattern',
    questionAr: 'كيف تظهر مماطلة وتسويف الطرف الآخر في التزاماته؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم العادات والنمط السلوكي — تشارلز دوهيج (Charles Duhigg)',
    codeBadge: 'الشيفرة: المثيرات والعادات',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-pr-oth-busy',
        textAr: 'التحجج الدائم بضيق الوقت وتراكم المشاغل',
        insightAr: 'حسب CBT: مبررات تلقائية لتسكين التنافر المعرفي بين الواجب والفعل.',
        weightTags: { cbt: 4, 'code-thoughts-appraisals': 4 }
      },
      {
        id: 'opt-pr-oth-rush',
        textAr: 'تأجيل المهمة حتى اللحظة الأخيرة ثم الاستعجال',
        insightAr: 'وفق علم التوتر: الاعتماد على أدرينالين اللحظة الأخيرة كدافع وحيد للإنجاز.',
        weightTags: { 'stress-allostasis': 4, 'code-reward-reinforcement': 3 }
      },
      {
        id: 'opt-pr-oth-blame',
        textAr: 'إلقاء اللوم على الظروف والآخرين لتبرير التأخير',
        insightAr: 'حسب انحياز الإسناد: إلقاء المسؤولية على العوامل الخارجية لتفادي الإحراج.',
        weightTags: { cbt: 3, 'code-cognitive-biases': 4 }
      },
      {
        id: 'opt-pr-oth-promise',
        textAr: 'الوعد المتكرر بالإنجاز دون أي تنفيذ ملموس',
        insightAr: 'وفق نظرية تقرير المصير: وعود لإرضاء المحيطين مؤقتاً بغياب النية الحقيقية.',
        weightTags: { sdt: 3, 'code-motives-goals': 3 }
      }
    ]
  },
  {
    id: 'q-proc-oth-motive',
    questionAr: 'ما الدافع النفسي الأرجح وراء مماطلته المستمرة في نظرك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نموذج فوج السلوكي B=MAP — د. بي جي فوج (BJ Fogg)',
    codeBadge: 'الشيفرة: الأهداف والدوافع',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-pr-oth-fear-crit',
        textAr: 'خوف خفي من التعرض للتقييم والنقد والفشل',
        insightAr: 'حسب علاج المخططات: تجنب إنجاز العمل لتفادي مواجهة حكم الآخرين عليه.',
        weightTags: { 'schema-therapy': 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-pr-oth-depend',
        textAr: 'اتكالية على الآخرين لإنقاذ الموقف عنه',
        insightAr: 'حسب علم النظم: تعود الطرف الآخر على تدخل المحيطين يثبت سلوك الكسل لديه.',
        weightTags: { 'choice-theory': 4, 'code-social-influence': 4 }
      },
      {
        id: 'opt-pr-oth-easy-dop',
        textAr: 'الهروب للمشتتات الترفيهية الفورية والسهلة',
        insightAr: 'حسب نموذج فوج: سهولة الفعل الترفيهي تجعله الخيار الافتراضي للدماغ.',
        weightTags: { fogg: 4, 'code-habits-triggers': 4 }
      },
      {
        id: 'opt-pr-oth-disorgan',
        textAr: 'صعوبة حقيقية في التخطيط وإدارة الوقت والتركيز',
        insightAr: 'وفق الوظائف التنفيذية للدماغ: ضعف مهارات التجزئة والتنظيم الذهني للمهام.',
        weightTags: { 'growth-mindset': 3, 'code-decision-styles': 4 }
      }
    ]
  }
];

// ============================================================================
// 6. الغيرة والمقارنة الاجتماعية (Social Comparison & Envy)
// ============================================================================

export const JEALOUSY_SELF_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-jls-slf-spark',
    questionAr: 'متى تشتعل لديك مشاعر الغيرة أو المقارنة بالآخرين؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية المقارنة الاجتماعية — ليون فيستنجر (Leon Festinger)',
    codeBadge: 'الشيفرة: التأثير والضغط الاجتماعي',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-jl-slf-peer',
        textAr: 'عند رؤية إنجاز شخص في نفس عمري أو مجالي',
        insightAr: 'حسب فيستنجر: المقارنة الاجتماعية تشتعل بأقصى قوة مع الأقران المماثلين لنا.',
        weightTags: { cbt: 4, 'code-social-influence': 4 }
      },
      {
        id: 'opt-jl-slf-stuck',
        textAr: 'عند شعوري بالركود والتأخر في أهدافي الخاصة',
        insightAr: 'وفق عقلية النمو: تفسير تقدم الآخر كدليل على عجزنا بدلاً من كونه مصدر إلهام.',
        weightTags: { 'growth-mindset': 4, 'code-beliefs-assumptions': 4 }
      },
      {
        id: 'opt-jl-slf-praise',
        textAr: 'عندما أرى ثناء الآخرين عليه وتجاهل جهدي',
        insightAr: 'حسب ماسلو: حاجة التقدير والاعتراف الجائعة تتألم عند توجيه المديح لغيرنا.',
        weightTags: { maslow: 4, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-jl-slf-social-media',
        textAr: 'بمجرد تصفح السوشل ميديا ومقارنة المظاهر',
        insightAr: 'وفق علم النفس المعرفي: مقارنة كواليس حياتنا الواقعية بأبرز لقطات الآخرين.',
        weightTags: { cbt: 4, 'code-cognitive-biases': 3 }
      }
    ]
  },
  {
    id: 'q-jls-slf-thought',
    questionAr: 'ما الفكرة التلقائية التي تصاحب شعور المقارنة في ذهنك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'العلاج المعرفي السلوكي CBT — د. آرون بيك (Aaron T. Beck)',
    codeBadge: 'الشيفرة: الأفكار والتفسيرات',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-jl-slf-not-enough',
        textAr: 'أشعر أنني متأخر أو غير كافٍ ومقصر',
        insightAr: 'حسب CBT: تشويه التصفية السلبية وتجاهل كل ما أنجزته حتى الآن.',
        weightTags: { cbt: 4, 'code-thoughts-appraisals': 4 }
      },
      {
        id: 'opt-jl-slf-scarcity',
        textAr: 'الاعتقاد بأن الفرص محدودة وأن نجاحه ينقص حظي',
        insightAr: 'وفق علم النفس الإيجابي: عقلية الندرة توهمك أن مكسب غيرك يعني خسارتك.',
        weightTags: { 'positive-psych': 4, 'code-beliefs-assumptions': 4 }
      },
      {
        id: 'opt-jl-slf-unfair',
        textAr: 'الشعور بعدم العدالة وأن جهدي لا يُثمر مثله',
        insightAr: 'حسب NVC: التعبير المشوه عن حاجة عميقة للجدوى والأثر الملموس.',
        weightTags: { nvc: 3, 'code-values-conscience': 3 }
      },
      {
        id: 'opt-jl-slf-fear-inferior',
        textAr: 'الخوف من أن ينظر لي الآخرون بدونية وأقل شأناً',
        insightAr: 'حسب علاج المخططات: استثارة مخطط عدم الكفاءة ومخاوف التهميش.',
        weightTags: { 'schema-therapy': 4, 'code-threats-fears': 4 }
      }
    ]
  }
];

export const JEALOUSY_OTHER_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-jls-oth-pattern',
    questionAr: 'كيف تظهر غيرة أو حسد الطرف الآخر تجاهك وتجاه المحيطين؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم النفس الفردي — ألفريد أدلر (Alfred Adler)',
    codeBadge: 'الشيفرة: المشاعر والانفعالات',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-jl-oth-belittle',
        textAr: 'التقليل المبطن من أي نجاح أو مقتنى تحققه',
        insightAr: 'حسب أدلر: تسفيه إنجاز الآخر آلية دفاعية لحماية الصورة الذاتية الهشة.',
        weightTags: { cbt: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-jl-oth-cold',
        textAr: 'البرود المفاجئ والتجاهل عند سماع أخبارك السارة',
        insightAr: 'وفق نظرية المقارنة: عجز عن التعبير عن الفرح لمشاعر النقص المشتعلة داخله.',
        weightTags: { eq: 4, 'code-emotion-regulation': 4 }
      },
      {
        id: 'opt-jl-oth-rival',
        textAr: 'محاولة التنافس ومجاراة كل ما تفعله لإثبات التفوق',
        insightAr: 'حسب نظرية الاختيار: صراع محموم لانتزاع المكانة وإشباع حاجة القوة.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 4 }
      },
      {
        id: 'opt-jl-oth-sarcasm',
        textAr: 'تلميحات ساخرة ومحاولة تصيد الأخطاء أمام الناس',
        insightAr: 'حسب جوتمان: الازدراء والسخرية سلاح هجومي لتعديل الكفة لصالحه.',
        weightTags: { gottman: 4, 'code-communication-dynamics': 4 }
      }
    ]
  },
  {
    id: 'q-jls-oth-motive',
    questionAr: 'ما الذي يحرك هذه الغيرة لدى الطرف الآخر في نظرك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'هرم ماسلو للحاجات — أبراهام ماسلو (Abraham Maslow)',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-jl-oth-inferior',
        textAr: 'شعور دفين بالنقص والدونية يهدده نجاحك',
        insightAr: 'حسب أدلر: عقدة النقص تجعله يرى في تميزك مرآة تفضحه فيقاتلها.',
        weightTags: { cbt: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-jl-oth-scarcity',
        textAr: 'عقلية الندرة واعتقاده أن أضواءك تسلبه الاهتمام',
        insightAr: 'وفق علم النفس الاجتماعي: الخوف من فقدان المركزية والحضور الاجتماعي.',
        weightTags: { maslow: 4, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-jl-oth-hunger',
        textAr: 'جوع حاد لحاجة التقدير غير المشبعة لديه',
        insightAr: 'حسب ماسلو: حرمان التقدير في بيئته يجعله يتحسس من ثناء الآخرين عليك.',
        weightTags: { maslow: 4, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-jl-oth-insecure',
        textAr: 'هشاشة أمانه الداخلي واعتماده على مقارنة نفسه بالغير',
        insightAr: 'حسب المخططات: مخطط الاستحقاق المشروط يجعل قيمته مرتبطة بتفوقه فقط.',
        weightTags: { 'schema-therapy': 4, 'code-beliefs-assumptions': 4 }
      }
    ]
  }
];

// ============================================================================
// 7. إرضاء الناس المفرط وصعوبة الرفض (People Pleasing & Boundaries)
// ============================================================================

export const PEOPLE_PLEASING_SELF_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-ppl-slf-reason',
    questionAr: 'ما الذي يجعلك توافق وتتحمل فوق طاقتك على حساب نفسك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'التواصل اللاعنفي وإدارة الحدود — د. مارشال روزنبرج (Marshall Rosenberg)',
    codeBadge: 'الشيفرة: الحدود والتوكيد',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-pp-slf-fear-reject',
        textAr: 'الخوف من خسارة ود الناس أو إغضابهم',
        insightAr: 'وفق نظرية التعلّق: الخوف من الهجر والرفض يدفع للتضحية بالحدود الذاتية.',
        weightTags: { attachment: 4, 'code-attachment-styles': 4 }
      },
      {
        id: 'opt-pp-slf-guilt',
        textAr: 'شعوري بالذنب الشديد وتأنيب الضمير لو رفضت',
        insightAr: 'حسب علاج المخططات: مخطط التضحية بالذات يفسر رفض طلبات الغير كأنانية.',
        weightTags: { 'schema-therapy': 4, 'code-beliefs-assumptions': 4 }
      },
      {
        id: 'opt-pp-slf-worth',
        textAr: 'اعتقادي بأن قيمتي مرتبطة بإسعاد من حولي',
        insightAr: 'حسب CBT: قاعدة معرفية مشوهة تربط الاستحقاق والقبول بتقديم الخدمات المستمر.',
        weightTags: { cbt: 4, 'code-values-conscience': 4 }
      },
      {
        id: 'opt-pp-slf-conflict',
        textAr: 'تجنب أي حرج أو صدام مباشر يوترني',
        insightAr: 'وفق الذكاء العاطفي: الهروب من الموقف الصعب الفوري وتأجيل كلفة التعب لاحقاً.',
        weightTags: { eq: 3, 'code-threats-fears': 3 }
      }
    ]
  },
  {
    id: 'q-ppl-slf-cost',
    questionAr: 'ما الكلفة التي تدفعها بعد قبولك طلبات فوق استطاعتك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علاج المخططات التكيفية — د. جيفري يونغ (Jeffrey Young)',
    codeBadge: 'الشيفرة: المكافأة والتعزيز',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-pp-slf-drain',
        textAr: 'استنزاف طاقتي ووقتي على حساب أولوياتي وصحتي',
        insightAr: 'وفق التوازن العصبي: استنزاف مزمن للطاقة يؤدي للإنهاك العاطفي (Burnout).',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 4 }
      },
      {
        id: 'opt-pp-slf-resentment',
        textAr: 'تراكم استياء وضيق داخلي صامت تجاه من طلبت منه',
        insightAr: 'حسب NVC: العطاء القسري يولد استياءً دفيناً يسمم العلاقات لاحقاً.',
        weightTags: { nvc: 4, 'code-values-conscience': 3 }
      },
      {
        id: 'opt-pp-slf-exploited',
        textAr: 'إحساس بالاستغلال وضعف الشخصية والندم',
        insightAr: 'حسب علاج المخططات: تأكيد مخطط الخضوع يضعف تقدير الذات والفاعلية.',
        weightTags: { 'schema-therapy': 4, 'code-threats-fears': 3 }
      },
      {
        id: 'opt-pp-slf-anxiety',
        textAr: 'قلق دائم من التقصير والوقوع في الخطأ',
        insightAr: 'حسب CBT: دوامة إرضاء الناس ترفع سقف التوقعات المستحيلة.',
        weightTags: { cbt: 3, 'code-thoughts-appraisals': 3 }
      }
    ]
  }
];

export const PEOPLE_PLEASING_OTHER_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-ppl-oth-pattern',
    questionAr: 'كيف يظهر نمط إرضاء الناس المفرط لدى الطرف الآخر؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'التواصل اللاعنفي وإدارة الحدود — د. مارشال روزنبرج (Marshall Rosenberg)',
    codeBadge: 'الشيفرة: الحدود والتوكيد',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-pp-oth-yes',
        textAr: 'الموافقة الفورية على طلبات المحيطين ولو أرهقته',
        insightAr: 'وفق نظرية التعلّق: آلية استرضاء قهرية لتأمين القبول وتفادي الهجر.',
        weightTags: { attachment: 4, 'code-attachment-styles': 4 }
      },
      {
        id: 'opt-pp-oth-apology',
        textAr: 'الاعتذار الدائم والتبرير حتى دون أي خطأ منه',
        insightAr: 'حسب علاج المخططات: شعور دائم بالمسؤولية المفرطة عن مشاعر الآخرين.',
        weightTags: { 'schema-therapy': 4, 'code-beliefs-assumptions': 4 }
      },
      {
        id: 'opt-pp-oth-silent',
        textAr: 'السكوت عن حقه وتفضيل مصلحة الغير دائماً',
        insightAr: 'حسب الحزم النفسي: كبت الحاجات الذاتية خوفاً من إثارة استياء أحد.',
        weightTags: { nvc: 4, 'code-boundaries-assertiveness': 4 }
      },
      {
        id: 'opt-pp-oth-fear-critic',
        textAr: 'الخوف الواضح من أي عتاب ومحاولة استرضاء الجميع',
        insightAr: 'وفق CBT: حساسية مفرطة تجاه الرفض تجعله رهينة لاستحسان المحيطين.',
        weightTags: { cbt: 3, 'code-threats-fears': 4 }
      }
    ]
  },
  {
    id: 'q-ppl-oth-motive',
    questionAr: 'ما الدافع النفسي الأعمق لسلوكه في إرضاء الناس في نظرك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علاج المخططات التكيفية — د. جيفري يونغ (Jeffrey Young)',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-pp-oth-abandon',
        textAr: 'خوف شديد من الرفض والتخلي والوحدة',
        insightAr: 'حسب نظرية التعلّق: الاعتقاد بأن المحبة مشروطة بطاعة وخدمة الآخرين.',
        weightTags: { attachment: 4, 'code-attachment-styles': 4 }
      },
      {
        id: 'opt-pp-oth-fragile',
        textAr: 'هشاشة في تقدير الذات واعتماد قيمته على ثناء الغير',
        insightAr: 'وفق نظرية تقرير المصير: غياب المصدر الداخلي للثقة والاستحقاق.',
        weightTags: { sdt: 4, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-pp-oth-peace',
        textAr: 'تجنب الصراع بأي ثمن لشعوره بعدم الأمان في الخلاف',
        insightAr: 'حسب نظرية النظم: الخوف من الفوضى يدفعه لشراء السلام اللحظي بالتنازل.',
        weightTags: { 'choice-theory': 3, 'code-threats-fears': 3 }
      },
      {
        id: 'opt-pp-oth-strict',
        textAr: 'تربية صارمة ألزمته بالطاعة وكبت الرغبات الشخصية',
        insightAr: 'حسب التعلّم الاجتماعي: مخطط الخضوع المكتسب من بيئة أسرية صارمة.',
        weightTags: { 'schema-therapy': 4, 'code-social-influence': 3 }
      }
    ]
  }
];

// ============================================================================
// 8. محاولات السيطرة والتسلط وفرض الرأي (Control & Micro-management)
// ============================================================================

export const CONTROLLING_OTHER_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-ctrl-oth-style',
    questionAr: 'كيف يمارس الطرف الآخر محاولة فرض سيطرته ورأيه؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار ومحاولات السيطرة — د. ويليام جلاسر (William Glasser)',
    codeBadge: 'الشيفرة: الأهداف والدوافع',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-ct-oth-micromanage',
        textAr: 'بالتدقيق في التفاصيل وتوجيه الأوامر الصارمة',
        insightAr: 'حسب نظرية الاختيار: وهم السيطرة الخارجية لإسكات قلق داخلي من الفوضى.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 4 }
      },
      {
        id: 'opt-ct-oth-guilt',
        textAr: 'بالإشعار بالذنب وتصوير نفسه كضحية للمحيطين',
        insightAr: 'وفق مثلث كاربمان: استخدام دور الضحية لإلزام المحيطين بالطاعة.',
        weightTags: { 'schema-therapy': 4, 'code-beliefs-assumptions': 4 }
      },
      {
        id: 'opt-ct-oth-invalidation',
        textAr: 'بالتسفيه من الآراء والتقليل من قرارات الآخرين',
        insightAr: 'حسب CBT: التشكيك لخلخلة ثقة المقابل وجعله تابعاً ومحتاجاً لتوجيهه.',
        weightTags: { cbt: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-ct-oth-anger',
        textAr: 'بالغضب الحاد أو التهديد بالقطيعة عند مخالفته',
        insightAr: 'وفق علم النفس السلوكي: توظيف الخوف كوسيلة سريعة لفرض الانصياع.',
        weightTags: { 'choice-theory': 4, 'code-threats-fears': 4 }
      }
    ]
  },
  {
    id: 'q-ctrl-oth-motive',
    questionAr: 'ما الدافع النفسي الأقرب وراء رغبته المستمرة في التحكم؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علاج المخططات التكيفية — د. جيفري يونغ (Jeffrey Young)',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-ct-oth-anxiety',
        textAr: 'قلق دفين من الفوضى ومحاولة تسكينه بالسيطرة',
        insightAr: 'حسب CBT: السيطرة الخارجية هي مخدر القلق الداخلي من المجهول.',
        weightTags: { cbt: 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-ct-oth-superior',
        textAr: 'اعتقاد استعلائي بأنه الوحيد الذي يفهم الأمور',
        insightAr: 'وفق علاج المخططات: وضعية التعويض المفرط لدرء أي شعور بالنقص.',
        weightTags: { 'schema-therapy': 4, 'code-beliefs-assumptions': 4 }
      },
      {
        id: 'opt-ct-oth-fragile',
        textAr: 'خوف عميق من كشف ضعفه أو فقدان مكانته',
        insightAr: 'حسب دروع الأنا: التشدد في السيطرة حماية لهشاشة داخلية لا تحتمل النقاش.',
        weightTags: { 'schema-therapy': 4, 'code-threats-fears': 3 }
      },
      {
        id: 'opt-ct-oth-power-hunger',
        textAr: 'حاجة غير مشبعة للقوة والاعتراف بنفوذه',
        insightAr: 'حسب جلاسر: جوع حاد لحاجة القوة ينحرف لسلوك تسلطي غير صحي.',
        weightTags: { 'choice-theory': 4, 'code-psych-needs': 4 }
      }
    ]
  }
];

export const CONTROLLING_SELF_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-ctrl-slf-motive',
    questionAr: 'ما الدافع عندما تشعر برغبة ملحة في التحكم بالمحيطين وفرض رأيك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
    codeBadge: 'الشيفرة: الأهداف والدوافع',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-ct-slf-fear-chaos',
        textAr: 'قلقي الشديد من حدوث فوضى أو أخطاء إذا لم أتدخل',
        insightAr: 'حسب نظرية الاختيار: محاولة ضبط البيئة الخارجية لتسكين قلق الفوضى الداخلي.',
        weightTags: { 'choice-theory': 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-ct-slf-efficiency',
        textAr: 'اعتقادي بأن طريقتي هي الأكثر صحة وكفاءة للجميع',
        insightAr: 'حسب CBT: مخطط المعايير الصارمة والكمالية يولد ضيقاً من أي طريقة مختلفة.',
        weightTags: { cbt: 4, 'code-beliefs-assumptions': 4 }
      },
      {
        id: 'opt-ct-slf-safety',
        textAr: 'حاجتي العميقة للشعور بالأمان عبر ضبط التفاصيل',
        insightAr: 'وفق هرم ماسلو: الحاجة للأمان واليقين تدفع للتشبث بزمام كل الأمور.',
        weightTags: { maslow: 4, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-ct-slf-mistrust',
        textAr: 'صعوبة في الثقة بقدرة الآخرين على إنجازها بإتقان',
        insightAr: 'حسب علاج المخططات: صعوبة التفويض ناجمة عن قلق عميق من التعرض للخذلان.',
        weightTags: { 'schema-therapy': 4, 'code-threats-fears': 3 }
      }
    ]
  },
  {
    id: 'q-ctrl-slf-cost',
    questionAr: 'ما الأثر الذي يتركه تدخلك الصارم على علاقتك بالمحيطين؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم العلاقات — د. جون وجولي جوتمان (John & Julie Gottman)',
    codeBadge: 'الشيفرة: ديناميكيات التواصل',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-ct-slf-rebellion',
        textAr: 'تذمر المحيطين وشعورهم بالتضييق والنفور مني',
        insightAr: 'حسب جوتمان: الانتقاد والتدقيق يثيران الدفاعية ويزيدان المسافة العاطفية.',
        weightTags: { gottman: 4, 'code-communication-dynamics': 4 }
      },
      {
        id: 'opt-ct-slf-burnout',
        textAr: 'تحملي أعباء مضاعفة واستنزافي في متابعة كل صغيرة',
        insightAr: 'وفق التوازن العصبي: استنزاف الطاقة العصبية في السيطرة على ما لا نملكه.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 4 }
      },
      {
        id: 'opt-ct-slf-conflicts',
        textAr: 'نشوب خلافات مستمرة ومقاومة صامتة لقراراتي',
        insightAr: 'حسب جلاسر: محاولات التحكم الخارجي هي المنبع الأكبر لتدمير العلاقات.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 3 }
      },
      {
        id: 'opt-ct-slf-isolation',
        textAr: 'الشعور بالوحدة والمسؤولية المنفردة عن كل شيء',
        insightAr: 'حسب نظرية النظم: عدم توزيع المسؤولية يخلق عزلة قيادية مرهقة.',
        weightTags: { 'schema-therapy': 3, 'code-psych-needs': 3 }
      }
    ]
  }
];

// ============================================================================
// 9. الأسئلة العامة التأسيسية للمنظورين (Base Questions)
// ============================================================================

export const BASE_OTHER_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-base-oth-trigger',
    questionAr: 'متى يظهر هذا التصرف على الطرف الآخر أو يتصاعد؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم العادات والنمط السلوكي — تشارلز دوهيج (Charles Duhigg)',
    codeBadge: 'الشيفرة: المثيرات والعادات',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-bs-oth-stress',
        textAr: 'عند تعرضه لضغط مفاجئ أو تهديد لمكانته',
        insightAr: 'وفق علم التوازن العصبي: استجابة دفاعية سريعة لخفض التهديد الرمزي الموجه لذاته.',
        weightTags: { 'stress-allostasis': 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-bs-oth-crowd',
        textAr: 'أمام التجمعات والناس للفت الانتباه',
        insightAr: 'حسب ماسلو: جوع التقدير والمكانة الاجتماعية يدفع لانتزاع القبول بأي وسيلة.',
        weightTags: { maslow: 4, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-bs-oth-conflict',
        textAr: 'عند بدء أي نقاش جاد أو مطالبة بالتزام',
        insightAr: 'حسب نظرية التعلّق: انسحاب تجنبي لحماية نفسه من مواجهة المشاعر المعقدة.',
        weightTags: { attachment: 4, 'code-attachment-styles': 4 }
      },
      {
        id: 'opt-bs-oth-routine',
        textAr: 'كنمط روتيني متكرر وتلقائي في شخصيته',
        insightAr: 'حسب نموذج فوج: سلوك متجذر يعمل تلقائياً بمجرد توفر الإشارة والدافع.',
        weightTags: { fogg: 4, 'code-habits-triggers': 4 }
      }
    ]
  },
  {
    id: 'q-base-oth-motive',
    questionAr: 'ما الدافع النفسي أو الخوف الخفي المحرك للطرف الآخر؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'هرم ماسلو للحاجات — أبراهام ماسلو (Abraham Maslow)',
    codeBadge: 'الشيفرة: الحاجات النفسية',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-bs-oth-need-esteem',
        textAr: 'طلب الاهتمام وإثبات قيمته الشخصية ومكانته',
        insightAr: 'وفق نظرية تقرير المصير (SDT): حاجة فطرية للأهمية والكفاءة يسعى لإشباعها.',
        weightTags: { sdt: 4, 'code-psych-needs': 5 }
      },
      {
        id: 'opt-bs-oth-fear-failure',
        textAr: 'الخوف من كشف ضعفه أو فقدان هيبته',
        insightAr: 'حسب علاج المخططات: درع حماية نفسي لتفادي الانكشاف العاطفي أمام المحيطين.',
        weightTags: { 'schema-therapy': 4, 'code-threats-fears': 4 }
      },
      {
        id: 'opt-bs-oth-control',
        textAr: 'الرغبة في السيطرة وحسم الأمور لصالحه',
        insightAr: 'حسب نظرية الاختيار لجلاسر: محاولة فرض القوة لتسكين قلق الفوضى الداخلي.',
        weightTags: { 'choice-theory': 4, 'code-motives-goals': 4 }
      },
      {
        id: 'opt-bs-oth-poor-eq',
        textAr: 'عجز في مهارات التعبير وتنظيم الانفعال',
        insightAr: 'وفق الذكاء العاطفي لجولمان: فقر الذكاء العاطفي يخرج الألم في صورة سلوك حاد.',
        weightTags: { eq: 4, 'code-emotion-regulation': 4 }
      }
    ]
  },
  {
    id: 'q-base-oth-payoff',
    questionAr: 'ما المكسب الفوري أو النتيجة التي يحققها تصرفه؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
    codeBadge: 'الشيفرة: المكافأة والتعزيز',
    allowMultiple: true,
    perspective: 'other',
    options: [
      {
        id: 'opt-bs-oth-dominate',
        textAr: 'الشعور بالتفوق والسيطرة اللحظية على الموقف',
        insightAr: 'وفق نظرية التعزيز: الشعور اللحظي بالقوة يُثبت السلوك كأداة معتمدة لديه.',
        weightTags: { 'choice-theory': 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-bs-oth-relief',
        textAr: 'الارتياح المؤقت والتخلص من كلفة النقاش',
        insightAr: 'حسب CBT: مكسب التجنب السريع (Avoidance Payoff) الذي يخفف القلق الفوري.',
        weightTags: { cbt: 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-bs-oth-attention',
        textAr: 'جذب انتباه وتعاطف أو خضوع المحيطين به',
        insightAr: 'وفق علم النفس الاجتماعي: استجابة المحيطين تمنح السلوك مكافأة اجتماعية لتكراره.',
        weightTags: { 'habit-loops': 4, 'code-social-influence': 3 }
      },
      {
        id: 'opt-bs-oth-shield',
        textAr: 'حماية نفسه من الاعتراف بالخطأ والمسؤولية',
        insightAr: 'حسب نظرية التنافر المعرفي: إنكار المسؤولية لحماية الصورة الذاتية من التصدع.',
        weightTags: { cbt: 4, 'code-threats-fears': 4 }
      }
    ]
  }
];

export const BASE_SELF_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-base-slf-trigger',
    questionAr: 'متى يظهر هذا السلوك أو التفكير لديك غالباً؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم العادات وحلقات السلوك — جيمس كلير (James Clear)',
    codeBadge: 'الشيفرة: المثيرات والعادات',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-bs-slf-stress',
        textAr: 'عند تراكم الضغوط والإرهاق اليومي',
        insightAr: 'حسب علم التوازن العصبي: تفريغ سريع لخفض هرمونات التوتر والإجهاد.',
        weightTags: { 'stress-allostasis': 4, 'code-somatic-biology': 3 }
      },
      {
        id: 'opt-bs-slf-alone',
        textAr: 'في أوقات الفراغ والهروب الذهني',
        insightAr: 'وفق علم العادات: الفراغ غير المنظم يدفع الدماغ التلقائي لسلوكيات مهدئة.',
        weightTags: { 'habit-loops': 4, 'code-reward-reinforcement': 3 }
      },
      {
        id: 'opt-bs-slf-social',
        textAr: 'بعد الاحتكاك الطويل والمستنزف بالآخرين',
        insightAr: 'حسب الذكاء العاطفي: حاجة بيولوجية لتفريغ الحمل الحسي واستعادة التوازن.',
        weightTags: { eq: 4, 'code-social-influence': 3 }
      },
      {
        id: 'opt-bs-slf-routine',
        textAr: 'كنمط روتيني تلقائي غير مخطط له',
        insightAr: 'حسب نموذج فوج: عادة متأصلة تعمل بمجرد التقاء الإشارة مع سهولة الفعل.',
        weightTags: { fogg: 4, 'code-habits-triggers': 4 }
      }
    ]
  },
  {
    id: 'q-base-slf-motive',
    questionAr: 'ما الدافع الداخلي أو الحاجة الأبرز حينها لديك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'العلاج المعرفي السلوكي CBT — د. آرون بيك (Aaron T. Beck)',
    codeBadge: 'الشيفرة: الأفكار والتفسيرات',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-bs-slf-peace',
        textAr: 'الرغبة في الهدوء والابتعاد عن الضجيج والضغط',
        insightAr: 'حسب CBT: تجنب تكيفي مؤقت لحماية الصفاء الذهني من الاستنزاف.',
        weightTags: { cbt: 4, 'code-thoughts-appraisals': 4 }
      },
      {
        id: 'opt-bs-slf-autonomy',
        textAr: 'الحاجة للاستقلالية والحرية والسيطرة على قراري',
        insightAr: 'حسب نظرية تقرير المصير (SDT): الاستقلالية من أعمق الحاجات النفسية للسلامة.',
        weightTags: { sdt: 5, 'code-psych-needs': 4 }
      },
      {
        id: 'opt-bs-slf-soothe',
        textAr: 'تسكين ضيق وتوتر داخلي متراكم بأي وسيلة',
        insightAr: 'حسب علم تنظيم المشاعر: وسيلة تهدئة ذاتية (Self-Soothing) لإعادة التوازن.',
        weightTags: { 'emotion-regulation': 4, 'code-emotions-affect': 4 }
      },
      {
        id: 'opt-bs-slf-escape-fear',
        textAr: 'الخوف من التعرض للنقد أو ارتكاب الأخطاء',
        insightAr: 'وفق علاج المخططات: الهروب من الموقف لتفادي إثارة مشاعر النقص أو الذنب.',
        weightTags: { 'schema-therapy': 4, 'code-threats-fears': 4 }
      }
    ]
  },
  {
    id: 'q-base-slf-payoff',
    questionAr: 'ما المكسب الفوري الذي يمنحه لك هذا السلوك؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'نظرية الاختيار — د. ويليام جلاسر (William Glasser)',
    codeBadge: 'الشيفرة: المكافأة والتعزيز',
    allowMultiple: true,
    perspective: 'self',
    options: [
      {
        id: 'opt-bs-slf-clarity',
        textAr: 'صفاء ذهني وتخفيف فوري ومؤقت للضغط',
        insightAr: 'حسب ويليام جلاسر: مكافأة فورية تلبي حاجة الأمان والسلام الداخلي.',
        weightTags: { 'choice-theory': 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-bs-slf-recharge',
        textAr: 'شحن الطاقة واستعادة التوازن النفسي والجسدي',
        insightAr: 'وفق علم النفس الإيجابي: الأنشطة المهدئة ترفع المخزون الاحتياطي للمرونة النفسية.',
        weightTags: { 'positive-psych': 4, 'code-values-conscience': 3 }
      },
      {
        id: 'opt-bs-slf-avoid-pain',
        textAr: 'تأجيل مواجهة ما يقلقني وحماية نفسي مؤقتاً',
        insightAr: 'حسب CBT: راحة لحظية من كلفة المواجهة مقابل زيادة تراكمها لاحقاً.',
        weightTags: { cbt: 4, 'code-reward-reinforcement': 4 }
      },
      {
        id: 'opt-bs-slf-dopamine',
        textAr: 'متعة سريعة تعوض نقص الراحة والمعنى في يومي',
        insightAr: 'وفق كيمياء الأعصاب: المكافأة البديلة تفرز الدوبامين لتعويض غياب الإشباع العميق.',
        weightTags: { 'habit-loops': 4, 'code-somatic-biology': 3 }
      }
    ]
  }
];

export const ADAPTIVE_FOLLOWUP_QUESTIONS: QuestionItem[] = [
  {
    id: 'q-adapt-sleep-fatigue',
    questionAr: 'سؤال متابعة: كيف تقيّم أثر نومك وطاقتك في هذا الموقف؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'علم النوم والإيقاع الحيوي — د. ماثيو ووكر (Matthew Walker)',
    codeBadge: 'الشيفرة: الحالة الجسدية والبيولوجية',
    hintAr: 'النوم غير الكافي يعطل كابح الدماغ الأمامي ويرفع حساسية اللوزة الدماغية.',
    isFollowUp: true,
    followUpReason: 'لفحص العلاقة البيولوجية بين الإرهاق العصبي وانهيار ضبط النفس',
    allowMultiple: true,
    options: [
      {
        id: 'opt-ad-sleep-severe',
        textAr: 'يزداد سوءاً بنومي أقل من 6 ساعات',
        insightAr: 'حسب ماثيو ووكر: قلة النوم تفصل الفص الجبهي عن اللوزة بنسبة 60%.',
        weightTags: { 'sleep-circadian': 5, 'code-somatic-biology': 5, 'stress-allostasis': 3 }
      },
      {
        id: 'opt-ad-sleep-moderate',
        textAr: 'له أثر ملحوظ، لكن يحدث حتى مع راحتي',
        insightAr: 'وفق التوازن الحيوي: الإرهاق محفز مضاعف، لكن المحرك هو المثير النفسي.',
        weightTags: { 'sleep-circadian': 2, 'code-somatic-biology': 2 }
      },
      {
        id: 'opt-ad-sleep-none',
        textAr: 'لا أرى ارتباطاً مباشراً بين نومي والموقف',
        insightAr: 'يشير ذلك لديناميكية معرفية أو اجتماعية خالصة وليست بيولوجية.',
        weightTags: { 'code-thoughts-appraisals': 2 }
      }
    ]
  },
  {
    id: 'q-adapt-emotion-intensity',
    questionAr: 'سؤال متابعة: ما شدة الانفعال الجسدي والشعوري المصاحب؟',
    subtitleAr: 'اختر إجابة أو أكثر',
    scienceBadge: 'العلاج السلوكي الجدلي DBT — د. مارشا لينهان (Marsha Linehan)',
    codeBadge: 'الشيفرة: تنظيم الانفعالات',
    hintAr: 'دقات القلب وتشنج العضلات يحددان شدة الاستجابة الغريزية.',
    isFollowUp: true,
    followUpReason: 'لقياس عمق الإثارة الوجدانية وعلاقتها بالضغط الحاد',
    allowMultiple: true,
    options: [
      {
        id: 'opt-ad-emot-explosive',
        textAr: 'عالية وفورية (حرارة بالوجه وخفقان ورغبة بالصراخ)',
        insightAr: 'حسب DBT: اختطاف لوزي حاد يتطلب تبريداً فسيولوجياً عاجلاً.',
        weightTags: { 'emotion-regulation': 4, dbt: 3, 'code-emotions-affect': 4 }
      },
      {
        id: 'opt-ad-emot-cold',
        textAr: 'ضيقة باردة وكتومة (ثقل بالصدر وسرحان)',
        insightAr: 'وفق ACT: الكبت والتجنب يطيلان عمر الألم والتشنج بالجسد.',
        weightTags: { act: 3, 'code-emotions-affect': 3, cbt: 2 }
      },
      {
        id: 'opt-ad-emot-mild',
        textAr: 'انزعاج خفيف يستهلك طاقتي الفكرية',
        insightAr: 'حسب نظرية النظم: الاجترار الصامت يستنزف الطاقة مثل الانفجار الحركي.',
        weightTags: { cbt: 3, 'code-cognitive-biases': 3 }
      }
    ]
  }
];

// Smart Pattern Matcher: inspects text for colloquial / psychological terms and selects the most relevant questions strictly adhering to perspective
export function detectSmartQuestions(
  text: string,
  category: BehaviorCategory,
  perspective: Perspective
): QuestionItem[] {
  const analysis = parseDialectAndIntent(text);
  const targetPerspective: Perspective = perspective || analysis.perspective;
  const targetCategory: BehaviorCategory = category || analysis.category;
  const questions = getDialectQuestions(text, analysis.themeKey, targetCategory, targetPerspective);
  if (questions && questions.length > 0) {
    return questions;
  }
  return targetPerspective === 'other' ? BASE_OTHER_QUESTIONS : BASE_SELF_QUESTIONS;
}
