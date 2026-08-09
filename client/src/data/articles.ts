export interface Article {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  category: string;
  categoryEn: string;
  categoryColor: string;
  author: string;
  authorRank: string;
  authorRankEn: string;
  date: string;
  readTime: string;
  readTimeEn: string;
  coverIcon: 'Shield' | 'Award' | 'TrendingUp' | 'BookOpen';
  coverImage?: string;
  coverPosition?: string;
  coverHeight?: number;
  coverZoom?: number;
  coverFit?: 'cover' | 'contain' | 'auto';
  content: ArticleSection[];
  contentEn: ArticleSection[];
  isCustom?: boolean;
}

export interface ArticleSection {
  type: 'paragraph' | 'heading' | 'tip-card' | 'player-card' | 'warning' | 'divider';
  text?: string;
  icon?: string;
  playerName?: string;
  playerPrice?: string;
  playerTeam?: string;
  playerImage?: string;
  tier?: string;
  highlight?: boolean;
  items?: string[];
}

export const defaultArticles: Article[] = [
  {
    id: 'gk-tips-25-26',
    slug: 'goalkeeper-tips-25-26',
    title: 'نصائح حراسة المرمى - كيف تختار حارسك صح في FPL 25/26؟',
    titleEn: 'Goalkeeper Tips - How to Pick the Right GK in FPL 25/26',
    excerpt: 'دليل تفصيلي شامل لاختيار حارس المرمى الأمثل لفريقك في موسم 25/26. كيفية استغلال نقاط التصديات وتوزيع الميزانية التنافسية.',
    excerptEn: 'An exhaustive in-depth guide to picking the best goalkeeper for your FPL 25/26 team with save point algorithms and budget allocations.',
    category: 'بناء التشكيلة',
    categoryEn: 'Squad Building',
    categoryColor: '#10b981',
    author: 'MINI FPL Editorial',
    authorRank: 'المركز ~9,000 عالمياً',
    authorRankEn: 'Top ~9,000 globally',
    date: '2026-08-03',
    readTime: '7 دقائق قراءة',
    readTimeEn: '7 min read',
    coverIcon: 'Shield',
    content: [
      { type: 'heading', text: 'القاعدة الذهبية: تجنب الإسراف المالي في مركز حراسة المرمى' },
      { type: 'paragraph', text: 'أول وأهم خطوة في بناء تشكيلة منافسة في فانتازي الدوري الإنجليزي الممتاز هي حوكمة الميزانية. الكثير من المدربين الجدد يرتكبون خطأً فادحاً بصرف 10.5M أو 11M على حارسي مرمى من أندية القمة. هذا الإنفاق يخصم ميزانية ضخمة محتاجة بشدة في خط الوسط والهجوم، حيث يصنع الفارق الحقيقي في النقاط والمقاعد الأساسية.' },
      { type: 'paragraph', text: 'الميزانية المثالية لمركز الحراسة ككل يجب ألا تتجاوز 8.5M إلى 9.0M كحد أقصى (مثلاً: حارس أساسي بـ 4.5M وحارس بديل بـ 4.0M، أو حارس ممتاز بـ 5.0M وحارس بديل بـ 4.0M).' },
      { type: 'warning', text: 'تنبيه استراتيجي: لا تخصص أكثر من 9.0M لحراسة المرمى مجتمعين. وفر الملايين الإضافية لنجوم الوسط والهجوم!' },
      { type: 'divider' },
      { type: 'heading', text: 'فهم خوارزمية نقاط التصديات (Save Points System)' },
      { type: 'paragraph', text: 'في نظام FPL الرسمي، يحصل حارس المرمى على 4 نقاط للشباك النظيفة (Clean Sheet)، بالإضافة إلى نقطة إضافية لكل 3 تصديات حاسمة (Saves). هذا يعني أن حارس المرمى في أندية منتصف الجدول التي تستقبل تصديدات متعددة (مثل إيفرتون أو برينتفورد) قد يجمع نقاطاً أعلى من حارس الفرق الكبرى بفضل نقاط التصديات والبونص (BPS).' },
      { type: 'player-card', playerName: 'دافيد رايا', playerTeam: 'أرسنال', playerPrice: '6.0M', playerImage: '/players/Arsenal/b22b5eee4eb2-1-david-raya.png', tier: 'فئة الـ 6.0M (خيارات القمة)', highlight: true, items: ['أقوى خط دفاع في الدوري الإنجليزي', 'نسبة شباك نظيفة مرتفعة طوال الموسم', 'مناسب لمن يفضل استراتيجية حارس ثنائي دائم (Set & Forget)'] },
      { type: 'player-card', playerName: 'جوردان بيكفورد', playerTeam: 'إيفرتون', playerPrice: '5.5M', playerImage: '/players/Everton/49593e00-79cc-11f0-91cc-258e0b00204a.webp', tier: 'فئة الـ 5.5M (ملك التصديات)', highlight: false, items: ['معدل تصديات عالي جداً في كل مباراة', 'تحقيق نقاط بونص متكررة في مباريات الـ 0-0 والـ 1-0', 'ثبات مشاركة 90 دقيقة دون مخاطرة المداورة'] },
      { type: 'player-card', playerName: 'أنتونين كينسكي', playerTeam: 'توتنهام', playerPrice: '4.5M', playerImage: '/players/TOT/firstteam_profiles_202526_antoninkinsky.webp', tier: 'فئة الـ 4.5M (الخيار الاقتصادي الموصى به)', highlight: true, items: ['سعر منخفض يحرر الميزانية للهجوم', 'جدول مباريات افتتاحية سهل', 'الخيار الأفضل للبدء بـ 8.5M إجمالي'] },
      { type: 'divider' },
      { type: 'tip-card', text: 'خلاصة التوصية: ابدأ الموسم بحارس بـ 4.5M مع حارس دكة بـ 4.0M. هذا يمنحك 1.5M زيادة لتطوير خط وسطك وصناعة الفارق في دوريات الأصدقاء.' },
    ],
    contentEn: [
      { type: 'heading', text: 'The Golden Rule: Do Not Overspend on Goalkeepers' },
      { type: 'paragraph', text: 'Never allocate more than 9.0M combined on goalkeepers. The ideal setup is a 4.5M starter with a 4.0M bench keeper.' },
      { type: 'paragraph', text: 'Every 3 saves awards 1 extra point. Keepers from mid-table clubs facing volume shots often outscore premium keepers through save points and BPS bonuses.' },
      { type: 'tip-card', text: 'Recommended Setup: 4.5M starter + 4.0M bench = 8.5M total budget investment.' },
    ],
  },

  {
    id: 'defenders-strategy-25-26',
    slug: 'defenders-guide-25-26',
    title: 'استراتيجية المدافعين - كيف تختار الأظهيرة الهجومية وتحقق أعلى شباك نظيفة؟',
    titleEn: 'Defenders Strategy - Picking Attacking Fullbacks & Clean Sheets',
    excerpt: 'دليل تحليلي شامل لبناء خط الدفاع المثالي في FPL. التوازن بين الأظهيرة التي تصنع الأهداف والمدافعين أصحاب الرأسيات والشباك النظيفة.',
    excerptEn: 'Mastering the defense setup in FPL with structural balance between goal-scoring fullbacks and set-piece aerial threats.',
    category: 'التكتيك والتخطيط',
    categoryEn: 'Tactics & Planning',
    categoryColor: '#3b82f6',
    author: 'MINI FPL Editorial',
    authorRank: 'تحليلات موسم 25/26',
    authorRankEn: 'FPL Analytics 25/26',
    date: '2026-08-05',
    readTime: '8 دقائق قراءة',
    readTimeEn: '8 min read',
    coverIcon: 'Award',
    content: [
      { type: 'heading', text: 'تطور دور الأظهيرة الهجومية (Attacking Wing-Backs) في الفانتازي' },
      { type: 'paragraph', text: 'في نظام حساب النقاط، يمثل خط الدفاع مصدراً كبيراً للنقاط إذا تم اختياره بعناية. المدافع يحصل على 4 نقاط للشباك النظيفة، و6 نقاط لكل هدف، و3 نقاط للتمريرة الحاسمة. الأظهيرة الهجومية التي تتقدم لمنطقة جزاء الخصم تمنحك فرصة مزدوجة لجمع نقاط الشباك النظيفة وصناعة الأهداف والبونص.' },
      { type: 'paragraph', text: 'تجنب الاعتماد الكلي على قلب الدفاع الثابت (Center-Back) إلا إذا كان متميزاً في الكرات الرأسية الثابتة من الضربات الركنية (مثل مدافعي أرسنال ليفربول)، حيث إن الأظهيرة تتفوق دائماً في معدل العرضيات وصناعة الفرص المحققة (xA).' },
      { type: 'heading', text: 'هيكلة الميزانية الدفاعية المثالية (5 Defenders Structure)' },
      { type: 'paragraph', text: 'توزيع الميزانية في خط دفاعك يجب أن يتبع خطة تضمن المداورة والسعر المناسب:' },
      { type: 'paragraph', text: '1. مدافع سوبر بـ 6.0M من فريق قمة دفاعي (أرسنال أو مانشستر سيتي).\n2. مدافع ظهير هجومي بـ 5.0M - 5.5M يشارك بكثافة هجومية.\n3. مدافع أساسي بـ 4.5M من فريق صاحب جدول مباريات سهل.\n4. اثنان من المدافعين الاقتصاديين بـ 4.0M لدعم دكة البدلاء.' },
      { type: 'warning', text: 'تحذير تكتيكي: احرص أن يكون المدافع الاقتصادي بـ 4.0M يشارك بانتظام في فريقه وتأكد من عدم وجوده على دكة الاحتياط الدائمة.' },
      { type: 'tip-card', text: 'نصيحة المدير: تحقق دائماً من إحصائية التمريرات العرضية والتمريرات الحاسمة المتوقعة (xA) للمدافعين قبل الشراء.' },
    ],
    contentEn: [
      { type: 'heading', text: 'The Role of Modern Attacking Fullbacks' },
      { type: 'paragraph', text: 'Fullbacks offer multiple avenues of points: clean sheets (4 pts), goals (6 pts), assists (3 pts), and BPS awards.' },
      { type: 'paragraph', text: 'Optimal Defense Budgeting: 1 Premium (6.0M), 1 Mid-range (5.0M-5.5M), 1 Rotational (4.5M), and 2 Budget (4.0M).' },
    ],
  },

  {
    id: 'midfielders-captain-guide-25-26',
    slug: 'midfielders-captain-guide-25-26',
    title: 'استراتيجية خط الوسط واختيار الكابتن - أسرار مضاعفة النقاط الجولة تلو الجولة',
    titleEn: 'Midfielders & Captaincy Masterclass - Maximizing Returns Every GW',
    excerpt: 'خط الوسط هو قلب تشكيلتك النابض والمحرك الرئيسي للنقاط. كيف تختار شارة الكابتن وتفاضل بين النجوم أصحاب العائد المرتفع.',
    excerptEn: 'Midfielders are the core engine of any top FPL squad. Learn how to pick your captain wisely every single week.',
    category: 'اختيارات الكابتن',
    categoryEn: 'Captaincy Picks',
    categoryColor: '#8b5cf6',
    author: 'MINI FPL Editorial',
    authorRank: 'تحليلات موسم 25/26',
    authorRankEn: 'FPL Analytics 25/26',
    date: '2026-08-07',
    readTime: '9 دقائق قراءة',
    readTimeEn: '9 min read',
    coverIcon: 'TrendingUp',
    content: [
      { type: 'heading', text: 'لماذا يُعتبر خط الوسط أهم مركز في لعبة FPL؟' },
      { type: 'paragraph', text: 'لاعبو خط الوسط يحصلون على 5 نقاط عن كل هدف يسجلونه (مقارنة بـ 4 نقاط للمهاجم)، بالإضافة إلى نقطة واحدة للشباك النظيفة عند المشاركة 60 دقيقة. علاوة على ذلك، فإن معظم لاعبي الوسط الهجوميين والأطراف (Wingers) ينفذون ركلات الجزاء والضربات الثابتة، مما يجعلهم أعلى لاعبي اللعبة حصداً للنقاط طوال الموسم.' },
      { type: 'heading', text: 'معادلة اختيار الكابتن الأسبوعي (Captaincy Selection Strategy)' },
      { type: 'paragraph', text: 'شارة الكابتن تضاعف نقاط لاعبك مرتين (x2). اتخاذ القرار الصحيح أسبوعياً يمثل الفرق بين التأخر في دوريات الأصدقاء والوصول للقمة. إليك المعايير الأربعة الأساسية لتقييم كابتن الجولة:' },
      { type: 'paragraph', text: '1. **المكان وحالة الفريق:** هل المباراة على ملعب فريقك (Home)؟ الأرقام تؤكد أن الكابتن على ملعبه يحقق عائداً أعلى بنسبة 35%.\n2. **معدل الأهداف المتوقعة (xG + xA):** متوسط الفرص المحققة للاعب في آخر 4 جولات.\n3. **ضعف المنافس الدفاعي:** عدد الأهداف والفرص التي استقبلها الفريق الخصم في مبارياته الأخيرة خارج ملعبه.\n4. **نسبة الملكية المؤثرة (Effective Ownership - EO):** إذا كانت ملكية نجم مثل صلاح أو هالاند تجاوزت 150%، فإن عدم تكبيتنه يمثل مخاطرة كبيرة على ترتيبك الكلي.' },
      { type: 'warning', text: 'تنبيه هائم: لا تغامر بكابتن ديفرنشال (نسبة ملكيته أقل من 5%) إلا إذا كنت متأخراً بفارق كبير في الترتيب وتحتاج للتعويض.' },
      { type: 'tip-card', text: 'قاعدة الكابتن الثابتة: اختر دائماً اللاعب الأجهز صاحب ركلات الجزاء والذي يلعب على ملعبه ضد دفاع يعاني من استقبال العرضيات.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Why Midfielders Dominate FPL Scores' },
      { type: 'paragraph', text: 'Midfielders earn 5 pts for goals, 1 pt for clean sheets, and 3 pts for assists while benefiting from penalty duties.' },
      { type: 'paragraph', text: 'Captaincy evaluation factors: Home vs Away form, xG+xA stats, opponent xGA, and Effective Ownership (EO).' },
    ],
  },

  {
    id: 'wildcard-master-strategy',
    slug: 'wildcard-master-strategy',
    title: 'دليل تفعيل كرت الوايلد كارد (Wildcard) - التوقيت والتنفيذ بدون أخطاء',
    titleEn: 'Wildcard Masterclass - Timing, Execution & Squad Restructuring',
    excerpt: 'استراتيجية شاملة لتفعيل كرت الوايلد كارد لتعديل الفريق بالكامل. المتى وكيف تستغل تغير الأسعار لبناء تشكيلة فائقة القوة.',
    excerptEn: 'When and how to deploy your Wildcard chip for maximum team value and fixture swing optimization.',
    category: 'إدارة الخواص',
    categoryEn: 'Chips Strategy',
    categoryColor: '#ec4899',
    author: 'MINI FPL Editorial',
    authorRank: 'تحليلات تكتيكية',
    authorRankEn: 'Tactical Analysis',
    date: '2026-08-08',
    readTime: '8 دقائق قراءة',
    readTimeEn: '8 min read',
    coverIcon: 'BookOpen',
    content: [
      { type: 'heading', text: 'ما هو كرت الوايلد كارد وكيف يعمل؟' },
      { type: 'paragraph', text: 'يمنحك كرت الوايلد كارد (Wildcard) القدرة على إجراء انتقالات مجانية غير محدودة وتغيير جميع لاعبي تشكيلتك الـ 15 دون أي خصم نقاط (-4). يتوفر لك كرت في النصف الأول من الموسم (قبل الجولة 19) وكرت آخر في النصف الثاني.' },
      { type: 'heading', text: 'متى يجب تفعيل الوايلد كارد؟' },
      { type: 'paragraph', text: 'أهم التوقيتات الاستراتيجية لتفعيل الوايلد كارد تشمل:' },
      { type: 'paragraph', text: '1. **فترة التوقف الدولي (International Break):** يمنحك التفعيل المبكر أسبوعين كاملين للاستفادة من ارتفاع أسعار اللاعبين المتألقين وتجنب هبوط أسعار المصابين.\n2. **تغير جدول المباريات (Fixture Swings):** عندما تتغير مواجهات الفرق الكبرى من مواجهات صعبة إلى سلسلة مباريات سهلة متتالية.\n3. **علاج الإصابات الهيكلية:** عند تعرض 3 إلى 4 لاعبين أساسيين للإصابة أو الإيقاف في نفس الوقت.' },
      { type: 'warning', text: 'تنبيه: لا تفعل الوايلد كارد بسبب جولة واحدة سيئة! استعمله فقط عندما يحتاج فريقك لتغيير جذري يشمل 5 لاعبين على الأقل.' },
      { type: 'tip-card', text: 'نصيحة القيمة: قُم بطلب اللاعبين الذين يرتفع سعرهم يومياً خلال أسبوع الوايلد كارد لبناء ميزانية ضخمة لتشكيلتك.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Wildcard Execution Strategy' },
      { type: 'paragraph', text: 'Wildcards reset your 15-man squad without points deduction. Target International Breaks or major Fixture Swings.' },
    ],
  },

  {
    id: 'budget-gems-differentials',
    slug: 'budget-gems-differentials',
    title: 'الأسماء الاقتصادية واللاعبين الديفرنشال (Differentials) لموسم 25/26',
    titleEn: 'Budget Gems & Differential Picks for FPL 25/26',
    excerpt: 'دليل استكشاف النجوم أصحاب الأسعار المنخفضة ونسبة الامتلاك الضئيلة (<10%) لصنع الفارق وصدارة الدوريات الخاصة.',
    excerptEn: 'Discover low-ownership differential gems and high-value budget enablers to climb overall rankings.',
    category: 'اكتشاف المواهب',
    categoryEn: 'Budget & Differentials',
    categoryColor: '#f59e0b',
    author: 'MINI FPL Editorial',
    authorRank: 'تحليلات إحصائية',
    authorRankEn: 'Statistical Analysis',
    date: '2026-08-09',
    readTime: '7 دقائق قراءة',
    readTimeEn: '7 min read',
    coverIcon: 'Award',
    content: [
      { type: 'heading', text: 'تعريف اللاعب الديفرنشال وأهميته التنافسية' },
      { type: 'paragraph', text: 'اللاعب الديفرنشال (Differential) هو كل لاعب تقل نسبة ملكيته الإجمالية بين مدربي الفانتازي عن 10%. عندما يتألق هذا اللاعب ويسجل أهدافاً، فإن نقاطه تعود بالنفع المباشر عليك وحدك دون بقية المنافسين، مما يمنحك قفزة هائلة في ترتيبك العالمي وفي جدول دوري أصدقائك.' },
      { type: 'heading', text: 'كيف تختار ديفرنشال ناجح بدلاً من المخاطرة الضارة؟' },
      { type: 'paragraph', text: 'ليس كل لاعب منخفض الملكية يعتبر ديفرنشال جيد. اختر اللاعب الذي ينطبق عليه المعايير التالية:' },
      { type: 'paragraph', text: '1. مشارك أساسي بضمان 80+ دقيقة في المباراة.\n2. ينفذ جزءاً من الكرات الثابتة أو الركنيات.\n3. يلعب في مركز هجومي أعلى من مركزه المسجل في اللعبة (Out of Position).' },
      { type: 'tip-card', text: 'التوازن الذهبي: لا تضع أكثر من 2 إلى 3 ديفرنشالات في تشكيلتك، وحافظ على النواة الأساسية من نجوم اللعبة الـ Template.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Selecting Effective Differentials' },
      { type: 'paragraph', text: 'Target low-ownership assets (<10% owned) who play 80+ guaranteed minutes and take set-pieces.' },
    ],
  },

  {
    id: 'strikers-guide-25-26',
    slug: 'strikers-guide-25-26',
    title: 'دليل خط الهجوم - المهاجم الصريح أم المهاجم الوهمي في الفانتازي؟',
    titleEn: 'Strikers & Forwards Guide - Pure No. 9s vs False 9s in FPL',
    excerpt: 'تحليل تكتيكي تفصيلي لاختيار رأس الحربة الأمثل. تقييم معدل التسديدات من داخل منطقة الجزاء وركلات الجزاء.',
    excerptEn: 'In-depth tactical evaluation of picking strikers in FPL: analyzing penalty duties and inside-the-box shot volume.',
    category: 'بناء التشكيلة',
    categoryEn: 'Squad Building',
    categoryColor: '#ef4444',
    author: 'MINI FPL Editorial',
    authorRank: 'تحليل الهجوم',
    authorRankEn: 'Attacking Analysis',
    date: '2026-08-09',
    readTime: '8 دقائق قراءة',
    readTimeEn: '8 min read',
    coverIcon: 'TrendingUp',
    content: [
      { type: 'heading', text: 'تقييم خط الهجوم في FPL' },
      { type: 'paragraph', text: 'المهاجم في اللعبة يحصل على 4 نقاط عن كل هدف يسجله، ولا يحصل على نقاط للشباك النظيفة. ورغم أن نقاط هدفه أقل من المدافع والوسط، إلا أن المهاجم الصريح هو المستهدف الأول للكرات العرضية، الركلات الركنية، وركلات الجزاء.' },
      { type: 'heading', text: 'معايير اختيار رأس الحربة الثابت:' },
      { type: 'paragraph', text: '1. **منفذ ركلات الجزاء (Penalty Duty):** تضمن للمهاجم من 5 إلى 8 أهداف إضافية طوال الموسم.\n2. **معدل لمس الكرة داخل الصندوق (Touches in Box):** كلما زاد تواجد المهاجم في منطقة الجزاء، زادت فرص التسجيل المتوقعة (xG).\n3. **الاستبدال المبكر:** تجنب المهاجمين الذين يتم استبدالهم في الدقيقة 60 بانتظام لصالح بدلاء تكتيكيين.' },
      { type: 'tip-card', text: 'استراتيجية الهجوم: اختر مهاجماً سوبر رئيسياً يكون خيار كابتن ثابت، بجانب مهاجمين متوسطين بسعر 6.0M-7.5M.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Evaluating Premier League Strikers' },
      { type: 'paragraph', text: 'Prioritize forwards with 90-minute security, primary penalty duty, and high box touch volume.' },
    ],
  },

  {
    id: 'free-hit-strategy-guide',
    slug: 'free-hit-strategy-guide',
    title: 'استراتيجية الفري هيت (Free Hit) - استغلال الجولات الفارغة والمزدوجة',
    titleEn: 'Free Hit Strategy Guide - Capitalizing on Blank & Double Gameweeks',
    excerpt: 'دليل تفعيل كرت الفري هيت للوصول لـ 100+ نقطة في جولة واحدة دون المساس بتشكيلتك الأساسية.',
    excerptEn: 'Learn how to maximize your Free Hit chip during blank fixtures or mega double gameweeks.',
    category: 'إدارة الخواص',
    categoryEn: 'Chips Strategy',
    categoryColor: '#ec4899',
    author: 'MINI FPL Editorial',
    authorRank: 'خبير الخواص',
    authorRankEn: 'Chips Specialist',
    date: '2026-08-09',
    readTime: '8 دقائق قراءة',
    readTimeEn: '8 min read',
    coverIcon: 'BookOpen',
    content: [
      { type: 'heading', text: 'كيف يعمل كرت الفري هيت (Free Hit)؟' },
      { type: 'paragraph', text: 'خاصية الفري هيت تمنحك إمكانية إعادة تغيير تشكيلتك بالكامل للجولة القادمة فقط، وفور انتهاء الجولة تعود تشكيلة فريقك الأصلية تلقائياً كما كانت بدون أي تأثير مستقبلي.' },
      { type: 'heading', text: 'التوقيت المثالي لاستخدام الفري هيت:' },
      { type: 'paragraph', text: '1. **الجولات الفارغة الكبرى (Blank Gameweeks):** عندما تؤجل مباريات 6 إلى 8 أندية بسبب أدوار الكأس، ويصبح فريقك يحتوي على 4 أو 5 لاعبين فقط يشاركون في الجولة.\n2. **الجولات المزدوجة المصغرة (Small Double Gameweeks):** لاقتناص لاعبين يلعبون مباراتين في نفس الجولة دون الحاجة لتقييد فريقك بهم للأسبوع التالي.' },
      { type: 'warning', text: 'تحذير: لا تستهلك كرت الفري هيت لمجرد تحسين شكل الفريق في جولة عادية، احتفظ به للجولات الاستثنائية.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Deploying the Free Hit Chip' },
      { type: 'paragraph', text: 'Free Hit re-engineers your squad for 1 week only. Save for major Blank or Double Gameweeks.' },
    ],
  },

  {
    id: 'triple-captain-strategy',
    slug: 'triple-captain-strategy',
    title: 'أدلة التريبل كابتن (Triple Captain) - كيف تصطاد الـ 45+ نقطة بكابتنك؟',
    titleEn: 'Triple Captain Strategy - Hunting 45+ Points with Your Captain',
    excerpt: 'دليل شامل لاقتناص النقاط المضاعفة 3 مرات عبر كرت التريبل كابتن في الجولات المزدوجة.',
    excerptEn: 'Mastering the Triple Captain chip in major Double Gameweeks for explosive mini-league gains.',
    category: 'اختيارات الكابتن',
    categoryEn: 'Captaincy Picks',
    categoryColor: '#8b5cf6',
    author: 'MINI FPL Editorial',
    authorRank: 'تحليلات تكتيكية',
    authorRankEn: 'Tactical Analysis',
    date: '2026-08-09',
    readTime: '7 دقائق قراءة',
    readTimeEn: '7 min read',
    coverIcon: 'Award',
    content: [
      { type: 'heading', text: 'حسابات نقاط التريبل كابتن الرقمية' },
      { type: 'paragraph', text: 'عند تفعيل التريبل كابتن، يتم ضرب نقاط كابتنك في 3 بدلاً من 2. إذا سجل نجمك هدفين وصنع هدفاً وحصل على 15 نقطة، فإن حصيلتك الإجمالية منه ستكون 45 نقطة كاملة!' },
      { type: 'tip-card', text: 'المعيار الذهبي: تفاعل دائماً مع التريبل كابتن في جولة مزدوجة (Double Gameweek) يلعب فيها نجمك مباراتين متتاليتين على ملعبه.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Triple Captain Mechanics' },
      { type: 'paragraph', text: 'Multiplies your captain score by 3. Target DGW home fixtures with elite performers.' },
    ],
  },

  {
    id: 'bench-boost-preparation-guide',
    slug: 'bench-boost-preparation-guide',
    title: 'تحضير دكة البدلاء لخاصية البنش بوست (Bench Boost) - خطة الـ 15 لاعباً أساسياً',
    titleEn: 'Bench Boost Strategy - Building a Strong 15-Man Squad',
    excerpt: 'دليل تجهيز 15 لاعباً أساسياً يشاركون بانتظام لاقتناص أعلى مجموع نقاط ممكن في كرت البنش بوست.',
    excerptEn: 'How to carefully build a 15-player active squad to unleash a massive Bench Boost week.',
    category: 'إدارة الخواص',
    categoryEn: 'Chips Strategy',
    categoryColor: '#10b981',
    author: 'MINI FPL Editorial',
    authorRank: 'استراتيجيات الفانتازي',
    authorRankEn: 'FPL Strategies',
    date: '2026-08-09',
    readTime: '7 دقائق قراءة',
    readTimeEn: '7 min read',
    coverIcon: 'Shield',
    content: [
      { type: 'heading', text: 'شروط نجاح كرت البنش بوست' },
      { type: 'paragraph', text: 'خاصية البنش بوست تحسب نقاط بدلاءك الأربعة (حارس + 3 لاعبين). للوصول لعائد يتجاوز 25-30 نقطة إضافية، يجب التحضير لبدلاء يلعبون 90 دقيقة كاملة ولهم مباريات سهلة أو مزدوجة.' },
      { type: 'tip-card', text: 'نصيحة الربط: قم بتفعيل كرت الوايلد كارد قبل كرت البنش بوست بجولة واحدة لضبط ميزانية البدلاء بدقة.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Bench Boost Preparation' },
      { type: 'paragraph', text: 'Ensure all 15 squad members have active starting roles. Best executed right after a Wildcard.' },
    ],
  },

  {
    id: 'price-rises-drops-algorithm',
    slug: 'price-rises-drops-algorithm',
    title: 'فهم خوارزمية أسعار اللاعبين - كيف تكسب ملايين إضافية في سوق الانتقالات؟',
    titleEn: 'FPL Price Change Algorithm - Building Team Value Smartly',
    excerpt: 'شرح تفصيلي لتغيرات أسعار اللاعبين اليومية، وكيف تبني ميزانية فريق تتجاوز 104M.',
    excerptEn: 'In-depth explanation of FPL price rise and fall algorithms to expand your overall team value.',
    category: 'سوق الانتقالات',
    categoryEn: 'Transfer Market',
    categoryColor: '#3b82f6',
    author: 'MINI FPL Editorial',
    authorRank: 'تحليل الأسواق',
    authorRankEn: 'Market Analysis',
    date: '2026-08-09',
    readTime: '7 دقائق قراءة',
    readTimeEn: '7 min read',
    coverIcon: 'TrendingUp',
    content: [
      { type: 'heading', text: 'خوارزمية تغير الأسعار اليومية' },
      { type: 'paragraph', text: 'تتغير أسعار اللاعبين بمقدار 0.1M يومياً في تمام الساعة 2:30 صباحاً بتوقيت جرينتش بناءً على صافي الشراء والبيع بين ملايين المدربين حول العالم.' },
      { type: 'warning', text: 'قاعدة الربح: عند بيع لاعب ارتفع سعره 0.4M، ستحصل على نصف الزيادة فقط (+0.2M) يضاف لميزانيتك.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Price Change Mechanics' },
      { type: 'paragraph', text: 'Prices shift 0.1M daily based on net transfers. You retain 50% of the price rise profit when selling.' },
    ],
  },

  {
    id: 'rotation-risk-pep-roulette',
    slug: 'rotation-risk-pep-roulette',
    title: 'مخاطر المداورة واستراتيجية تجنب دكة البدلاء للفرق الكبرى',
    titleEn: 'Beating Rotation Risk - How to Avoid Bench DNP Surprises',
    excerpt: 'كيف تتعامل مع مداورة مدربي الأندية الكبرى وتضمن مشاركة لاعبيك الأساسيين طوال الموسم.',
    excerptEn: 'Tactics to protect your squad from heavy squad rotation and unexpected benchings.',
    category: 'التكتيك والتخطيط',
    categoryEn: 'Tactics & Planning',
    categoryColor: '#f59e0b',
    author: 'MINI FPL Editorial',
    authorRank: 'تحليلات الفرق',
    authorRankEn: 'Team Analytics',
    date: '2026-08-09',
    readTime: '7 دقائق قراءة',
    readTimeEn: '7 min read',
    coverIcon: 'Award',
    content: [
      { type: 'heading', text: 'حماية تشكيلتك من المداورة' },
      { type: 'paragraph', text: 'أندية دوري الأطلس ودوري الأبطال تقوم بمداورة لاعبيها باستمرار لتجنب الإجهاد. اختر النجوم الذين يشاركون بانتظام لـ 80+ دقيقة أو العمود الفقري للفريق.' },
      { type: 'tip-card', text: 'دكة البدلاء النشطة: احرص أن يكون بديلك الأول دائماً لاعباً أساسياً في فريقه بـ 4.5M لضمان الدخول التلقائي عند استبعاد نجومك.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Managing Rotation Risk' },
      { type: 'paragraph', text: 'Prioritize nailed-on 80+ minute starters and keep an active 4.5M first-sub on your bench.' },
    ],
  },

  {
    id: 'set-piece-takers-penalties',
    slug: 'set-piece-takers-penalties',
    title: 'دليل منفذي الكرات الثابتة وركلات الجزاء - مفتاح النقاط المجانية',
    titleEn: 'Set-Piece & Penalty Takers Guide - Unlocking Free Points',
    excerpt: 'دليل شامل لأهم منفذي ركلات الجزاء والضربات الحرة والركنية في أندية الدوري الإنجليزي الممتاز.',
    excerptEn: 'Comprehensive overview of designated penalty, corner, and free-kick takers in the Premier League.',
    category: 'بناء التشكيلة',
    categoryEn: 'Squad Building',
    categoryColor: '#10b981',
    author: 'MINI FPL Editorial',
    authorRank: 'قواعد البيانات',
    authorRankEn: 'Data Analytics',
    date: '2026-08-09',
    readTime: '8 دقائق قراءة',
    readTimeEn: '8 min read',
    coverIcon: 'Shield',
    content: [
      { type: 'heading', text: 'أهمية منفذي الضربات الثابتة' },
      { type: 'paragraph', text: 'منفذ الضربات الركنية والركلات الحرة يملك فرصة أكبر بنسبة 40% للتمريرات الحاسمة المحققة. أما منفذ ركلات الجزاء فيضمن عائداً مستقراً طوال الموسم.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Set-Piece Value' },
      { type: 'paragraph', text: 'Corner and free-kick takers deliver baseline assist potential, while penalty takers boost goal output.' },
    ],
  },

  {
    id: 'underlying-stats-xg-xa-guide',
    slug: 'underlying-stats-xg-xa-guide',
    title: 'كيف تستخدم إحصائيات xG و xA لاكتشاف النجوم قبل الجميع؟',
    titleEn: 'Mastering Underlying Stats: Using xG & xA to Spot Winners Early',
    excerpt: 'تعلم قراءة مؤشرات الأهداف المتوقعة والتمريرات الحاسمة لتحديد اللاعبين القادمين بقوة وتجنب الحظ المؤقت.',
    excerptEn: 'Learn to interpret Expected Goals (xG) and Expected Assists (xA) to stay ahead of your mini-league.',
    category: 'التكتيك والتخطيط',
    categoryEn: 'Tactics & Planning',
    categoryColor: '#8b5cf6',
    author: 'MINI FPL Editorial',
    authorRank: 'تحليل الإحصائيات',
    authorRankEn: 'Stats Specialist',
    date: '2026-08-09',
    readTime: '8 دقائق قراءة',
    readTimeEn: '8 min read',
    coverIcon: 'TrendingUp',
    content: [
      { type: 'heading', text: 'فهم إحصائيات xG و xA' },
      { type: 'paragraph', text: 'مؤشر xG يحدد جودة الفرص التي يحصل عليها اللاعب أمام المرمى. اللاعب الذي يسجل معدل xG عالي دون تسجيل أهداف هو مرشح بارز للانفجار التهديفي قريبًا.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Understanding xG & xA Metrics' },
      { type: 'paragraph', text: 'xG evaluates shot quality while xA evaluates pass quality. Target underperforming high-xG players.' },
    ],
  },

  {
    id: 'blank-double-gameweeks-planning',
    slug: 'blank-double-gameweeks-planning',
    title: 'خطة التعامل مع الجولات الفارغة والمزدوجة (Blank & Double Gameweeks)',
    titleEn: 'Mastering Blank & Double Gameweeks - Long-Term Planning Strategy',
    excerpt: 'استراتيجية التخطيط لجدول المباريات واستغلال الفرق التي تلعب مباراتين في جولة واحدة.',
    excerptEn: 'How to navigate postponed fixtures and target explosive double gameweek teams.',
    category: 'سوق الانتقالات',
    categoryEn: 'Transfer Market',
    categoryColor: '#ef4444',
    author: 'MINI FPL Editorial',
    authorRank: 'تخطيط الجدول',
    authorRankEn: 'Fixture Planning',
    date: '2026-08-09',
    readTime: '7 دقائق قراءة',
    readTimeEn: '7 min read',
    coverIcon: 'BookOpen',
    content: [
      { type: 'heading', text: 'التخطيط للجولات الاستثنائية' },
      { type: 'paragraph', text: 'احرص على احتفاظك بالتغييرات المجانية قبل الجولات المزدوجة لتتمكن من ضم 3 إلى 6 لاعبين يلعبون مباراتين في نفس الأسبوع دون الحاجة لخصم نقاط.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Planning for Rescheduled Fixtures' },
      { type: 'paragraph', text: 'Bank free transfers ahead of DGWs to seamlessly stack your squad with double-fixture starters.' },
    ],
  },

  {
    id: 'top-10k-manager-mindset',
    slug: 'top-10k-manager-mindset',
    title: 'عقلية المدرب المحترف - كيف تتصرف عند انخفاض ترتيبك أو التعثر؟',
    titleEn: 'The Top 10k Manager Mindset - Managing Rank Drops & Variance',
    excerpt: 'النصائح الذهبية للتحكم في المشاعر والتصرف بذكاء عند مرور فريقك بجولة سيئة أو تراجع ترتيبك الكلي.',
    excerptEn: 'Key mental strategies for dealing with variance, bad gameweeks, and staying cool under pressure.',
    category: 'التكتيك والتخطيط',
    categoryEn: 'Tactics & Planning',
    categoryColor: '#3b82f6',
    author: 'MINI FPL Editorial',
    authorRank: 'عقلية الفانتازي',
    authorRankEn: 'FPL Mindset',
    date: '2026-08-09',
    readTime: '6 دقائق قراءة',
    readTimeEn: '6 min read',
    coverIcon: 'Award',
    content: [
      { type: 'heading', text: 'عقلية الصبر وإدارة التباين الرقمي (Variance)' },
      { type: 'paragraph', text: 'موسم الفانتازي عبارة عن ماراثون ممتد لـ 38 جولة. التراجع في جولة أو جولتين أمر طبيعي. لا تتخذ قرارات انتقامية بخصم نقاط (-8 أو -12) بدافع الغضب.' },
    ],
    contentEn: [
      { type: 'heading', text: 'Patience & Long-Term Mindset' },
      { type: 'paragraph', text: 'FPL is a 38-week marathon. Maintain emotional discipline and avoid rage transfers after bad gameweeks.' },
    ],
  },
];

export const articles = defaultArticles;
