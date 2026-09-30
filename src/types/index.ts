export type BehaviorCategory = 
  | 'habit'          // عادة
  | 'reaction'       // ردّة فعل
  | 'behavior'       // سلوك أو تصرّف
  | 'mood'           // مزاج
  | 'thought'        // فكرة متكرّرة
  | 'relationship';  // نمط في العلاقات

export type Perspective = 'self' | 'other';

export interface CodeItem {
  id: string;
  nameAr: string;
  categoryAr: string;
  descriptionAr: string;
  indicators: string[];
  relatedSciences: string[]; // IDs from sciences
}

export interface ScienceItem {
  id: string;
  nameAr: string;
  authorAr: string;
  referenceAr: string;
  officialUrl: string;
  summaryAr: string;
  keyConceptAr: string;
}

export interface QuestionOption {
  id: string;
  textAr: string;
  insightAr?: string;
  scienceRef?: string;
  weightTags?: { [key: string]: number };
  triggersFollowUp?: boolean;
  followUpReason?: string;
}

export interface QuestionItem {
  id: string;
  questionAr: string;
  subtitleAr?: string;
  hintAr?: string;
  scienceBadge?: string;
  codeBadge?: string;
  allowMultiple?: boolean;
  category?: BehaviorCategory | 'all';
  perspective?: Perspective | 'both';
  options: QuestionOption[];
  isFollowUp?: boolean;
  followUpReason?: string;
}

export interface UserAnswer {
  questionId: string;
  optionId?: string;
  selectedOptionIds?: string[];
  optionText?: string;
  freeText?: string;
}

export interface ProbabilityBreakdown {
  titleAr: string;
  percentage: number;
  explanationAr: string;
  codeId: string;
  color: string;
}

export interface BehavioralLoopChain {
  trigger: string;          // المُطلِق
  interpretation: string;   // التفسير
  emotion: string;          // الانفعال
  action: string;           // الفعل
  immediatePayoff: string;  // المكسب الفوري
  delayedCost: string;      // الكلفة المتأخرة
}

export interface ChangePlan {
  step24Hours: string;       // خطوة خلال 24 ساعة
  todayPlan: string;         // خطة اليوم
  weeklyPlan: string;        // خطة الأسبوع
  monthlyPlan: string;       // خطة الشهر
  ifThenRule: string;        // قاعدة إذا... فإنني...
  progressIndicators: string[]; // مؤشرات قياس التقدم
  relapseProtocol: string;   // تعليمات التعامل مع الانتكاس
}

export interface SignalsSection {
  whatToObserve: string[];
  practicalActions: string[];
  professionalAlerts: string[];
  officialResources: {
    name: string;
    org: string;
    url: string;
    phoneOrNote: string;
  }[];
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  inputText: string;
  category: BehaviorCategory;
  perspective: Perspective;
  confidenceScore: number;
  textualReading: string;
  probabilities: ProbabilityBreakdown[];
  confirmedCodes: {
    codeId: string;
    codeNameAr: string;
    relevanceAr: string;
  }[];
  prominentMaslowNeed: {
    level: string;
    nameAr: string;
    explanationAr: string;
  };
  emotionalIntelligenceSkill: {
    skillNameAr: string;
    descriptionAr: string;
    actionTipAr: string;
  };
  alternativeReading?: string;
  userDetailsIntegrated: string[];
  referencedSciences: ScienceItem[];
  behavioralLoop: BehavioralLoopChain;
  changePlan: ChangePlan;
  signals: SignalsSection;
  questionsSnapshot: {
    questionAr: string;
    chosenAnswerAr?: string;
    userNote?: string;
  }[];
}

export interface MoodLog {
  id: string;
  date: string;
  moodLevel: 1 | 2 | 3 | 4 | 5; // 1: مرهق, 2: متوتر, 3: محايد, 4: رايق, 5: ممتاز
  sleepHours: number;
  sleepQuality: 'poor' | 'average' | 'good';
  note?: string;
}

export interface AISettings {
  provider: 'gemini' | 'openai' | 'azure' | 'custom';
  endpoint: string;
  model: string;
  apiKey: string;
  enabled: boolean;
}

export interface DraftSession {
  inputText: string;
  category: BehaviorCategory;
  perspective: Perspective;
  activeQuestions: QuestionItem[];
  currentQuestionIndex: number;
  answers: Record<string, UserAnswer>;
  updatedAt: string;
}
