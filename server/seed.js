const { sequelize, Category, Quiz, Question, Answer } = require('./models');

// مكتبة الأسئلة المتخصصة لكل موضوع
const questionBank = {
    'أساسيات البرمجة': [
        { text: 'ما هي لغة البرمجة الأكثر شيوعاً في تطوير المواقع؟', difficulty: 'سهل', answers: ['JavaScript', 'Python', 'C++', 'Ruby'], correct: 0 },
        { text: 'ما الفرق بين var و let في JavaScript؟', difficulty: 'متوسط', answers: ['let له block scope', 'var أسرع', 'لا فرق', 'let قديمة'], correct: 0 },
        { text: 'ما هو الـ Recursion في البرمجة؟', difficulty: 'صعب', answers: ['دالة تستدعي نفسها', 'حلقة تكرارية', 'نوع من المتغيرات', 'خوارزمية بحث'], correct: 0 },
        { text: 'ما هو الناتج من: console.log(typeof null)؟', difficulty: 'صعب', answers: ['object', 'null', 'undefined', 'number'], correct: 0 },
        { text: 'أي من التالي يستخدم لتعريف ثابت في JavaScript؟', difficulty: 'سهل', answers: ['const', 'var', 'let', 'static'], correct: 0 },
        { text: 'ما هي الـ Array في البرمجة؟', difficulty: 'سهل', answers: ['مصفوفة لتخزين عدة قيم', 'متغير واحد', 'دالة', 'كلاس'], correct: 0 },
        { text: 'ما الفرق بين == و === في JavaScript؟', difficulty: 'متوسط', answers: ['=== تقارن القيمة والنوع', '== أسرع', 'لا فرق', '=== للنصوص فقط'], correct: 0 },
        { text: 'ما هو الـ Callback Function؟', difficulty: 'متوسط', answers: ['دالة تُمرر كمعامل لدالة أخرى', 'دالة تُنفذ أولاً', 'دالة بدون معاملات', 'دالة رياضية'], correct: 0 }
    ],
    'نظام التشغيل': [
        { text: 'ما هو نظام التشغيل الأكثر استخداماً في الخوادم؟', difficulty: 'متوسط', answers: ['Linux', 'Windows', 'macOS', 'Android'], correct: 0 },
        { text: 'ما وظيفة الـ Kernel في نظام التشغيل؟', difficulty: 'صعب', answers: ['إدارة الموارد والتواصل مع العتاد', 'واجهة المستخدم', 'تشغيل البرامج', 'حماية الملفات'], correct: 0 },
        { text: 'أي من التالي هو نظام تشغيل مفتوح المصدر؟', difficulty: 'سهل', answers: ['Ubuntu', 'Windows 11', 'macOS', 'iOS'], correct: 0 },
        { text: 'ما هو الـ Process في نظام التشغيل؟', difficulty: 'متوسط', answers: ['برنامج قيد التنفيذ', 'ملف على القرص', 'جهاز متصل', 'نافذة مفتوحة'], correct: 0 },
        { text: 'ما الفرق بين Thread و Process؟', difficulty: 'صعب', answers: ['Thread أخف وزناً ويشارك الذاكرة', 'Process أسرع', 'لا فرق', 'Thread للخوادم فقط'], correct: 0 },
        { text: 'ما هي الـ Virtual Memory؟', difficulty: 'صعب', answers: ['استخدام القرص كذاكرة إضافية', 'ذاكرة سحابية', 'ذاكرة مؤقتة', 'ذاكرة للألعاب'], correct: 0 },
        { text: 'أي أمر يستخدم لعرض العمليات الجارية في Linux؟', difficulty: 'متوسط', answers: ['ps', 'ls', 'cd', 'mkdir'], correct: 0 },
        { text: 'ما هو الـ File System؟', difficulty: 'سهل', answers: ['نظام تنظيم الملفات', 'برنامج حماية', 'متصفح ملفات', 'قرص صلب'], correct: 0 }
    ],
    'الشبكات': [
        { text: 'ما هو بروتوكول TCP/IP؟', difficulty: 'صعب', answers: ['بروتوكول نقل البيانات عبر الإنترنت', 'برنامج حماية', 'نوع من الكابلات', 'جهاز شبكة'], correct: 0 },
        { text: 'ما معنى IP Address؟', difficulty: 'سهل', answers: ['عنوان الجهاز على الشبكة', 'اسم المستخدم', 'كلمة المرور', 'نوع الاتصال'], correct: 0 },
        { text: 'ما الفرق بين IPv4 و IPv6؟', difficulty: 'صعب', answers: ['IPv6 يدعم عناوين أكثر', 'IPv4 أسرع', 'لا فرق', 'IPv6 للشركات فقط'], correct: 0 },
        { text: 'ما هو الـ DNS؟', difficulty: 'متوسط', answers: ['نظام تحويل أسماء النطاقات لعناوين IP', 'برنامج حماية', 'نوع من الخوادم', 'بروتوكول أمان'], correct: 0 },
        { text: 'ما هو المنفذ (Port) في الشبكات؟', difficulty: 'متوسط', answers: ['رقم يحدد التطبيق المستقبل للبيانات', 'كابل الشبكة', 'جهاز توجيه', 'عنوان IP'], correct: 0 },
        { text: 'ما هو الـ Router؟', difficulty: 'سهل', answers: ['جهاز توجيه البيانات بين الشبكات', 'كابل شبكة', 'برنامج', 'خادم'], correct: 0 },
        { text: 'ما هو بروتوكول HTTPS؟', difficulty: 'متوسط', answers: ['HTTP مع تشفير SSL/TLS', 'نسخة قديمة من HTTP', 'بروتوكول للبريد', 'نوع من الخوادم'], correct: 0 },
        { text: 'ما الفرق بين Switch و Hub؟', difficulty: 'صعب', answers: ['Switch أذكى ويرسل للجهاز المحدد', 'Hub أسرع', 'لا فرق', 'Switch للواي فاي فقط'], correct: 0 }
    ],
    'الذكاء الاصطناعي': [
        { text: 'ما هو Machine Learning؟', difficulty: 'متوسط', answers: ['تعليم الآلة من البيانات', 'برمجة الروبوتات', 'تصميم الألعاب', 'إنشاء المواقع'], correct: 0 },
        { text: 'ما الفرق بين AI و ML؟', difficulty: 'صعب', answers: ['ML جزء من AI', 'AI أقدم', 'لا فرق', 'ML للشركات فقط'], correct: 0 },
        { text: 'ما هو Neural Network؟', difficulty: 'صعب', answers: ['شبكة عصبية تحاكي الدماغ', 'نوع من الإنترنت', 'برنامج حماية', 'لغة برمجة'], correct: 0 },
        { text: 'ما هو Deep Learning؟', difficulty: 'صعب', answers: ['تعلم عميق بشبكات عصبية متعددة الطبقات', 'تعلم بطيء', 'نوع من قواعد البيانات', 'لغة برمجة'], correct: 0 },
        { text: 'أي من التالي مثال على AI؟', difficulty: 'سهل', answers: ['Siri و Alexa', 'Microsoft Word', 'Google Chrome', 'Windows'], correct: 0 },
        { text: 'ما هو NLP في الذكاء الاصطناعي؟', difficulty: 'متوسط', answers: ['معالجة اللغة الطبيعية', 'برمجة الشبكات', 'نظام تشغيل', 'قاعدة بيانات'], correct: 0 },
        { text: 'ما هو Computer Vision؟', difficulty: 'متوسط', answers: ['تمكين الحاسوب من فهم الصور', 'شاشة الحاسوب', 'برنامج تصميم', 'نظارات ذكية'], correct: 0 },
        { text: 'من هو رائد الذكاء الاصطناعي؟', difficulty: 'متوسط', answers: ['Alan Turing', 'Bill Gates', 'Steve Jobs', 'Mark Zuckerberg'], correct: 0 }
    ],
    'الأمن السيبراني': [
        { text: 'ما هو الـ Firewall؟', difficulty: 'سهل', answers: ['جدار حماية يراقب حركة البيانات', 'برنامج تصفح', 'نوع من الفيروسات', 'جهاز تخزين'], correct: 0 },
        { text: 'ما هو الـ Phishing؟', difficulty: 'متوسط', answers: ['محاولة سرقة معلومات عبر رسائل مزيفة', 'نوع من الفيروسات', 'برنامج حماية', 'تقنية تشفير'], correct: 0 },
        { text: 'ما هو الـ Encryption؟', difficulty: 'متوسط', answers: ['تشفير البيانات لحمايتها', 'ضغط الملفات', 'نسخ احتياطي', 'حذف البيانات'], correct: 0 },
        { text: 'ما الفرق بين Virus و Malware؟', difficulty: 'صعب', answers: ['Virus نوع من Malware', 'Virus أخطر', 'لا فرق', 'Malware للهواتف فقط'], correct: 0 },
        { text: 'ما هو Two-Factor Authentication؟', difficulty: 'متوسط', answers: ['مصادقة ثنائية بخطوتين', 'كلمة مرور طويلة', 'نوع من التشفير', 'برنامج حماية'], correct: 0 },
        { text: 'ما هو الـ VPN؟', difficulty: 'سهل', answers: ['شبكة خاصة افتراضية للخصوصية', 'متصفح إنترنت', 'برنامج مكافح فيروسات', 'نوع من الخوادم'], correct: 0 },
        { text: 'ما هو SQL Injection؟', difficulty: 'صعب', answers: ['هجوم على قواعد البيانات عبر استعلامات ضارة', 'نوع من الفيروسات', 'لغة برمجة', 'برنامج حماية'], correct: 0 },
        { text: 'ما هو الـ DDoS Attack؟', difficulty: 'صعب', answers: ['هجوم بإغراق الخادم بطلبات كثيرة', 'فيروس', 'برنامج تجسس', 'تقنية تشفير'], correct: 0 }
    ],
    'قواعد البيانات': [
        { text: 'ما هو SQL؟', difficulty: 'سهل', answers: ['لغة استعلام قواعد البيانات', 'نظام تشغيل', 'لغة برمجة ويب', 'برنامج تصميم'], correct: 0 },
        { text: 'ما الفرق بين SQL و NoSQL؟', difficulty: 'صعب', answers: ['SQL علائقية، NoSQL غير علائقية', 'SQL أحدث', 'لا فرق', 'NoSQL للألعاب فقط'], correct: 0 },
        { text: 'ما هو Primary Key؟', difficulty: 'متوسط', answers: ['مفتاح فريد لتمييز السجلات', 'كلمة مرور', 'نوع بيانات', 'جدول'], correct: 0 },
        { text: 'ما هو الـ JOIN في SQL؟', difficulty: 'متوسط', answers: ['دمج بيانات من جداول متعددة', 'حذف بيانات', 'إنشاء جدول', 'نسخ احتياطي'], correct: 0 },
        { text: 'أي من التالي قاعدة بيانات NoSQL؟', difficulty: 'متوسط', answers: ['MongoDB', 'MySQL', 'PostgreSQL', 'Oracle'], correct: 0 },
        { text: 'ما هو الـ Index في قواعد البيانات؟', difficulty: 'صعب', answers: ['بنية لتسريع البحث', 'نوع من الجداول', 'أمر حذف', 'نوع بيانات'], correct: 0 },
        { text: 'ما معنى CRUD؟', difficulty: 'سهل', answers: ['Create, Read, Update, Delete', 'نوع من قواعد البيانات', 'لغة برمجة', 'برنامج'], correct: 0 },
        { text: 'ما هو Transaction في قواعد البيانات؟', difficulty: 'صعب', answers: ['مجموعة عمليات تُنفذ كوحدة واحدة', 'نقل بيانات', 'نوع من الجداول', 'أمر استعلام'], correct: 0 }
    ],
    'مفردات': [
        { text: 'ما معنى كلمة "Happy"؟', difficulty: 'سهل', answers: ['سعيد', 'حزين', 'غاضب', 'خائف'], correct: 0 },
        { text: 'ما معنى "Beautiful"؟', difficulty: 'سهل', answers: ['جميل', 'قبيح', 'كبير', 'صغير'], correct: 0 },
        { text: 'ما معنى "Difficult"؟', difficulty: 'سهل', answers: ['صعب', 'سهل', 'ممتع', 'مملّ'], correct: 0 },
        { text: 'ما معنى "Accomplish"؟', difficulty: 'متوسط', answers: ['يُنجز', 'يفشل', 'يبدأ', 'ينتهي'], correct: 0 },
        { text: 'ما معنى "Perseverance"؟', difficulty: 'صعب', answers: ['المثابرة', 'الكسل', 'السرعة', 'البطء'], correct: 0 },
        { text: 'ما معنى "Ambiguous"؟', difficulty: 'صعب', answers: ['غامض', 'واضح', 'سريع', 'بطيء'], correct: 0 },
        { text: 'ما معنى "Friend"؟', difficulty: 'سهل', answers: ['صديق', 'عدو', 'أخ', 'معلم'], correct: 0 },
        { text: 'ما معنى "Generous"؟', difficulty: 'متوسط', answers: ['كريم', 'بخيل', 'سريع', 'بطيء'], correct: 0 }
    ],
    'قواعد Grammar': [
        { text: 'ما الزمن الصحيح: "I ___ to school yesterday"؟', difficulty: 'سهل', answers: ['went', 'go', 'going', 'goes'], correct: 0 },
        { text: 'ما الصيغة الصحيحة: "She ___ a book now"؟', difficulty: 'سهل', answers: ['is reading', 'read', 'reads', 'reading'], correct: 0 },
        { text: 'ما الفرق بين "its" و "it\'s"؟', difficulty: 'متوسط', answers: ['its ملكية، it\'s اختصار it is', 'لا فرق', 'its للجمع', 'it\'s للماضي'], correct: 0 },
        { text: 'ما هو Past Perfect؟', difficulty: 'صعب', answers: ['had + past participle', 'have + past participle', 'will + verb', 'verb + ed'], correct: 0 },
        { text: 'متى نستخدم "a" ومتى "an"؟', difficulty: 'متوسط', answers: ['an قبل حرف علة', 'a للجمع', 'لا فرق', 'an للماضي'], correct: 0 },
        { text: 'ما هو الـ Passive Voice؟', difficulty: 'صعب', answers: ['المبني للمجهول', 'المبني للمعلوم', 'زمن المستقبل', 'الأمر'], correct: 0 },
        { text: 'ما الصيغة الصحيحة: "There ___ many books"؟', difficulty: 'متوسط', answers: ['are', 'is', 'was', 'be'], correct: 0 },
        { text: 'ما معنى Modal Verbs؟', difficulty: 'صعب', answers: ['أفعال ناقصة مثل can, should', 'أفعال عادية', 'أسماء', 'صفات'], correct: 0 }
    ],
    'محادثات': [
        { text: 'كيف تقول "صباح الخير" بالإنجليزية؟', difficulty: 'سهل', answers: ['Good morning', 'Good night', 'Good afternoon', 'Good evening'], correct: 0 },
        { text: 'ما الرد المناسب على "How are you?"؟', difficulty: 'سهل', answers: ['I\'m fine, thank you', 'Yes', 'No', 'Goodbye'], correct: 0 },
        { text: 'كيف تطلب المساعدة بأدب؟', difficulty: 'متوسط', answers: ['Could you help me, please?', 'Help!', 'You help', 'I need'], correct: 0 },
        { text: 'ما الفرق بين "Excuse me" و "Sorry"؟', difficulty: 'متوسط', answers: ['Excuse me للانتباه، Sorry للاعتذار', 'لا فرق', 'Sorry أقوى', 'Excuse me للأصدقاء'], correct: 0 },
        { text: 'كيف تعبر عن عدم الفهم بأدب؟', difficulty: 'متوسط', answers: ['I don\'t understand', 'What?', 'No', 'Stop'], correct: 0 },
        { text: 'ما الرد المناسب على "Thank you"؟', difficulty: 'سهل', answers: ['You\'re welcome', 'Yes', 'No', 'Goodbye'], correct: 0 },
        { text: 'كيف تقدم نفسك في مقابلة عمل؟', difficulty: 'صعب', answers: ['My name is... I have experience in...', 'Hi', 'Hello', 'Good'], correct: 0 },
        { text: 'كيف تعتذر بشكل رسمي؟', difficulty: 'متوسط', answers: ['I apologize for...', 'Sorry', 'My bad', 'Oops'], correct: 0 }
    ],
    'أفعال شائعة': [
        { text: 'ما معنى "eat"؟', difficulty: 'سهل', answers: ['يأكل', 'يشرب', 'ينام', 'يجري'], correct: 0 },
        { text: 'ما الماضي من "go"؟', difficulty: 'سهل', answers: ['went', 'goed', 'gone', 'going'], correct: 0 },
        { text: 'ما معنى "run"؟', difficulty: 'سهل', answers: ['يجري', 'يمشي', 'يقفز', 'يطير'], correct: 0 },
        { text: 'ما الماضي من "see"؟', difficulty: 'متوسط', answers: ['saw', 'seed', 'seen', 'seeing'], correct: 0 },
        { text: 'ما معنى "achieve"؟', difficulty: 'متوسط', answers: ['يحقق', 'يفشل', 'يبدأ', 'ينتهي'], correct: 0 },
        { text: 'ما الماضي من "bring"؟', difficulty: 'متوسط', answers: ['brought', 'bringed', 'brang', 'bringing'], correct: 0 },
        { text: 'ما معنى "comprehend"؟', difficulty: 'صعب', answers: ['يفهم', 'يكتب', 'يقرأ', 'يسمع'], correct: 0 },
        { text: 'ما الماضي من "teach"؟', difficulty: 'متوسط', answers: ['taught', 'teached', 'teaching', 'teach'], correct: 0 }
    ],
    'الاستماع Listening': [
        { text: 'ما أهمية الاستماع النشط؟', difficulty: 'متوسط', answers: ['فهم المتحدث بشكل أفضل', 'التحدث أسرع', 'الكتابة أفضل', 'القراءة أسرع'], correct: 0 },
        { text: 'كيف تحسن مهارة الاستماع؟', difficulty: 'صعب', answers: ['الممارسة المستمرة والتركيز', 'القراءة فقط', 'الكتابة فقط', 'النوم'], correct: 0 },
        { text: 'ما الفرق بين "hear" و "listen"؟', difficulty: 'صعب', answers: ['listen بتركيز، hear بدون قصد', 'لا فرق', 'hear أقوى', 'listen للموسيقى فقط'], correct: 0 },
        { text: 'ما أفضل طريقة لفهم اللهجات المختلفة؟', difficulty: 'صعب', answers: ['الاستماع لمتحدثين من بلدان مختلفة', 'القراءة', 'الكتابة', 'الحفظ'], correct: 0 },
        { text: 'ما فائدة الاستماع للبودكاست؟', difficulty: 'متوسط', answers: ['تحسين الفهم والمفردات', 'لا فائدة', 'للترفيه فقط', 'للنوم'], correct: 0 },
        { text: 'كيف تتعامل مع كلمة لا تفهمها أثناء الاستماع؟', difficulty: 'صعب', answers: ['حاول فهمها من السياق', 'توقف فوراً', 'اترك الاستماع', 'نم'], correct: 0 },
        { text: 'ما أهمية الاستماع للأخبار بالإنجليزية؟', difficulty: 'متوسط', answers: ['تعلم لغة رسمية ومفردات متقدمة', 'لا أهمية', 'للترفيه', 'للنوم'], correct: 0 },
        { text: 'ما الفرق بين British و American accent؟', difficulty: 'صعب', answers: ['اختلاف في النطق والمفردات', 'لا فرق', 'British أسهل', 'American أقدم'], correct: 0 }
    ]
};

// دالة لاختيار أسئلة عشوائية مع توزيع متوازن للصعوبة
const selectQuestions = (quizTitle, count) => {
    const bankQuestions = questionBank[quizTitle] || [];

    if (bankQuestions.length === 0) {
        // إذا لم تكن هناك أسئلة محددة، نستخدم أسئلة عامة
        return generateGenericQuestions(quizTitle, count);
    }

    // توزيع الصعوبة: 40% سهل، 40% متوسط، 20% صعب
    const easyCount = Math.ceil(count * 0.4);
    const mediumCount = Math.ceil(count * 0.4);
    const hardCount = count - easyCount - mediumCount;

    const easyQuestions = bankQuestions.filter(q => q.difficulty === 'سهل');
    const mediumQuestions = bankQuestions.filter(q => q.difficulty === 'متوسط');
    const hardQuestions = bankQuestions.filter(q => q.difficulty === 'صعب');

    const selected = [
        ...shuffleAndTake(easyQuestions, easyCount),
        ...shuffleAndTake(mediumQuestions, mediumCount),
        ...shuffleAndTake(hardQuestions, hardCount)
    ];

    return selected;
};

// دالة لخلط المصفوفة واختيار عدد معين
const shuffleAndTake = (arr, count) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

// دالة لإنشاء أسئلة عامة إذا لم تكن متوفرة في المكتبة
const generateGenericQuestions = (quizTitle, count) => {
    const questions = [];
    const difficulties = ['سهل', 'متوسط', 'صعب'];

    for (let i = 1; i <= count; i++) {
        const diffIndex = i <= count * 0.4 ? 0 : i <= count * 0.8 ? 1 : 2;
        questions.push({
            text: `سؤال ${i} عن ${quizTitle}؟`,
            difficulty: difficulties[diffIndex],
            answers: [
                'إجابة صحيحة',
                'إجابة خاطئة 1',
                'إجابة خاطئة 2',
                'إجابة خاطئة 3'
            ],
            correct: 0
        });
    }
    return questions;
};

const categoriesData = [
    {
        name: 'الذكاء الاصطناعي والتقنية',
        description: 'AI & Tech',
        quizzes: [
            { title: 'أساسيات البرمجة', difficulty: 'سهل' },
            { title: 'نظام التشغيل', difficulty: 'متوسط' },
            { title: 'الشبكات', difficulty: 'صعب' },
            { title: 'الذكاء الاصطناعي', difficulty: 'صعب' },
            { title: 'الأمن السيبراني', difficulty: 'صعب' },
            { title: 'قواعد البيانات', difficulty: 'متوسط' }
        ]
    },
    {
        name: 'اللغة الإنجليزية',
        description: 'English Learning',
        quizzes: [
            { title: 'مفردات', difficulty: 'سهل' },
            { title: 'قواعد Grammar', difficulty: 'متوسط' },
            { title: 'محادثات', difficulty: 'متوسط' },
            { title: 'أفعال شائعة', difficulty: 'سهل' },
            { title: 'الاستماع Listening', difficulty: 'صعب' }
        ]
    },
    {
        name: 'العلوم',
        description: 'Science',
        quizzes: []
    },
    {
        name: 'التاريخ',
        description: 'History',
        quizzes: []
    },
    {
        name: 'الجغرافيا',
        description: 'Geography',
        quizzes: []
    },
    {
        name: 'الأفلام والمسلسلات',
        description: 'Fun & Entertainment',
        quizzes: []
    },
    {
        name: 'الألعاب',
        description: 'Gaming',
        quizzes: []
    },
    {
        name: 'الرياضة',
        description: 'Sports',
        quizzes: []
    },
    {
        name: 'ألغاز وذكاء',
        description: 'Skills & IQ',
        quizzes: []
    },
    {
        name: 'أسئلة معلومات عامة',
        description: 'General Knowledge',
        quizzes: []
    },
    {
        name: 'الدين والثقافة',
        description: 'Religion & Culture',
        quizzes: []
    },
    {
        name: 'عالم الأعمال',
        description: 'Business',
        quizzes: []
    },
    {
        name: 'مواد دراسية',
        description: 'Student Subjects',
        quizzes: []
    }
];

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('Database synced for seeding.');

        for (const catData of categoriesData) {
            const [category, created] = await Category.findOrCreate({
                where: { name: catData.name },
                defaults: { description: catData.description }
            });

            if (created) {
                console.log(`Category created: ${category.name}`);
            } else {
                console.log(`Category exists: ${category.name}`);
            }

            for (const quizData of catData.quizzes) {
                const [quiz, quizCreated] = await Quiz.findOrCreate({
                    where: { title: quizData.title, CategoryId: category.id },
                    defaults: { difficulty: quizData.difficulty }
                });

                if (quizCreated) {
                    console.log(`  Quiz created: ${quiz.title}`);

                    // عدد عشوائي من الأسئلة بين 5 و 20
                    const questionCount = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
                    const questions = selectQuestions(quiz.title, questionCount);

                    for (const qData of questions) {
                        const question = await Question.create({
                            text: qData.text,
                            difficulty: qData.difficulty,
                            QuizId: quiz.id
                        });

                        // إنشاء الإجابات
                        for (let i = 0; i < qData.answers.length; i++) {
                            await Answer.create({
                                text: qData.answers[i],
                                isCorrect: i === qData.correct,
                                QuestionId: question.id
                            });
                        }
                    }
                    console.log(`    Added ${questionCount} questions to ${quiz.title}`);
                } else {
                    console.log(`  Quiz exists: ${quiz.title}`);
                }
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
