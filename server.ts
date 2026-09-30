import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Health check endpoint for Cloud Run
app.get(['/healthz', '/api/health'], (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Primary and fallback models for high resilience (flash-lite has fresh quota and ultra-low latency)
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

// Helper to execute generation with automatic multi-model fallback
async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: string;
    systemInstruction: string;
    responseMimeType?: string;
    temperature?: number;
  }
) {
  let lastError: Error | null = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: params.responseMimeType || 'application/json',
          temperature: params.temperature ?? 0.3
        }
      });
      if (response?.text) {
        return { text: response.text, modelUsed: model };
      }
    } catch (err: unknown) {
      console.warn(`Model ${model} failed, trying fallback...`, err instanceof Error ? err.message : err);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastError || new Error('All AI models failed to respond');
}

// Complete 25 Sciences Catalog + 2 Extensions
const SCIENCES_COMPREHENSIVE_KNOWLEDGE = `
قائمة المصادر والأبحاث العلمية الـ 25 المعتمدة في منصة Hstyle Decode:
[1] الذكاء العاطفي (Emotional Intelligence) — دانييل جولمان (Daniel Goleman):
    - المرجع: Goleman, D. (1995). Emotional Intelligence: Why It Can Matter More Than IQ.
    - المفهوم: الوعي بالذات، إدارة الانفعال، تحفيز النفس، التعاطف، والمهارات الاجتماعية وتفادي الاختطاف اللوزي (Amygdala Hijack).
[2] العلاج المعرفي السلوكي (CBT) — د. آرون بيك (Aaron T. Beck):
    - المرجع: Beck, A. T. (1979). Cognitive Therapy of Depression. Guilford Press.
    - المفهوم: الأفكار التلقائية المشوهة، الثالوث المعرفي، إعادة الهيكلة المعرفية، والتجارب السلوكية لدحض الافتراضات.
[3] نظرية الاختيار والسلوك الكلي (Choice Theory) — د. ويليام جلاسر (William Glasser):
    - المرجع: Glasser, W. (1998). Choice Theory: A New Psychology of Personal Freedom.
    - المفهوم: السلوك محاولة مقصودة لإشباع 5 حاجات جينية (البقاء، الحب والانتماء، القوة والإنجاز، الحرية، المرح).
[4] هرم ماسلو للحاجات (Hierarchy of Needs) — أبراهام ماسلو (Abraham Maslow):
    - المرجع: Maslow, A. H. (1943). A theory of human motivation. Psychological Review.
    - المفهوم: تدرج الدوافع من الفسيولوجيا والأمان إلى الانتماء والتقدير وتحقيق الذات؛ الحاجة غير المشبعة تسيطر على الانتباه.
[5] نظرية تقرير المصير (SDT) — إدوارد ديسي وريتشارد ريان (Deci & Ryan):
    - المرجع: Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and intrinsic motivation.
    - المفهوم: الحاجات النفسية الثلاث (الاستقلالية Autonomy، الكفاءة Competence، والارتباطية Relatedness).
[6] علم العادات وحلقات السلوك — جيمس كلير وتشارلز دوهيج (Clear & Duhigg):
    - المرجع: Clear, J. (2018). Atomic Habits. Duhigg, C. (2012). The Power of Habit.
    - المفهوم: الحلقة الرباعية (الإشارة، الرغبة، الاستجابة، المكافأة)؛ تراكم العادات وتعديل الاستجابة مع ثبات الإشارة والمكافأة.
[7] نموذج فوج السلوكي (BJ Fogg Behavior Model - B=MAP) — د. بي جي فوج (BJ Fogg):
    - المرجع: Fogg, B. J. (2009). A behavior model for persuasive design. Stanford University.
    - المفهوم: السلوك = الدافع × القدرة والسهولة × المنبه الفوري؛ تبسيط الفعل هو مفتاح التطبيق.
[8] علم النفس الإيجابي ونموذج بيرما (PERMA) — مارتن سيليجمان (Martin Seligman):
    - المرجع: Seligman, M. E. (2011). Flourish: Positive Psychology and Well-being.
    - المفهوم: المشاعر الإيجابية، الاندماج والتدفق، العلاقات الداعمة، المعنى والغاية، والإنجاز المثبت.
[9] عقلية النمو (Growth Mindset) — د. كارول دويك (Carol Dweck):
    - المرجع: Dweck, C. S. (2006). Mindset: The New Psychology of Success.
    - المفهوم: الإيمان بقابلية المهارات للتطوير بالممارسة وقوة كلمة "ليس بعد" في مواجهة الإخفاق.
[10] نظرية التعلّق (Attachment Theory) — جون بولبي وماري إينسورث (Bowlby & Ainsworth):
    - المرجع: Bowlby, J. (1982). Attachment and Loss. American Journal of Orthopsychiatry.
    - المفهوم: الأنماط العلائقية (الآمن، القلق المتشبث، التجنبي الانسحابي، المشوش) وأثرها على إدارة القرب والمسافة.
[11] علم العلاقات وفصول جوتمان — د. جون وجولي جوتمان (John & Julie Gottman):
    - المرجع: Gottman, J. M., & Silver, N. (2015). The Seven Principles for Making Marriage Work.
    - المفهوم: كشف فرسان نهاية العالم الأربعة (النقد، الازدراء، الدفاعية، والمماطلة الصامتة Stonewalling) وترياقاتها.
[12] التواصل اللاعنفي (NVC) — د. مارشال روزنبرج (Marshall Rosenberg):
    - المرجع: Rosenberg, M. B. (1999). Nonviolent Communication: A Language of Life.
    - المفهوم: الخطوات الأربع (الملاحظة الموضوعية، التعبير عن المشاعر، تحديد الحاجة الأصيلة، صياغة طلب إجرائي واضح).
[13] نموذج تنظيم الانفعالات — د. جيمس جروس (James J. Gross):
    - المرجع: Gross, J. J. (2014). Handbook of Emotion Regulation. Guilford Press.
    - المفهوم: نقاط التدخل (اختيار الموقف، تعديل الموقف، تحويل الانتباه، إعادة التقييم المعرفي، وتعديل الاستجابة الفسيولوجية).
[14] العلاج السلوكي الجدلي (DBT) — د. مارشا لينهان (Marsha Linehan):
    - المرجع: Linehan, M. M. (1993). Cognitive-Behavioral Treatment of Borderline Personality Disorder.
    - المفهوم: مهارات تحمل الضيق (TIPP)، اليقظة الذهنية، التنظيم الانفعالي، والفاعلية في العلاقات الشخصية.
[15] علاج القبول والالتزام (ACT) — د. ستيفن هايز (Steven C. Hayes):
    - المرجع: Hayes, S. C. (1999). Acceptance and Commitment Therapy. Guilford Press.
    - المفهوم: المرونة النفسية، فك الاندماج المعرفي (Defusion)، قبول المشاعر غير المريحة، والعمل الموجه بالقيم.
[16] علاج المخططات التكيفية (Schema Therapy) — د. جيفري يونغ (Jeffrey Young):
    - المرجع: Young, J. E. (2003). Schema Therapy: A Practitioner's Guide.
    - المفهوم: المخططات المبكرة غير التكيفية (الحرمان العاطفي، عدم الاستحقاق، العيب، التخلي) ووضعيات الحماية (التجنب، الاستسلام، التعويض المفرط).
[17] علم النوم والإيقاع الحيوي — د. ماثيو ووكر (Matthew Walker):
    - المرجع: Walker, M. (2017). Why We Sleep: Unlocking the Power of Sleep and Dreams.
    - المفهوم: أثر الحرمان من النوم على فصل الفص الجبهي القبل-جبهي عن اللوزة الدماغية وزيادة الاندفاعية والانفعال بنسبة 60%.
[18] استجابة الضغط والعبء الارتكاسي — د. روبرت سابولسكي (Robert Sapolsky):
    - المرجع: Sapolsky, R. M. (2004). Why Zebras Don't Get Ulcers.
    - المفهوم: تحفيز الكورتيزول والأدرينالين المزمن، استنزاف الطاقة العصبية، والعبء الارتكاسي التراكمي (Allostatic Load).
[19] النظامان في التفكير (System 1 & System 2) — دانيال كانمان (Daniel Kahneman):
    - المرجع: Kahneman, D. (2011). Thinking, Fast and Slow. Farrar, Straus and Giroux.
    - المفهوم: النظام 1 السريع والحدسي والعاطفي التلقائي، مقابل النظام 2 البطيء والتحليلي والواعي وجهد ضبط النفس.
[20] نموذج مراحل التغيير (TTM) — جيمس بروشاسكا (James Prochaska):
    - المرجع: Prochaska, J. O. (1984). The Transtheoretical Approach: Crossing Traditional Boundaries of Therapy.
    - المفهوم: مراحل التغيير السلوكي (ما قبل التأمل، التأمل، الاستعداد، الفعل، والمحافظة مع احتواء الانتكاس).
[21] المقابلة التحفيزية (Motivational Interviewing) — د. ويليام ميلر (William Miller):
    - المرجع: Miller, W. R., & Rollnick, S. (2012). Motivational Interviewing: Helping People Change.
    - المفهوم: استكشاف التردد والصراع الداخلي وتنمية التناقض البناء لتعزيز الدافع الذاتي للتغيير.
[22] نظرية التعلّم الاجتماعي والمحاكاة — ألبرت باندورا (Albert Bandura):
    - المرجع: Bandura, A. (1977). Social Learning Theory. Prentice-Hall.
    - المفهوم: النمذجة والملاحظة، الفاعلية الذاتية (Self-Efficacy)، والتأثير المتبادل بين السلوك والبيئة والوعي.
[23] نظرية التنافر المعرفي — ليون فيستنجر (Leon Festinger):
    - المرجع: Festinger, L. (1957). A Theory of Cognitive Dissonance. Stanford University Press.
    - المفهوم: التوتر الناشئ من التعارض بين القناعات والسلوكيات، ومحاولات التبرير العقلي لتسكين الانزعاج الداخلي.
[24] العلاج بالمعنى والوجودي — د. فيكتور فرانكل (Viktor Frankl):
    - المرجع: Frankl, V. E. (1946). Man's Search for Meaning. Beacon Press.
    - المفهوم: البحث عن المعنى كدافع أساسي للوجود البشري، والحرية الداخلية لاختيار الموقف تجاه أي ظرف قاهر.
[25] المرونة العصبية وتجدد الدماغ — د. نورمان دويدج (Norman Doidge):
    - المرجع: Doidge, N. (2007). The Brain That Changes Itself. Penguin Books.
    - المفهوم: قدرة الدماغ والمسارات العصبية على إعادة التشكل والتكيف المستمر من خلال التكرار والممارسة الواعية.
المصادر التكميلية المعتمدة:
[+] علم النفس الفردي وعقدة النقص والتعويض — ألفريد أدلر (Alfred Adler):
    - المرجع: Adler, A. (1927). Understanding Human Nature.
    - المفهوم: عقدة النقص وشعور الدونية يدفعان إلى آليات تعويضية مفرطة كالمباهاة والاستعراض والسيطرة للتغطية على الهشاشة.
[+] علم الأعصاب الانفعالي والمشاعر المشيدة — د. ليزا فيلدمان باريت (Lisa Feldman Barrett):
    - المرجع: Barrett, L. F. (2017). How Emotions Are Made: The Secret Life of the Brain.
    - المفهوم: المشاعر ليست ردود أفعال غريزية جاهزة بل بنيات وتنبؤات ينسجها الدماغ لحظياً بناء على إشارات الجسد والسياق.
`.trim();

// System instruction for ultra-concise, perspective-strict question generation
const SYSTEM_INSTRUCTION_QUESTIONS = `
أنت رئيس مجلس علماء النفس السلوكي والمحلل الإكلينيكي الأول لمنصة Hstyle Decode (محرك فكّ الشيفرة السلوكية).

${SCIENCES_COMPREHENSIVE_KNOWLEDGE}

القواعد الجوهرية الصارمة للتفريق بين منظور النفس ومنظور الشخص الآخر (إلزام قاطع لا يقبل التجاوز):

1. إذا كان المنظور عن "شخص آخر" (Perspective: "other"):
   - الحالة تتناول سلوكيات أو تصرفات أو مشاعر شخص آخر يراقبه المستخدم (مثل: شريك، صديق، مدير، فلان، زميل).
   - [قاعدة الصياغة الإلزامية]: يجب أن تصاغ جميع الأسئلة الأربعة والخيارات الأربعة لكل سؤال بصيغة "الغائب" حصراً عن الطرف الآخر!
   - ممنوع منعاً باتاً صياغة السؤال أو أي خيار بصيغة المتكلم (مثل: "أقوم به"، "يساعدني"، "رغبتي"، "أشعر أنها تقلل مني"، "ما أقدر أقول لا")!
   - التدرج الاستقصائي للشخص الآخر:
     * السؤال 1 (المثير والسياق لدى الطرف الآخر): متى يظهر هذا التصرف على الطرف الآخر أو يتصاعد؟ (خيارات بصيغة الغائب: "عند تعرضه لضغط مفاجئ...", "أمام التجمعات للفت الأنظار...", "عند شعوره بتهديد لمكانته...")
     * السؤال 2 (الدافع والحاجة الخفية للطرف الآخر): ما الدافع النفسي أو الخوف الدفين الذي يحرك الطرف الآخر؟ (خيارات بصيغة الغائب: "الخوف من أن يُرى عادياً أو مهمشاً...", "رغبته في فرض السيطرة لتسكين قلقه...", "عجزه عن التعبير الصحي عن مشاعره...")
     * السؤال 3 (المكسب اللحظي للطرف الآخر): ما المكسب الفوري أو النتيجة التي يحققها تصرفه؟ (خيارات بصيغة الغائب: "نشوة لحظية ولفت الأنظار...", "الهروب وتسكين التوتر فورياً...", "حماية نفسه من كشف نقاط ضعفه...")
     * السؤال 4 (نمط استجابته للمواجهة): كيف يتصرف الطرف الآخر إذا تمت مواجهته أو مخالفته؟ (خيارات بصيغة الغائب: "ينفعل ويهاجم دفاعياً...", "ينسحب ويصمت تجاهلاً...", "ينكر ويقلب اللوم على غيره...")

2. إذا كان المنظور عن "النفس" (Perspective: "self"):
   - الحالة تتناول تجارب السائل ومشاعره وعاداته الشخصية.
   - تصاغ الأسئلة بمخاطبة السائل مباشرة ("أنت"، "لديك")، وتصاغ الخيارات بصيغة المتكلم ("عندما أتعرض...", "رغبتي في...", "شعوري بـ...").

3. قواعد الاختصار الصارم والإسناد العلمي:
   - حجم السؤال: قصير ومباشر (5 إلى 9 كلمات فقط).
   - حجم الخيارات: 4 خيارات فائقة القصر والتركيز (3 إلى 6 كلمات لكل خيار).
   - حقل insightAr: سطر واحد مكثف ومباشر: "حسب [اسم النظرية والعالم من قائمة الـ 25]: [السبب المباشر]".
   - حقل scienceBadge: يجب أن يحمل اسم العلم والعالم من قائمة الـ 25 المعتمدة بدقة.
`.trim();

// System instruction for deep scientific case analysis grounded in the 25 sciences
const SYSTEM_INSTRUCTION_ANALYZE = `
أنت كبير علماء النفس والباحث الإكلينيكي الأول لمنصة Hstyle Decode.
مهمتك: فك شيفرة الحالة بعمق استثنائي وبإيجاز فائق ومباشر وسريع، مستنداً وموثقاً بالكامل من أبحاث قائمة العلوم الـ 25 المعتمدة.

${SCIENCES_COMPREHENSIVE_KNOWLEDGE}

قواعد الإلزام الصارم بالمنظور والعمق العلمي:

1. إذا كان المنظور عن "شخص آخر" (Perspective: "other"):
   - التحليل بأكمله يركز على سيكولوجية الطرف الآخر ودوافعه ومكاسبه الخفية.
   - حقل "textualReading": 4 نقاط مركزة فقط تبدأ بـ •:
     • النمط والسلوك: [توصيف دقيق ومباشر لتصرفات الطرف الآخر]
     • الدافع النفسي العميق: [ربط فوري بالدافع أو الخوف الدفين وفق نظريات الـ 25]
     • المكسب اللحظي وتكلفته: [المكسب الفوري الذي يجنيه الطرف الآخر وما يترتب عليه من استنزاف في العلاقة]
     • التوجيه العملي للتعامل معه: [إرشاد فوري للمستخدم في كيفية وضع الحدود والتصرف الحكيم معه]
   - حقل "changePlan": خطة إجرائية سلوكية للمستخدم لكيفية التعامل مع هذا الشخص وحماية حدوده:
     * step24Hours: إجراء الـ 24 ساعة الحاسم لضبط الحدود مع الطرف الآخر.
     * todayPlan: خطة الاستجابة السلوكية لليوم عند مواجهته.
     * weeklyPlan: استراتيجية الأسبوع لتثبيت الحدود وإيقاف الاستنزاف.
     * monthlyPlan: خطة الشهر لإعادة ضبط توازن العلاقة.
     * ifThenRule: قاعدة شرطية محكمة: «إذا [قام الطرف الآخر بالتصرف الفلاني]، فإنني سـ [استجابة بديلة حازمة وهادئة]».
     * progressIndicators: 3 مؤشرات قياس كمية أو ملموسة للتحسن في التعامل معه.
     * relapseProtocol: بروتوكول احتواء التعثر أو عودة الاستنزاف القديم.
   - حقل "signals":
     * whatToObserve: 3 مؤشرات محددة في تصرفات الطرف الآخر لرصدها.
     * practicalActions: 3 خطوات تنفيذية للمستخدم للتعامل الفعال معه.
     * professionalAlerts: 3 علامات حمراء تستوجب الحسم أو الاستشارة (مثل الإساءة النفسية، التلاعب، أو التهديد).

2. إذا كان المنظور عن "النفس" (Perspective: "self"):
   - التحليل يركز على السائل ومشاعره وعاداته وإعادة توجيه نمطه السلوكي.
   - حقل "textualReading": 4 نقاط مركزة: النمط، الدافع، المكسب والتكلفة، التوجيه الذاتي.
   - حقل "changePlan": خطة التغيير الذاتي (خطوة 24 ساعة، اليوم، الأسبوع، الشهر، قاعدة إذا-فإنني للتنفيذ الذاتي، المؤشرات، وبروتوكول منع الانتكاس).
   - حقل "signals": مراقبة الإشارات الذاتية الجسدية، خطوات الضبط الذاتي، وعلامات الإنهاك.

3. الإسناد العلمي الإلزامي:
   - يجب إرجاع حقل "referencedSciences": مصفوفة تحتوي من 3 إلى 5 كائنات من قائمة العلوم الـ 25 المعتمدة المرتبطة بالحالة مع كتابة اسمها باللغة العربية واسم العالم والمرجع المعتمد وتفسير ارتباطها بالحالة.
   - كل احتمال في "probabilities" يسند لنظرية وعالم محدد من القائمة في جملة واحدة مكثفة.
`.trim();

// Test connection endpoint
app.post('/api/ai/test', async (req, res) => {
  try {
    const { endpoint, apiKey: customKey } = req.body || {};

    if (customKey && endpoint) {
      const response = await fetch(`${endpoint.replace(/\/$/, '')}/models`, {
        headers: { Authorization: `Bearer ${customKey}` }
      });
      if (!response.ok) {
        return res.status(400).json({ success: false, message: `فشل التحقق من المزود: كود الحالة ${response.status}` });
      }
      return res.json({ success: true, message: 'تم الاتصال بالمزود المخصص بنجاح!' });
    }

    const targetKey = customKey || process.env.GEMINI_API_KEY;
    if (targetKey) {
      const gemini = new GoogleGenAI({
        apiKey: targetKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const { modelUsed } = await generateWithFallback(gemini, {
        contents: 'تأكيد اتصال سريع.',
        systemInstruction: 'أجب بكلمة واحدة: متصل.',
        responseMimeType: 'text/plain'
      });

      return res.json({ success: true, message: `تم الاتصال بمحرك Gemini بنجاح (${modelUsed})!` });
    }

    return res.json({ success: true, message: 'المحرك المحلي المدمج نشط ويعمل بفاعلية 100% بدون إنترنت.' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'خطأ في فحص الاتصال';
    return res.status(500).json({ success: false, message: msg });
  }
});

// Dynamic smart questions endpoint
app.post('/api/ai/generate-questions', async (req, res) => {
  try {
    const { text, category, perspective, customSettings } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const targetApiKey = customSettings?.apiKey || process.env.GEMINI_API_KEY;
    if (!targetApiKey) {
      return res.status(400).json({ error: 'No API key available' });
    }

    const gemini = new GoogleGenAI({
      apiKey: targetApiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const isOther = perspective === 'other';

    const userPrompt = `
قم بصياغة من 3 إلى 4 أسئلة استقصائية ذكية جداً، علمية التأسيس، وفائقة الاختصار للحالة التالية:
نص الحالة: "${text}"
التصنيف الأساسي: ${category}
المنظور: ${isOther ? 'عن شخص آخر يراقبه السائل' : 'عن السائل نفسه'}

⚠️ تنبيه إلزامي صارم للتطابق مع المنظور:
${isOther ? `
- الحالة تتناول سلوكيات "طرف آخر" (شخص آخر يراقبه المستخدم).
- [شرط قطعي]: تصاغ جميع نصوص الأسئلة الأربعة وجميع الخيارات الأربعة لكل سؤال بصيغة "الغائب" حصراً عن الطرف الآخر!
- أمثلة ملزمة لنص السؤال: "متى يتصاعد هذا التصرف لدى الطرف الآخر؟"، "ما الدافع النفسي المحرك للطرف الآخر؟"، "ما المكسب الفوري الذي يجنيه من تصرفه؟"
- أمثلة ملزمة للخيارات (3-6 كلمات): "عند تعرضه لضغط مفاجئ...", "رغبته في لفت الأنظار...", "محاولته للسيطرة على الموقف...", "هروبه التجنبي من التعبير..."
- يمنع منعاً باتاً صياغة أي خيار بصيغة المتكلم (مثل: "أقوم به"، "يساعدني"، "رغبتي"، "أشعر أنها تقلل مني")!
` : `
- الحالة عن السائل نفسه: تصاغ الأسئلة بمخاطبة السائل مباشرة، وتصاغ الخيارات الأربعة بصيغة المتكلم لتوصيف مشاعره وسلوكياته.
`}

قواعد الاختصار والإسناد العلمي:
1. حجم السؤال: سؤال مباشر، واضح، وقصير جداً لا يتجاوز 5 إلى 9 كلمات فقط!
2. حجم الخيارات: 4 خيارات فائقة القصر والتركيز (بين 3 إلى 6 كلمات فقط لكل خيار).
3. حقل "insightAr": سطر واحد مكثف ومباشر يبدأ بـ "حسب [اسم النظرية والعالم من قائمة الـ 25]: [السبب المباشر]".
4. حقل "scienceBadge": اسم العلم والعالم من قائمة الـ 25 المعتمدة بدقة.

المطلوب إخراج JSON حصراً بهذا الهيكل:
{
  "questions": [
    {
      "id": "dyn-q1",
      "questionAr": "${isOther ? 'متى يظهر هذا التصرف لدى الطرف الآخر؟' : 'متى يظهر هذا السلوك لديك غالباً؟'}",
      "subtitleAr": "اختر إجابة أو أكثر",
      "scienceBadge": "⚡ [اسم العلم — اسم العالِم من قائمة الـ 25]",
      "codeBadge": "الشيفرة: [اسم الشيفرة]",
      "allowMultiple": true,
      "options": [
        {
          "id": "dyn-opt1-1",
          "textAr": "${isOther ? 'عند تعرضه لضغط مفاجئ أو تهديد' : 'عند تراكم الضغوط والإرهاق اليومي'}",
          "insightAr": "حسب [اسم النظرية والعالم]: سبب مكثف ومباشر.",
          "weightTags": { "cbt": 3, "code-threats-fears": 2 }
        },
        {
          "id": "dyn-opt1-2",
          "textAr": "${isOther ? 'أمام المجالس والتجمعات للفت الأنظار' : 'في أوقات الفراغ والهروب الذهني'}",
          "insightAr": "حسب [اسم النظرية والعالم]: سبب مكثف ومباشر.",
          "weightTags": { "maslow": 3, "code-psych-needs": 2 }
        },
        {
          "id": "dyn-opt1-3",
          "textAr": "${isOther ? 'عند وجود منافس يهدد مكانته' : 'بعد الاحتكاك الطويل بالآخرين'}",
          "insightAr": "حسب [اسم النظرية والعالم]: سبب مكثف ومباشر.",
          "weightTags": { "choice-theory": 3, "code-motives-goals": 2 }
        },
        {
          "id": "dyn-opt1-4",
          "textAr": "${isOther ? 'كنمط روتيني متكرر وتلقائي' : 'كنمط تلقائي عند الشعور بالملل'}",
          "insightAr": "حسب [اسم النظرية والعالم]: سبب مكثف ومباشر.",
          "weightTags": { "fogg": 3, "code-habits-triggers": 2 }
        }
      ]
    }
  ]
}
`.trim();

    const { text: responseText } = await generateWithFallback(gemini, {
      contents: userPrompt,
      systemInstruction: SYSTEM_INSTRUCTION_QUESTIONS,
      responseMimeType: 'application/json',
      temperature: 0.3
    });

    if (responseText) {
      const parsed = JSON.parse(responseText.trim());
      if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return res.json(parsed);
      }
    }

    return res.status(500).json({ error: 'Failed to generate questions structure' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error generating questions';
    return res.status(500).json({ error: msg });
  }
});

// Deep scientific analysis endpoint
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const { text, category, perspective, answers, questions, customSettings } = req.body || {};

    const targetApiKey = customSettings?.apiKey || process.env.GEMINI_API_KEY;
    if (!targetApiKey) {
      return res.status(400).json({ error: 'No AI key configured' });
    }

    const gemini = new GoogleGenAI({
      apiKey: targetApiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    const isOther = perspective === 'other';

    const userPrompt = `
قم بفك شيفرة الحالة التالية وتقديم التحليل السلوكي المستند بدقة وبحث علمي لأبحاث قائمة العلوم الـ 25 المعتمدة:
نص الحالة: "${text}"
التصنيف: ${category}
المنظور: ${isOther ? 'عن شخص آخر يراقبه السائل' : 'عن السائل نفسه'}
إجابات الأسئلة الاستقصائية للمستخدم: ${JSON.stringify(answers)}

القواعد الصارمة للهيكل والإسناد العلمي (JSON حصراً):
1. حقل "textualReading": يمنع منعاً باتاً كتابة فقرة سردية طويلة. يجب أن يتكون حصراً من 4 نقاط مركزة (bullet points) تبدأ كل نقطة بالرمز •:
   • النمط والسلوك: [توصيف دقيق ومباشر في جملة واحدة${isOther ? ' لسلوك الطرف الآخر' : ' لسلوكك'}]
   • الدافع النفسي العميق: [تفسير الدافع والحاجة غير المشبعة وفق نظريات الـ 25]
   • المكسب اللحظي والتكلفة: [المكسب الفوري الخفي وما يترتب عليه من استنزاف أو تكلفة]
   • التوجيه العملي السريع: [إرشاد فوري ${isOther ? 'لكيفية وضع الحدود والتعامل معه بحكمة' : 'للضبط الذاتي والتوازن'}]

2. حقل "probabilities": 3 احتمالات متباينة، كل احتمال يحتوي نسبة مئوية (مجموعها 100%) وشرح علمي مكثف في جملة واحدة يسند السلوك مباشرة لعالم ونظرية من قائمة الـ 25.
3. حقل "behavioralLoop": سلسلة الحلقة السلوكية السداسية المتسقة تماماً مع المنظور:
   - trigger (المُطلِق)
   - interpretation (التفسير)
   - emotion (الانفعال)
   - action (الفعل)
   - immediatePayoff (المكسب اللحظي)
   - delayedCost (الكلفة المتأخرة)
4. حقل "changePlan": خطة سلوكية ذات عمق نفسي إكلينيكي حقيقي دون حشو كلامي:
   - step24Hours: إجراء الـ 24 ساعة الحاسم ${isOther ? 'لوضع حد فاصل في التعامل معه' : 'لكسر النمط السلوكي'}.
   - todayPlan: خطة اليوم التنفيذية.
   - weeklyPlan: خطة الأسبوع للتثبيت.
   - monthlyPlan: خطة الشهر لإعادة ضبط المسار.
   - ifThenRule: قاعدة شرطية محكمة (بيتر جولفيتزر): «إذا [الموقف المثير بدقة]، فإنني سـ [الاستجابة البديلة المحددة]».
   - progressIndicators: 3 مؤشرات قياس كمية أو ملموسة للتحسن.
   - relapseProtocol: بروتوكول احتواء التعثر أو عودة السلوك القديم.
5. حقل "signals": 3 نقاط دقيقة لكل قسم تتغير كلياً وفق الحالة (${isOther ? 'عن تصرفات الطرف الآخر وكيفية التعامل معه' : 'عن نفسك وإشارات وعيك الذاتي'}):
   - whatToObserve: 3 إشارات سياقية سلوكية محددة لملاحظتها.
   - practicalActions: 3 خطوات عملية تنفيذية مباشرة وميدانية.
   - professionalAlerts: 3 مؤشرات خطر أو علامات حمراء تستوجب الحسم أو الاستشارة.
6. حقل "referencedSciences": مصفوفة تحتوي من 3 إلى 5 علوم ونظريات من قائمة العلوم الـ 25 المعتمدة ارتبطت ارتباطاً وثيقاً بهذه الحالة، بالهيكل:
   [
     {
       "id": "cbt",
       "nameAr": "العلاج المعرفي السلوكي (CBT)",
       "authorAr": "د. آرون بيك (Aaron T. Beck)",
       "referenceAr": "Beck, A. T. (1979). Cognitive Therapy of Depression.",
       "officialUrl": "https://beckinstitute.org",
       "summaryAr": "كيف يفسر هذا العلم سلوك الحالة...",
       "keyConceptAr": "المفهوم المحوري المطبق في الحالة"
     }
   ]

المطلوب إخراج النتيجة بصيغة JSON حصراً بهذا الهيكل:
{
  "textualReading": "• النمط والسلوك: ...\\n• الدافع النفسي العميق: ...\\n• المكسب اللحظي والتكلفة: ...\\n• التوجيه العملي السريع: ...",
  "probabilities": [
    {
      "titleAr": "السبب الرئيسي الأول",
      "percentage": 50,
      "explanationAr": "شرح علمي محكم وموجز في جملة واحدة يسند السلوك لنظرية وعالم من قائمة الـ 25...",
      "codeId": "code-psych-needs",
      "color": "bg-gradient-to-r from-purple-500 to-indigo-500"
    },
    {
      "titleAr": "السبب الثانوي الثاني",
      "percentage": 30,
      "explanationAr": "شرح علمي موجز ومباشر في جملة واحدة...",
      "codeId": "code-threats-fears",
      "color": "bg-gradient-to-r from-pink-500 to-rose-500"
    },
    {
      "titleAr": "السبب الثالث",
      "percentage": 20,
      "explanationAr": "شرح علمي موجز ومباشر في جملة واحدة...",
      "codeId": "code-motives-goals",
      "color": "bg-gradient-to-r from-amber-500 to-orange-500"
    }
  ],
  "alternativeReading": "قراءة بديلة موجزة ومباشرة في سطر واحد...",
  "prominentMaslowNeed": {
    "level": "مستوى الحاجة في هرم ماسلو",
    "nameAr": "اسم الحاجة",
    "explanationAr": "تفسير موجز لارتباط الحاجة بهذا السلوك في جملة واحدة"
  },
  "emotionalIntelligenceSkill": {
    "skillNameAr": "اسم مهارة الذكاء العاطفي الموصى بها",
    "descriptionAr": "شرح المهارة بإيجاز شديد في سطر واحد",
    "actionTipAr": "تطبيق عملي فوري في جملة واحدة رشيقة"
  },
  "behavioralLoop": {
    "trigger": "المثير أو الحدث الأولي المحفز",
    "interpretation": "التفسير أو الفكرة التلقائية التي تصاعدت",
    "emotion": "الشعور أو الانفعال الجسدي المتولد",
    "action": "السلوك أو ردة الفعل الناتجة",
    "immediatePayoff": "المكسب الفوري الخفي للتصرف",
    "delayedCost": "الكلفة المتأخرة والتبعات السلبية"
  },
  "signals": {
    "whatToObserve": [
      "مؤشر سلوكي سياقي دقيق لملاحظته...",
      "مؤشر ثانٍ محدد...",
      "مؤشر ثالث محدد..."
    ],
    "practicalActions": [
      "إجراء عملي فوري ومحدد...",
      "إجراء ثانٍ...",
      "إجراء ثالث..."
    ],
    "professionalAlerts": [
      "مؤشر خطر حاسم يستوجب الحسم أو الاستشارة...",
      "مؤشر ثانٍ...",
      "مؤشر ثالث..."
    ]
  },
  "changePlan": {
    "step24Hours": "إجراء سلوكي حاسم محدد خلال 24 ساعة في جملة واحدة مكثفة",
    "todayPlan": "خطة اليوم الميدانية في جملة واحدة رشيقة",
    "weeklyPlan": "خطة الأسبوع للتثبيت في جملة واحدة رشيقة",
    "monthlyPlan": "خطة الشهر لإعادة الضبط في جملة واحدة رشيقة",
    "ifThenRule": "إذا حدث الموقف المثير، فإنني سأتصرف بالاستجابة البديلة المحددة",
    "progressIndicators": [
      "مؤشر قياس أول محدد",
      "مؤشر قياس ثانٍ محدد",
      "مؤشر قياس ثالث محدد"
    ],
    "relapseProtocol": "بروتوكول احتواء التعثر والانتكاس السلوكي في جملة واحدة حكيمة"
  },
  "referencedSciences": [
    {
      "id": "معرف العلم",
      "nameAr": "اسم العلم",
      "authorAr": "اسم العالم",
      "referenceAr": "المرجع الأكاديمي والكتاب",
      "officialUrl": "الرابط الرسمي",
      "summaryAr": "تفسير تطبيقي محدد لهذا العلم في هذه الحالة",
      "keyConceptAr": "المفهوم المحوري المطبق"
    }
  ]
}
`.trim();

    const { text: responseText } = await generateWithFallback(gemini, {
      contents: userPrompt,
      systemInstruction: SYSTEM_INSTRUCTION_ANALYZE,
      responseMimeType: 'application/json',
      temperature: 0.25
    });

    if (responseText) {
      const parsed = JSON.parse(responseText.trim());
      return res.json(parsed);
    }

    return res.status(500).json({ error: 'Empty response from analysis engine' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error running AI';
    return res.status(500).json({ error: msg });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hstyle Decode server running on port ${PORT}`);
  });
}

startServer();

