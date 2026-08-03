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
    excerpt: 'دليل شامل لاختيار حارس المرمى الأمثل لفريقك في موسم 25/26. من تجربة مدير حقق المركز 9,000 عالمياً.',
    excerptEn: 'A comprehensive guide to picking the best goalkeeper for your FPL 25/26 team. From a manager who finished top 9,000 globally.',
    category: 'بناء التشكيلة',
    categoryEn: 'Squad Building',
    categoryColor: '#10b981',
    author: 'MINI FPL',
    authorRank: 'المركز ~9,000 عالمياً موسم 24/25',
    authorRankEn: 'Top ~9,000 globally in 24/25',
    date: '2026-08-03',
    readTime: '3 دقائق قراءة',
    readTimeEn: '3 min read',
    coverIcon: 'Shield',
    content: [
      {
        type: 'heading',
        text: 'القاعدة الذهبية: لا تصرف أكثر من اللازم على الحراسة',
      },
      {
        type: 'paragraph',
        text: 'أول وأهم نصيحة لازم تعرفها وإنت بتبني تشكيلتك من الصفر: تجنب صرف أكثر من 10 مليون على مركز حراسة المرمى (حارسين مع بعض). الميزانية المثالية هي 8.5 أو 9 مليون بالكتير. الفلوس الزيادة محتاجها في الدفاع والوسط والهجوم - هناك الفرق الحقيقي في النقاط.',
      },
      {
        type: 'warning',
        text: 'تنبيه هام: لا تصرف أكثر من 9-10 مليون على الحراسة (حارسين مع بعض). الميزانية المثالية: 8.5M - 9M',
      },
      {
        type: 'divider',
      },
      {
        type: 'heading',
        text: 'فئة الـ 6.0 مليون - الخيار الأوحد المتاح',
      },
      {
        type: 'paragraph',
        text: 'في فئة الـ 6 مليون مفيش غير خيار واحد يستحق وهو رايا حارس أرسنال. لو قررت تروح مع حارس بـ 6 مليون، رايا هو الخيار الأفضل والأوحد. ممكن تجيبه مع حارس بـ 4 مليون يقعد على الدكة وتنساه لآخر الموسم.',
      },
      {
        type: 'player-card',
        playerName: 'دافيد رايا',
        playerTeam: 'أرسنال',
        playerPrice: '6.0M',
        playerImage: '/players/Arsenal/b22b5eee4eb2-1-david-raya.png',
        tier: 'فئة الـ 6.0 مليون',
        highlight: true,
        items: [
          'الخيار الأوحد في هذه الفئة السعرية',
          'أرسنال من أقوى الدفاعات في البريميرليج',
          'تصديات مهمة + شباك نظيفة مضمونة',
          'زاوجه مع حارس بـ 4M وانسى الحراسة',
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'heading',
        text: 'فئة الـ 5.5 مليون - بيكفورد أم دوناروما؟',
      },
      {
        type: 'paragraph',
        text: 'لو حابب توفر شوية وتنزل لفئة الـ 5.5 مليون، عندك خيارين ممتازين: بيكفورد (إيفرتون) ودوناروما. لكن بيكفورد بيعمل تصديات أكتر وده معناه نقاط إضافية من التصديات (نقطة لكل 3 تصديات). فـ بيكفورد هو الأفضل في الفئة دي.',
      },
      {
        type: 'player-card',
        playerName: 'جوردان بيكفورد',
        playerTeam: 'إيفرتون',
        playerPrice: '5.5M',
        playerImage: '/players/Everton/49593e00-79cc-11f0-91cc-258e0b00204a.webp',
        tier: 'فئة الـ 5.5 مليون',
        highlight: false,
        items: [
          'تصديات أكثر = نقاط إضافية',
          'نقطة لكل 3 تصديات حاسمة',
          'خيار ثابت وموثوق طوال الموسم',
        ],
      },
      {
        type: 'player-card',
        playerName: 'جانلويجي دوناروما',
        playerTeam: 'مانشستر سيتي',
        playerPrice: '5.5M',
        playerImage: '/players/Man City/donnaruma-elec-bl.webp',
        tier: 'فئة الـ 5.5 مليون البديلة',
        highlight: false,
        items: [
          'شباك نظيفة متوقعة',
          'دفاع قوي من مان سيتي',
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'heading',
        text: 'فئة الـ 5.0 مليون - حارس اليونايتد',
      },
      {
        type: 'paragraph',
        text: 'لو نزلت لفئة الـ 5 مليون، فيها حارس وحيد يستحق الاهتمام وهو لمينسن حارس مانشستر يونايتد. خيار ممتاز لو عايز توفر ميزانية أكبر للمراكز الهجومية.',
      },
      {
        type: 'player-card',
        playerName: 'ألتاي لمينسن',
        playerTeam: 'مانشستر يونايتد',
        playerPrice: '5.0M',
        playerImage: '/players/Man Unitd/media_102559860_102166986.jpg.webp',
        tier: 'فئة الـ 5.0 مليون',
        highlight: false,
        items: [
          'سعر ممتاز مع إمكانية شباك نظيفة',
          'يوفر ميزانية للمراكز الأخرى',
          'يونايتد بتتحسن دفاعياً',
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'heading',
        text: 'فئة الـ 4.5 مليون - أفضل فئة وأفضل اختيار',
      },
      {
        type: 'paragraph',
        text: 'وأخيراً، نيجي لأفضل فئة سعرية للحراس وهي الـ 4.5 مليون. فيها كينسكي حارس توتنهام، وده أعتقد أفضل اختيار تبدأ بيه الموسم. جيبه مع حارس بـ 4 مليون وخلاص - وبكده تكون وفرت ميزانية ضخمة للدفاع والوسط والهجوم.',
      },
      {
        type: 'player-card',
        playerName: 'أنتونين كينسكي',
        playerTeam: 'توتنهام',
        playerPrice: '4.5M',
        playerImage: '/players/TOT/firstteam_profiles_202526_antoninkinsky.webp',
        tier: 'فئة الـ 4.5 مليون (الخيار الموصى به)',
        highlight: true,
        items: [
          'أفضل اختيار لبداية الموسم',
          'سعر منخفض جداً يوفر ميزانية ضخمة',
          'توتنهام عنده مباريات سهلة في البداية',
          'زاوجه مع حارس بـ 4M فقط',
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'tip-card',
        text: 'نصيحة المدير: ابدأ بـ كينسكي (4.5M) + حارس بـ 4M = إجمالي 8.5M فقط على الحراسة. ده يوفرلك 1.5M إضافية تصرفها على لاعبين هجوميين بيجيبوا نقاط أكتر بكتير.',
      },
    ],
    contentEn: [
      {
        type: 'heading',
        text: 'Golden Rule: Do Not Overspend on Goalkeepers',
      },
      {
        type: 'paragraph',
        text: 'The first and most important tip when building your squad from scratch: never spend more than 10 million on the goalkeeper position (both keepers combined). The ideal budget is 8.5 or 9 million max.',
      },
      {
        type: 'warning',
        text: 'Important: Do not spend more than 9-10M on goalkeepers (both combined). Ideal budget: 8.5M - 9M',
      },
      {
        type: 'divider',
      },
      {
        type: 'player-card',
        playerName: 'David Raya',
        playerTeam: 'Arsenal',
        playerPrice: '6.0M',
        playerImage: '/players/Arsenal/b22b5eee4eb2-1-david-raya.png',
        tier: '6.0M Tier',
        highlight: true,
        items: [
          'The only viable option in this price bracket',
          'Arsenal has one of the best defenses in the PL',
          'Guaranteed saves + clean sheets',
        ],
      },
      {
        type: 'player-card',
        playerName: 'Jordan Pickford',
        playerTeam: 'Everton',
        playerPrice: '5.5M',
        playerImage: '/players/Everton/49593e00-79cc-11f0-91cc-258e0b00204a.webp',
        tier: '5.5M Tier',
        highlight: false,
        items: [
          'More saves = more bonus points',
          '1 point for every 3 saves',
        ],
      },
      {
        type: 'player-card',
        playerName: 'Antonin Kinsky',
        playerTeam: 'Tottenham',
        playerPrice: '4.5M',
        playerImage: '/players/TOT/firstteam_profiles_202526_antoninkinsky.webp',
        tier: '4.5M Tier (Recommended)',
        highlight: true,
        items: [
          'Best pick to start the season',
          'Very low price saves huge budget',
        ],
      },
      {
        type: 'tip-card',
        text: 'Manager Summary: Start with Kinsky (4.5M) + 4M backup = only 8.5M on keepers.',
      },
    ],
  },
];

export const articles = defaultArticles;
