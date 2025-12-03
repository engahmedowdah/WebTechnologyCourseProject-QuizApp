// LocalStorage service for managing categories and quizzes
// Implements auto-increment IDs (last ID + 1)

const CATEGORIES_KEY = 'quiz_app_categories';
const QUIZZES_KEY = 'quiz_app_quizzes';

// مكتبة الأسئلة المتخصصة مع مستويات صعوبة مختلفة
const questionBank = {
    'العلوم': [
        { q: 'ما هو رمز الماء الكيميائي؟', opts: ['H2O', 'CO2', 'O2', 'N2'], ans: 0, diff: 'سهل' },
        { q: 'كم عدد الكواكب في المجموعة الشمسية؟', opts: ['7', '8', '9', '10'], ans: 1, diff: 'سهل' },
        { q: 'ما هو أكبر كوكب في المجموعة الشمسية؟', opts: ['المشتري', 'زحل', 'الأرض', 'المريخ'], ans: 0, diff: 'سهل' },
        { q: 'ما هي وحدة قياس القوة؟', opts: ['نيوتن', 'جول', 'واط', 'فولت'], ans: 0, diff: 'متوسط' },
        { q: 'كم عدد عظام جسم الإنسان البالغ؟', opts: ['206', '208', '210', '212'], ans: 0, diff: 'متوسط' },
        { q: 'ما هو أقرب كوكب للشمس؟', opts: ['الزهرة', 'عطارد', 'المريخ', 'الأرض'], ans: 1, diff: 'متوسط' },
        { q: 'ما هي سرعة الضوء تقريباً؟', opts: ['300,000 كم/ث', '150,000 كم/ث', '500,000 كم/ث', '100,000 كم/ث'], ans: 0, diff: 'صعب' },
        { q: 'كم عدد أقمار كوكب المريخ؟', opts: ['1', '2', '3', '4'], ans: 1, diff: 'صعب' },
        { q: 'ما هو العنصر الأكثر وفرة في الكون؟', opts: ['الأكسجين', 'الهيدروجين', 'الكربون', 'النيتروجين'], ans: 1, diff: 'صعب' },
        { q: 'ما هي درجة غليان الماء؟', opts: ['90°C', '100°C', '110°C', '120°C'], ans: 1, diff: 'سهل' },
        { q: 'ما هو الغاز الذي نتنفسه؟', opts: ['الأكسجين', 'النيتروجين', 'ثاني أكسيد الكربون', 'الهيدروجين'], ans: 0, diff: 'سهل' },
        { q: 'ما هي الطبقة التي تحمي الأرض من الأشعة فوق البنفسجية؟', opts: ['الأوزون', 'الغلاف الجوي', 'الستراتوسفير', 'التروبوسفير'], ans: 0, diff: 'متوسط' },
        { q: 'ما هو الكوكب الأحمر؟', opts: ['المريخ', 'الزهرة', 'المشتري', 'زحل'], ans: 0, diff: 'سهل' },
        { q: 'كم تبلغ درجة حرارة الشمس السطحية تقريباً؟', opts: ['5,500°C', '10,000°C', '15,000°C', '20,000°C'], ans: 0, diff: 'صعب' },
        { q: 'ما هو أصغر كوكب في المجموعة الشمسية؟', opts: ['عطارد', 'المريخ', 'الأرض', 'الزهرة'], ans: 0, diff: 'متوسط' }
    ],
    'الرياضيات': [
        { q: 'ما هو ناتج 5 × 6؟', opts: ['25', '30', '35', '40'], ans: 1, diff: 'سهل' },
        { q: 'ما هو جذر 64؟', opts: ['6', '7', '8', '9'], ans: 2, diff: 'سهل' },
        { q: 'ما هو ناتج 12 ÷ 3؟', opts: ['3', '4', '5', '6'], ans: 1, diff: 'سهل' },
        { q: 'ما هو مجموع زوايا المثلث؟', opts: ['90°', '180°', '270°', '360°'], ans: 1, diff: 'متوسط' },
        { q: 'ما هو ناتج 2³؟', opts: ['4', '6', '8', '10'], ans: 2, diff: 'متوسط' },
        { q: 'ما هي قيمة π تقريباً؟', opts: ['3.14', '2.71', '1.41', '4.14'], ans: 0, diff: 'متوسط' },
        { q: 'ما هو ناتج 15 + 27؟', opts: ['40', '42', '44', '46'], ans: 1, diff: 'سهل' },
        { q: 'كم عدد أضلاع المسدس؟', opts: ['5', '6', '7', '8'], ans: 1, diff: 'سهل' },
        { q: 'ما هو ناتج 9 × 9؟', opts: ['72', '81', '90', '99'], ans: 1, diff: 'سهل' },
        { q: 'ما هو مجموع زوايا المربع؟', opts: ['180°', '270°', '360°', '450°'], ans: 2, diff: 'متوسط' },
        { q: 'ما هو ناتج 100 ÷ 4؟', opts: ['20', '25', '30', '35'], ans: 1, diff: 'سهل' },
        { q: 'ما هو جذر 144؟', opts: ['10', '11', '12', '13'], ans: 2, diff: 'متوسط' },
        { q: 'ما هو ناتج 7²؟', opts: ['14', '49', '56', '63'], ans: 1, diff: 'متوسط' },
        { q: 'ما هي قيمة e (عدد أويلر) تقريباً؟', opts: ['2.71', '3.14', '1.41', '1.73'], ans: 0, diff: 'صعب' },
        { q: 'ما هو مشتق x²؟', opts: ['x', '2x', 'x²', '2'], ans: 1, diff: 'صعب' }
    ],
    'التاريخ': [
        { q: 'في أي عام هجري كانت الهجرة النبوية؟', opts: ['1 هـ', '2 هـ', '3 هـ', '4 هـ'], ans: 0, diff: 'سهل' },
        { q: 'من هو أول خليفة راشدي؟', opts: ['عمر بن الخطاب', 'أبو بكر الصديق', 'عثمان بن عفان', 'علي بن أبي طالب'], ans: 1, diff: 'سهل' },
        { q: 'في أي قرن كانت الحرب العالمية الأولى؟', opts: ['القرن 18', 'القرن 19', 'القرن 20', 'القرن 21'], ans: 2, diff: 'متوسط' },
        { q: 'من فتح القسطنطينية؟', opts: ['صلاح الدين', 'محمد الفاتح', 'سليمان القانوني', 'عمر بن الخطاب'], ans: 1, diff: 'متوسط' },
        { q: 'في أي عام ميلادي توحدت المملكة العربية السعودية؟', opts: ['1902', '1932', '1945', '1950'], ans: 1, diff: 'متوسط' },
        { q: 'من هو مؤسس الدولة السعودية الأولى؟', opts: ['الملك عبدالعزيز', 'محمد بن سعود', 'تركي بن عبدالله', 'فيصل بن تركي'], ans: 1, diff: 'متوسط' },
        { q: 'في أي عام سقطت الدولة العباسية؟', opts: ['1258م', '1492م', '1517م', '1798م'], ans: 0, diff: 'صعب' },
        { q: 'من هو قائد معركة حطين؟', opts: ['صلاح الدين الأيوبي', 'نور الدين زنكي', 'قطز', 'بيبرس'], ans: 0, diff: 'متوسط' },
        { q: 'في أي قرن عاش ابن سينا؟', opts: ['القرن 9', 'القرن 10', 'القرن 11', 'القرن 12'], ans: 2, diff: 'صعب' },
        { q: 'ما هي أول دولة استخدمت الطباعة؟', opts: ['الصين', 'ألمانيا', 'إيطاليا', 'إنجلترا'], ans: 0, diff: 'صعب' },
        { q: 'من هو النبي الذي بُعث قبل الإسلام؟', opts: ['موسى', 'عيسى', 'إبراهيم', 'جميع ما سبق'], ans: 3, diff: 'سهل' },
        { q: 'في أي عام كانت غزوة بدر؟', opts: ['2 هـ', '3 هـ', '4 هـ', '5 هـ'], ans: 0, diff: 'متوسط' },
        { q: 'من هو آخر الخلفاء الراشدين؟', opts: ['عمر بن الخطاب', 'عثمان بن عفان', 'علي بن أبي طالب', 'أبو بكر الصديق'], ans: 2, diff: 'سهل' },
        { q: 'في أي عام انتهت الحرب العالمية الثانية؟', opts: ['1943', '1944', '1945', '1946'], ans: 2, diff: 'متوسط' },
        { q: 'من بنى سور الصين العظيم؟', opts: ['أسرة تشين', 'أسرة هان', 'أسرة مينغ', 'جميع ما سبق'], ans: 3, diff: 'صعب' }
    ],
    'الجغرافيا': [
        { q: 'ما هي عاصمة المملكة العربية السعودية؟', opts: ['جدة', 'الرياض', 'مكة', 'الدمام'], ans: 1, diff: 'سهل' },
        { q: 'ما هو أطول نهر في العالم؟', opts: ['النيل', 'الأمازون', 'اليانغتسي', 'المسيسيبي'], ans: 0, diff: 'متوسط' },
        { q: 'كم عدد قارات العالم؟', opts: ['5', '6', '7', '8'], ans: 2, diff: 'سهل' },
        { q: 'ما هي أكبر صحراء في العالم؟', opts: ['الصحراء الكبرى', 'صحراء الربع الخالي', 'صحراء جوبي', 'صحراء أتاكاما'], ans: 0, diff: 'متوسط' },
        { q: 'ما هو أعلى جبل في العالم؟', opts: ['كليمنجارو', 'إفرست', 'الألب', 'الأنديز'], ans: 1, diff: 'سهل' },
        { q: 'ما هي عاصمة مصر؟', opts: ['الإسكندرية', 'القاهرة', 'الجيزة', 'أسوان'], ans: 1, diff: 'سهل' },
        { q: 'في أي قارة تقع البرازيل؟', opts: ['أفريقيا', 'آسيا', 'أمريكا الجنوبية', 'أوروبا'], ans: 2, diff: 'سهل' },
        { q: 'ما هو أكبر محيط في العالم؟', opts: ['المحيط الأطلسي', 'المحيط الهندي', 'المحيط الهادئ', 'المحيط المتجمد'], ans: 2, diff: 'متوسط' },
        { q: 'كم عدد دول الخليج العربي؟', opts: ['5', '6', '7', '8'], ans: 1, diff: 'سهل' },
        { q: 'ما هي عاصمة اليابان؟', opts: ['طوكيو', 'كيوتو', 'أوساكا', 'هيروشيما'], ans: 0, diff: 'سهل' },
        { q: 'ما هي أكبر دولة في العالم من حيث المساحة؟', opts: ['كندا', 'الصين', 'روسيا', 'الولايات المتحدة'], ans: 2, diff: 'متوسط' },
        { q: 'ما هو أعمق محيط في العالم؟', opts: ['المحيط الأطلسي', 'المحيط الهندي', 'المحيط الهادئ', 'المحيط المتجمد'], ans: 2, diff: 'صعب' },
        { q: 'ما هي عاصمة فرنسا؟', opts: ['باريس', 'ليون', 'مرسيليا', 'نيس'], ans: 0, diff: 'سهل' },
        { q: 'كم عدد الدول العربية؟', opts: ['20', '22', '24', '26'], ans: 1, diff: 'متوسط' },
        { q: 'ما هي أصغر قارة في العالم؟', opts: ['أوروبا', 'أستراليا', 'أنتاركتيكا', 'أمريكا الجنوبية'], ans: 1, diff: 'صعب' }
    ],
    'اللغة العربية': [
        { q: 'كم عدد حروف اللغة العربية؟', opts: ['26', '27', '28', '29'], ans: 2, diff: 'سهل' },
        { q: 'ما هو جمع كلمة "كتاب"؟', opts: ['كتب', 'كتابات', 'كتائب', 'كتبة'], ans: 0, diff: 'سهل' },
        { q: 'ما هي علامة الجر؟', opts: ['الفتحة', 'الضمة', 'الكسرة', 'السكون'], ans: 2, diff: 'متوسط' },
        { q: 'ما هو مثنى كلمة "قلم"؟', opts: ['قلمان', 'قلمين', 'أقلام', 'قلمون'], ans: 0, diff: 'سهل' },
        { q: 'كم عدد أنواع الكلمة في اللغة العربية؟', opts: ['2', '3', '4', '5'], ans: 1, diff: 'متوسط' },
        { q: 'ما هو ضد كلمة "كبير"؟', opts: ['صغير', 'قصير', 'ضعيف', 'قليل'], ans: 0, diff: 'سهل' },
        { q: 'ما هي أداة النصب؟', opts: ['لم', 'لن', 'لا', 'ليس'], ans: 1, diff: 'متوسط' },
        { q: 'كم عدد أحرف العلة؟', opts: ['2', '3', '4', '5'], ans: 1, diff: 'سهل' },
        { q: 'ما هو جمع كلمة "رجل"؟', opts: ['رجال', 'رجول', 'أرجل', 'رجلون'], ans: 0, diff: 'سهل' },
        { q: 'ما هي علامة الرفع للمثنى؟', opts: ['الألف', 'الواو', 'الياء', 'النون'], ans: 0, diff: 'متوسط' },
        { q: 'ما هو الفاعل في جملة "كتب الطالب الدرس"؟', opts: ['كتب', 'الطالب', 'الدرس', 'لا يوجد'], ans: 1, diff: 'متوسط' },
        { q: 'ما هي أنواع الجموع في اللغة العربية؟', opts: ['2', '3', '4', '5'], ans: 1, diff: 'صعب' },
        { q: 'ما هو المفعول به في "أكل الولد التفاحة"؟', opts: ['أكل', 'الولد', 'التفاحة', 'لا يوجد'], ans: 2, diff: 'متوسط' },
        { q: 'ما هي علامة الجزم؟', opts: ['الفتحة', 'الضمة', 'الكسرة', 'السكون'], ans: 3, diff: 'صعب' },
        { q: 'كم عدد بحور الشعر العربي؟', opts: ['12', '14', '16', '18'], ans: 2, diff: 'صعب' }
    ],
    'اللغة الإنجليزية': [
        { q: 'What is the capital of England?', opts: ['Manchester', 'London', 'Liverpool', 'Birmingham'], ans: 1, diff: 'سهل' },
        { q: 'How many letters are in the English alphabet?', opts: ['24', '25', '26', '27'], ans: 2, diff: 'سهل' },
        { q: 'What is the past tense of "go"?', opts: ['goed', 'went', 'gone', 'going'], ans: 1, diff: 'متوسط' },
        { q: 'What is the plural of "child"?', opts: ['childs', 'childes', 'children', 'childrens'], ans: 2, diff: 'متوسط' },
        { q: 'Which word is a noun?', opts: ['run', 'quickly', 'book', 'happy'], ans: 2, diff: 'سهل' },
        { q: 'What is the opposite of "hot"?', opts: ['warm', 'cool', 'cold', 'freezing'], ans: 2, diff: 'سهل' },
        { q: 'How do you spell the number 8?', opts: ['eigt', 'eight', 'eihgt', 'eigth'], ans: 1, diff: 'سهل' },
        { q: 'What is the comparative form of "good"?', opts: ['gooder', 'more good', 'better', 'best'], ans: 2, diff: 'متوسط' },
        { q: 'Which is a pronoun?', opts: ['table', 'run', 'he', 'quickly'], ans: 2, diff: 'سهل' },
        { q: 'What is the past tense of "eat"?', opts: ['eated', 'ate', 'eaten', 'eating'], ans: 1, diff: 'متوسط' },
        { q: 'What is the superlative form of "bad"?', opts: ['badder', 'baddest', 'worse', 'worst'], ans: 3, diff: 'صعب' },
        { q: 'Which sentence is correct?', opts: ['He don\'t like it', 'He doesn\'t like it', 'He not like it', 'He no like it'], ans: 1, diff: 'متوسط' },
        { q: 'What is a synonym for "happy"?', opts: ['sad', 'joyful', 'angry', 'tired'], ans: 1, diff: 'سهل' },
        { q: 'What is the past participle of "write"?', opts: ['wrote', 'written', 'writing', 'writed'], ans: 1, diff: 'صعب' },
        { q: 'Which is an adverb?', opts: ['quick', 'quickly', 'quickness', 'quicker'], ans: 1, diff: 'صعب' }
    ],
    'الفيزياء': [
        { q: 'ما هي وحدة قياس القوة؟', opts: ['نيوتن', 'جول', 'واط', 'فولت'], ans: 0, diff: 'متوسط' },
        { q: 'ما هي سرعة الضوء في الفراغ؟', opts: ['300,000 كم/ث', '150,000 كم/ث', '500,000 كم/ث', '100,000 كم/ث'], ans: 0, diff: 'صعب' },
        { q: 'ما هي وحدة قياس الطاقة؟', opts: ['نيوتن', 'جول', 'واط', 'أمبير'], ans: 1, diff: 'متوسط' },
        { q: 'من وضع قوانين الحركة الثلاثة؟', opts: ['أينشتاين', 'نيوتن', 'جاليليو', 'كبلر'], ans: 1, diff: 'سهل' },
        { q: 'ما هي وحدة قياس التيار الكهربائي؟', opts: ['فولت', 'أوم', 'أمبير', 'واط'], ans: 2, diff: 'متوسط' },
        { q: 'ما هي قيمة تسارع الجاذبية الأرضية؟', opts: ['9.8 م/ث²', '10 م/ث²', '8.9 م/ث²', '11 م/ث²'], ans: 0, diff: 'صعب' },
        { q: 'ما هي وحدة قياس المقاومة الكهربائية؟', opts: ['فولت', 'أمبير', 'أوم', 'واط'], ans: 2, diff: 'متوسط' },
        { q: 'ما هو قانون أوم؟', opts: ['V = I × R', 'V = I / R', 'V = I + R', 'V = I - R'], ans: 0, diff: 'صعب' },
        { q: 'ما هي وحدة قياس التردد؟', opts: ['هيرتز', 'ديسيبل', 'واط', 'جول'], ans: 0, diff: 'متوسط' },
        { q: 'من اكتشف نظرية النسبية؟', opts: ['نيوتن', 'أينشتاين', 'هوكينج', 'بلانك'], ans: 1, diff: 'سهل' },
        { q: 'ما هي وحدة قياس الضغط؟', opts: ['نيوتن', 'باسكال', 'جول', 'واط'], ans: 1, diff: 'متوسط' },
        { q: 'ما هو قانون نيوتن الأول؟', opts: ['قانون القصور الذاتي', 'F=ma', 'الفعل ورد الفعل', 'قانون الجذب'], ans: 0, diff: 'صعب' },
        { q: 'ما هي وحدة قياس القدرة؟', opts: ['نيوتن', 'جول', 'واط', 'أمبير'], ans: 2, diff: 'متوسط' },
        { q: 'ما هي سرعة الصوت في الهواء تقريباً؟', opts: ['340 م/ث', '440 م/ث', '540 م/ث', '640 م/ث'], ans: 0, diff: 'صعب' },
        { q: 'ما هو الطيف المرئي؟', opts: ['الضوء الذي نراه', 'الأشعة فوق البنفسجية', 'الأشعة تحت الحمراء', 'الأشعة السينية'], ans: 0, diff: 'سهل' }
    ],
    'الكيمياء': [
        { q: 'ما هو رمز الماء الكيميائي؟', opts: ['H2O', 'CO2', 'O2', 'N2'], ans: 0, diff: 'سهل' },
        { q: 'ما هو العدد الذري للهيدروجين؟', opts: ['1', '2', '3', '4'], ans: 0, diff: 'سهل' },
        { q: 'ما هو رمز عنصر الذهب؟', opts: ['Go', 'Au', 'Gd', 'Ag'], ans: 1, diff: 'متوسط' },
        { q: 'كم عدد عناصر الجدول الدوري تقريباً؟', opts: ['92', '108', '118', '128'], ans: 2, diff: 'صعب' },
        { q: 'ما هو رمز ثاني أكسيد الكربون؟', opts: ['CO', 'CO2', 'C2O', 'O2C'], ans: 1, diff: 'سهل' },
        { q: 'ما هي الصيغة الكيميائية لملح الطعام؟', opts: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], ans: 0, diff: 'متوسط' },
        { q: 'ما هو رمز عنصر الحديد؟', opts: ['Fe', 'Ir', 'Fr', 'Hd'], ans: 0, diff: 'سهل' },
        { q: 'ما هو الرقم الهيدروجيني للماء النقي؟', opts: ['6', '7', '8', '9'], ans: 1, diff: 'متوسط' },
        { q: 'ما هو رمز عنصر الفضة؟', opts: ['Si', 'Ag', 'Al', 'Ar'], ans: 1, diff: 'متوسط' },
        { q: 'كم عدد إلكترونات ذرة الكربون؟', opts: ['4', '6', '8', '12'], ans: 1, diff: 'صعب' },
        { q: 'ما هو رمز عنصر الأكسجين؟', opts: ['O', 'Ox', 'O2', 'Og'], ans: 0, diff: 'سهل' },
        { q: 'ما هي الصيغة الكيميائية للسكر (الجلوكوز)؟', opts: ['C6H12O6', 'C12H22O11', 'CH4', 'C2H5OH'], ans: 0, diff: 'صعب' },
        { q: 'ما هو رمز عنصر النيتروجين؟', opts: ['N', 'Ni', 'Na', 'Ne'], ans: 0, diff: 'سهل' },
        { q: 'ما هي حالات المادة الأساسية؟', opts: ['2', '3', '4', '5'], ans: 1, diff: 'سهل' },
        { q: 'ما هو رمز عنصر الكالسيوم؟', opts: ['C', 'Ca', 'Cl', 'Co'], ans: 1, diff: 'متوسط' }
    ],
    'الأحياء': [
        { q: 'كم عدد عظام جسم الإنسان البالغ؟', opts: ['206', '208', '210', '212'], ans: 0, diff: 'متوسط' },
        { q: 'ما هو أكبر عضو في جسم الإنسان؟', opts: ['الكبد', 'الجلد', 'القلب', 'الدماغ'], ans: 1, diff: 'سهل' },
        { q: 'كم عدد حجرات القلب؟', opts: ['2', '3', '4', '5'], ans: 2, diff: 'سهل' },
        { q: 'ما هي وظيفة خلايا الدم الحمراء؟', opts: ['مقاومة الأمراض', 'نقل الأكسجين', 'تخثر الدم', 'إنتاج الطاقة'], ans: 1, diff: 'متوسط' },
        { q: 'ما هو العضو المسؤول عن تنقية الدم؟', opts: ['الكبد', 'الكلى', 'الطحال', 'البنكرياس'], ans: 1, diff: 'متوسط' },
        { q: 'كم عدد الكروموسومات في الخلية البشرية؟', opts: ['23', '46', '48', '92'], ans: 1, diff: 'صعب' },
        { q: 'ما هي وحدة بناء الكائن الحي؟', opts: ['النسيج', 'الخلية', 'العضو', 'الجهاز'], ans: 1, diff: 'سهل' },
        { q: 'ما هو الغاز الذي تطلقه النباتات؟', opts: ['ثاني أكسيد الكربون', 'الأكسجين', 'النيتروجين', 'الهيدروجين'], ans: 1, diff: 'سهل' },
        { q: 'كم عدد أسنان الإنسان البالغ؟', opts: ['28', '30', '32', '34'], ans: 2, diff: 'متوسط' },
        { q: 'ما هو العضو المسؤول عن إفراز الأنسولين؟', opts: ['الكبد', 'الكلى', 'البنكرياس', 'الطحال'], ans: 2, diff: 'صعب' },
        { q: 'ما هي عملية البناء الضوئي؟', opts: ['تحويل الضوء لطاقة', 'تحويل الماء لأكسجين', 'تحويل CO2 لجلوكوز', 'جميع ما سبق'], ans: 3, diff: 'صعب' },
        { q: 'كم عدد فصائل الدم الرئيسية؟', opts: ['2', '4', '6', '8'], ans: 1, diff: 'متوسط' },
        { q: 'ما هو أطول عظم في جسم الإنسان؟', opts: ['عظم الفخذ', 'عظم الساق', 'عظم العضد', 'العمود الفقري'], ans: 0, diff: 'متوسط' },
        { q: 'ما هي وظيفة خلايا الدم البيضاء؟', opts: ['نقل الأكسجين', 'مقاومة الأمراض', 'تخثر الدم', 'نقل الغذاء'], ans: 1, diff: 'سهل' },
        { q: 'كم عدد أزواج الأضلاع في جسم الإنسان؟', opts: ['10', '12', '14', '16'], ans: 1, diff: 'صعب' }
    ],
    'الحاسب الآلي': [
        { q: 'ما هي وحدة قياس سعة التخزين؟', opts: ['بايت', 'هيرتز', 'واط', 'أوم'], ans: 0, diff: 'سهل' },
        { q: 'ما هو اختصار CPU؟', opts: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Unit', 'Computer Processing Unit'], ans: 0, diff: 'متوسط' },
        { q: 'كم بايت في الكيلوبايت؟', opts: ['100', '1000', '1024', '1048'], ans: 2, diff: 'صعب' },
        { q: 'ما هي لغة البرمجة الأكثر استخداماً للويب؟', opts: ['Python', 'JavaScript', 'C++', 'Java'], ans: 1, diff: 'متوسط' },
        { q: 'ما هو نظام التشغيل مفتوح المصدر؟', opts: ['Windows', 'macOS', 'Linux', 'iOS'], ans: 2, diff: 'متوسط' },
        { q: 'ما هو اختصار RAM؟', opts: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Memory', 'Real Access Memory'], ans: 0, diff: 'متوسط' },
        { q: 'ما هي وحدة الإدخال؟', opts: ['الشاشة', 'الطابعة', 'لوحة المفاتيح', 'السماعات'], ans: 2, diff: 'سهل' },
        { q: 'ما هو اختصار HTML؟', opts: ['HyperText Markup Language', 'HighText Machine Language', 'HyperText Machine Language', 'HighText Markup Language'], ans: 0, diff: 'متوسط' },
        { q: 'كم بت في البايت؟', opts: ['4', '8', '16', '32'], ans: 1, diff: 'سهل' },
        { q: 'ما هي وحدة الإخراج؟', opts: ['الماوس', 'الماسح الضوئي', 'الشاشة', 'الميكروفون'], ans: 2, diff: 'سهل' },
        { q: 'ما هو اختصار URL؟', opts: ['Uniform Resource Locator', 'Universal Resource Locator', 'Uniform Reference Link', 'Universal Reference Link'], ans: 0, diff: 'صعب' },
        { q: 'ما هو اختصار WWW؟', opts: ['World Wide Web', 'World Web Wide', 'Wide World Web', 'Web World Wide'], ans: 0, diff: 'سهل' },
        { q: 'كم ميجابايت في الجيجابايت؟', opts: ['100', '1000', '1024', '1048'], ans: 2, diff: 'صعب' },
        { q: 'ما هو اختصار USB؟', opts: ['Universal Serial Bus', 'Uniform Serial Bus', 'Universal System Bus', 'Uniform System Bus'], ans: 0, diff: 'متوسط' },
        { q: 'ما هي وظيفة نظام التشغيل؟', opts: ['تشغيل البرامج فقط', 'إدارة موارد الحاسوب', 'الاتصال بالإنترنت', 'حماية الفيروسات'], ans: 1, diff: 'صعب' }
    ],
    'التربية الإسلامية': [
        { q: 'كم عدد أركان الإسلام؟', opts: ['4', '5', '6', '7'], ans: 1, diff: 'سهل' },
        { q: 'ما هو أول ركن من أركان الإسلام؟', opts: ['الصلاة', 'الشهادتان', 'الزكاة', 'الصوم'], ans: 1, diff: 'سهل' },
        { q: 'كم عدد الصلوات المفروضة في اليوم؟', opts: ['3', '4', '5', '6'], ans: 2, diff: 'سهل' },
        { q: 'في أي شهر فرض الصيام؟', opts: ['شعبان', 'رمضان', 'شوال', 'ذو القعدة'], ans: 1, diff: 'سهل' },
        { q: 'كم عدد أركان الإيمان؟', opts: ['4', '5', '6', '7'], ans: 2, diff: 'متوسط' },
        { q: 'ما هي أول سورة في القرآن؟', opts: ['البقرة', 'الفاتحة', 'الناس', 'الإخلاص'], ans: 1, diff: 'سهل' },
        { q: 'كم عدد سور القرآن الكريم؟', opts: ['110', '112', '114', '116'], ans: 2, diff: 'متوسط' },
        { q: 'في أي عام هجري كانت الهجرة النبوية؟', opts: ['1 هـ', '2 هـ', '3 هـ', '4 هـ'], ans: 0, diff: 'سهل' },
        { q: 'ما هو اسم الملك الموكل بالوحي؟', opts: ['ميكائيل', 'جبريل', 'إسرافيل', 'عزرائيل'], ans: 1, diff: 'سهل' },
        { q: 'كم عدد ركعات صلاة الظهر؟', opts: ['2', '3', '4', '5'], ans: 2, diff: 'سهل' },
        { q: 'ما هي أطول سورة في القرآن؟', opts: ['البقرة', 'آل عمران', 'النساء', 'المائدة'], ans: 0, diff: 'متوسط' },
        { q: 'كم عدد أجزاء القرآن الكريم؟', opts: ['20', '25', '30', '35'], ans: 2, diff: 'متوسط' },
        { q: 'ما هي أقصر سورة في القرآن؟', opts: ['الإخلاص', 'الكوثر', 'النصر', 'الفلق'], ans: 1, diff: 'صعب' },
        { q: 'كم عدد ركعات صلاة التراويح؟', opts: ['8', '11', '20', 'غير محدد'], ans: 3, diff: 'صعب' },
        { q: 'ما هي الليلة التي نزل فيها القرآن؟', opts: ['ليلة القدر', 'ليلة الإسراء', 'ليلة النصف من شعبان', 'ليلة عرفة'], ans: 0, diff: 'متوسط' }
    ],
    'الفنون': [
        { q: 'ما هي الألوان الأساسية؟', opts: ['أحمر، أصفر، أزرق', 'أحمر، أخضر، أزرق', 'أصفر، أخضر، برتقالي', 'أحمر، بنفسجي، أخضر'], ans: 0, diff: 'سهل' },
        { q: 'من رسم لوحة الموناليزا؟', opts: ['بيكاسو', 'ليوناردو دافنشي', 'فان جوخ', 'مايكل أنجلو'], ans: 1, diff: 'متوسط' },
        { q: 'ما هو الخط العربي الأكثر استخداماً؟', opts: ['الكوفي', 'النسخ', 'الثلث', 'الديواني'], ans: 1, diff: 'متوسط' },
        { q: 'كم عدد النوتات الموسيقية الأساسية؟', opts: ['5', '6', '7', '8'], ans: 2, diff: 'سهل' },
        { q: 'ما هو اللون الناتج من خلط الأحمر والأصفر؟', opts: ['برتقالي', 'بنفسجي', 'أخضر', 'بني'], ans: 0, diff: 'سهل' },
        { q: 'ما هي أداة النفخ الموسيقية؟', opts: ['الجيتار', 'الطبل', 'الناي', 'البيانو'], ans: 2, diff: 'سهل' },
        { q: 'من هو رسام لوحة "الصرخة"؟', opts: ['مونيه', 'إدفارد مونك', 'رينوار', 'سيزان'], ans: 1, diff: 'صعب' },
        { q: 'ما هو اللون الناتج من خلط الأزرق والأصفر؟', opts: ['برتقالي', 'بنفسجي', 'أخضر', 'بني'], ans: 2, diff: 'سهل' },
        { q: 'كم عدد أوتار الجيتار الكلاسيكي؟', opts: ['4', '5', '6', '7'], ans: 2, diff: 'متوسط' },
        { q: 'ما هي أداة الإيقاع؟', opts: ['الكمان', 'الطبل', 'الناي', 'البيانو'], ans: 1, diff: 'سهل' },
        { q: 'من رسم لوحة "ليلة النجوم"؟', opts: ['بيكاسو', 'فان جوخ', 'مونيه', 'رينوار'], ans: 1, diff: 'متوسط' },
        { q: 'ما هو اللون الناتج من خلط الأحمر والأزرق؟', opts: ['برتقالي', 'بنفسجي', 'أخضر', 'بني'], ans: 1, diff: 'سهل' },
        { q: 'كم عدد مفاتيح البيانو؟', opts: ['76', '88', '96', '104'], ans: 1, diff: 'صعب' },
        { q: 'ما هي أنواع الخطوط العربية الرئيسية؟', opts: ['4', '5', '6', '7'], ans: 2, diff: 'صعب' },
        { q: 'من هو مؤلف السيمفونية التاسعة؟', opts: ['موتسارت', 'بيتهوفن', 'باخ', 'شوبان'], ans: 1, diff: 'صعب' }
    ]
};

// دالة لاختيار أسئلة فريدة بنفس مستوى صعوبة الاختبار (بدون تكرار)
const selectQuestions = (count, categoryName, quizDifficulty = 'متوسط') => {
    const bank = questionBank[categoryName];
    if (!bank || bank.length === 0) {
        // أسئلة افتراضية إذا لم تكن الفئة موجودة
        const questions = [];
        for (let i = 0; i < count; i++) {
            questions.push({
                question: `سؤال ${i + 1} عن ${categoryName}`,
                options: ['خيار 1', 'خيار 2', 'خيار 3', 'خيار 4'],
                correctAnswer: i % 4,
                difficulty: quizDifficulty
            });
        }
        return questions;
    }

    // اختيار الأسئلة التي تطابق مستوى صعوبة الاختبار
    const matchingQuestions = bank.filter(q => q.diff === quizDifficulty);

    // إذا لم يكن هناك أسئلة كافية بنفس الصعوبة، نستخدم جميع الأسئلة
    const questionsToUse = matchingQuestions.length >= count ? matchingQuestions : bank;

    // استخدام Set للتأكد من عدم تكرار الأسئلة
    const selected = shuffleAndTakeUnique(questionsToUse, count);

    // تحويل للصيغة المطلوبة مع تعيين صعوبة الاختبار لجميع الأسئلة
    return selected.map(q => ({
        question: q.q,
        options: q.opts,
        correctAnswer: q.ans,
        difficulty: quizDifficulty // جميع الأسئلة بنفس صعوبة الاختبار
    }));
};

// دالة لخلط المصفوفة واختيار عدد معين بدون تكرار
const shuffleAndTakeUnique = (arr, count) => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    const unique = [];
    const usedQuestions = new Set();

    for (const item of shuffled) {
        if (unique.length >= count) break;
        // التأكد من عدم تكرار السؤال
        if (!usedQuestions.has(item.q)) {
            unique.push(item);
            usedQuestions.add(item.q);
        }
    }

    return unique;
};

// Initialize default data if not exists
const initializeData = () => {
    if (!localStorage.getItem(CATEGORIES_KEY)) {
        const defaultCategories = [
            { id: 1, name: 'العلوم', description: 'اختبارات في مجال العلوم الطبيعية' },
            { id: 2, name: 'الرياضيات', description: 'اختبارات في مجال الرياضيات' },
            { id: 3, name: 'التاريخ', description: 'اختبارات في مجال التاريخ' },
            { id: 4, name: 'الجغرافيا', description: 'اختبارات في مجال الجغرافيا' },
            { id: 5, name: 'اللغة العربية', description: 'اختبارات في مجال اللغة العربية' },
            { id: 6, name: 'اللغة الإنجليزية', description: 'اختبارات في مجال اللغة الإنجليزية' },
            { id: 7, name: 'الفيزياء', description: 'اختبارات في مجال الفيزياء' },
            { id: 8, name: 'الكيمياء', description: 'اختبارات في مجال الكيمياء' },
            { id: 9, name: 'الأحياء', description: 'اختبارات في مجال الأحياء' },
            { id: 10, name: 'الحاسب الآلي', description: 'اختبارات في مجال الحاسب الآلي' },
            { id: 11, name: 'التربية الإسلامية', description: 'اختبارات في مجال التربية الإسلامية' },
            { id: 12, name: 'الفنون', description: 'اختبارات في مجال الفنون' }
        ];
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem(QUIZZES_KEY)) {
        const defaultQuizzes = [];
        let quizId = 1;

        // Define quiz counts for each category
        const quizCounts = [0, 5, 10, 15, 20, 0, 5, 10, 15, 20, 5, 10];
        // Define question counts pattern
        const questionCounts = [5, 10, 15, 20, 5];

        const categories = [
            'العلوم', 'الرياضيات', 'التاريخ', 'الجغرافيا',
            'اللغة العربية', 'اللغة الإنجليزية', 'الفيزياء', 'الكيمياء',
            'الأحياء', 'الحاسب الآلي', 'التربية الإسلامية', 'الفنون'
        ];

        const difficulties = ['سهل', 'متوسط', 'صعب'];

        categories.forEach((category, catIndex) => {
            const numQuizzes = quizCounts[catIndex];

            for (let i = 0; i < numQuizzes; i++) {
                const numQuestions = questionCounts[i % questionCounts.length];
                const difficulty = difficulties[i % difficulties.length];

                defaultQuizzes.push({
                    id: quizId++,
                    title: `اختبار ${category} ${i + 1}`,
                    category: category,
                    difficulty: difficulty,
                    questions: selectQuestions(numQuestions, category, difficulty)
                });
            }
        });

        localStorage.setItem(QUIZZES_KEY, JSON.stringify(defaultQuizzes));
    }
};

// Helper function to get next ID (auto-increment)
const getNextId = (items) => {
    if (!items || items.length === 0) return 1;
    const maxId = Math.max(...items.map(item => item.id || 0));
    return maxId + 1;
};

// Categories CRUD operations
export const localStorageService = {
    // Initialize data on first use
    init: () => {
        initializeData();
    },

    // Categories
    getCategories: () => {
        initializeData();
        const data = localStorage.getItem(CATEGORIES_KEY);
        return data ? JSON.parse(data) : [];
    },

    createCategory: (categoryData) => {
        const categories = localStorageService.getCategories();
        const newCategory = {
            ...categoryData,
            id: getNextId(categories)
        };
        categories.push(newCategory);
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
        return newCategory;
    },

    updateCategory: (id, categoryData) => {
        const categories = localStorageService.getCategories();
        const index = categories.findIndex(cat => cat.id === parseInt(id));
        if (index === -1) throw new Error('Category not found');

        categories[index] = {
            ...categories[index],
            ...categoryData,
            id: categories[index].id
        };
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
        return categories[index];
    },

    deleteCategory: (id) => {
        const categories = localStorageService.getCategories();
        const filteredCategories = categories.filter(cat => cat.id !== parseInt(id));

        if (filteredCategories.length === categories.length) {
            throw new Error('Category not found');
        }

        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filteredCategories));

        // Also delete all quizzes in this category
        const quizzes = localStorageService.getQuizzes();
        const categoryName = categories.find(cat => cat.id === parseInt(id))?.name;
        if (categoryName) {
            const filteredQuizzes = quizzes.filter(quiz => quiz.category !== categoryName);
            localStorage.setItem(QUIZZES_KEY, JSON.stringify(filteredQuizzes));
        }

        return true;
    },

    // Quizzes
    getQuizzes: (category = null) => {
        initializeData();
        const data = localStorage.getItem(QUIZZES_KEY);
        const quizzes = data ? JSON.parse(data) : [];

        if (category && category !== 'all') {
            return quizzes.filter(quiz => quiz.category === category);
        }

        return quizzes;
    },

    getQuiz: (id) => {
        const quizzes = localStorageService.getQuizzes();
        const quiz = quizzes.find(q => q.id === parseInt(id));
        if (!quiz) throw new Error('Quiz not found');
        return quiz;
    },

    createQuiz: (quizData) => {
        const quizzes = localStorageService.getQuizzes();
        const newQuiz = {
            ...quizData,
            id: getNextId(quizzes)
        };
        quizzes.push(newQuiz);
        localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
        return newQuiz;
    },

    updateQuiz: (id, quizData) => {
        const quizzes = localStorageService.getQuizzes();
        const index = quizzes.findIndex(q => q.id === parseInt(id));
        if (index === -1) throw new Error('Quiz not found');

        quizzes[index] = {
            ...quizzes[index],
            ...quizData,
            id: quizzes[index].id
        };
        localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
        return quizzes[index];
    },

    deleteQuiz: (id) => {
        const quizzes = localStorageService.getQuizzes();
        const filteredQuizzes = quizzes.filter(q => q.id !== parseInt(id));

        if (filteredQuizzes.length === quizzes.length) {
            throw new Error('Quiz not found');
        }

        localStorage.setItem(QUIZZES_KEY, JSON.stringify(filteredQuizzes));
        return true;
    },

    // Utility function to clear all data (for testing)
    clearAll: () => {
        localStorage.removeItem(CATEGORIES_KEY);
        localStorage.removeItem(QUIZZES_KEY);
        initializeData();
    }
};

// Initialize on module load
localStorageService.init();
