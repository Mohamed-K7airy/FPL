import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand & Nav
    appName: 'MINI FPL',
    home: 'الرئيسية',
    guides: 'الدليل والنصائح',
    tips: 'نصائح التشكيلة',
    terms: 'شروط الاستخدام',
    about: 'عن المنصة',
    mySquad: 'تشكيلتي',
    transfers: 'الانتقالات',
    points: 'نقاطي',
    leagues: 'الدوريات والترتيب',
    adminPanel: 'لوحة التحكم',
    privacyPolicy: 'سياسة الخصوصية',
    login: 'تسجيل الدخول',
    register: 'حساب جديد',
    logout: 'تسجيل الخروج',
    welcome: 'مرحباً بك',
    bank: 'البنك',
    freeTransfers: 'انتقال مجاني',
    deadline: 'موعد القفل (Deadline)',

    // Pitch & Positions
    gkp: 'حارس',
    def: 'مدافع',
    mid: 'وسط',
    fwd: 'مهاجم',
    captain: 'كابتن',
    viceCaptain: 'نائب الكابتن',
    saveLineup: 'حفظ التشكيل',
    saving: 'جاري الحفظ...',
    selectPlayerToSwap: 'انقر على لاعب ثم آخر للتبديل بينهما. حدد الكابتن (C) والنائب (V).',

    // Transfers
    playerSelection: 'تنسيق ونقل اللاعبين',
    searchByName: 'البحث باسم اللاعب...',
    allPlayers: 'جميع المراكز',
    goalkeepers: 'الحراس (GKP)',
    defenders: 'المدافعون (DEF)',
    midfielders: 'خط الوسط (MID)',
    forwards: 'المهاجمون (FWD)',
    sortByPoints: 'الأعلى نقاطاً',
    sortByPrice: 'حسب السعر',
    sortByName: 'حسب الاسم',
    reset: 'إعادة ضبط',
    autoPick: 'اختيار تلقائي',
    clearSquad: 'تفريغ التشكيلة',
    saveTeam: 'تأكيد الفريق وحفظه',
    submitting: 'جاري الحفظ...',
    playersSelected: 'اللاعبون المختارون',
    unlimitedTransfers: 'يمكنك إجراء انتقالات غير محدودة قبل بداية الجولة الأولى',

    // Player Details Modal
    playerDetails: 'تفاصيل اللاعب',
    totalPoints: 'إجمالي النقاط',
    price: 'السعر الحالي',
    form: 'معدل الفورم',
    goals: 'الأهداف',
    assists: 'التمريرات الحاسمة',
    cleanSheets: 'شباك نظيفة',
    bonus: 'نقاط البونص',
    yellowCards: 'بطاقات صفراء',
    redCards: 'بطاقات حمراء',
    upcomingFixtures: 'المباريات القادمة',
    status: 'الحالة الإخبارية',
    available: 'جاهز للمشاركة',

    // Points Page
    pointsBreakdown: 'تفاصيل نقاط الجولة',
    rawPoints: 'النقاط الخام',
    transferCost: 'خصم الانتقالات',
    netPoints: 'صافي النقاط',
    activeChip: 'الورقة النشطة (Chip)',
    none: 'بدون',
    autoSubbed: 'تبديل تلقائي',

    // Leagues
    globalStandings: 'الترتيب العام العالمي',
    myMiniLeagues: 'دورياتي الخاصة',
    rank: 'الترتيب',
    teamName: 'اسم الفريق',
    pts: 'نقطة',
    createLeague: 'إنشاء دوري خاص',
    joinLeague: 'الانضمام بكود دعوة',
    leagueNamePlaceholder: 'اسم الدوري (مثال: أبطال الفانتازي)',
    joinCodePlaceholder: 'أدخل كود الدعوة (6 أرقام/حروف)',
    createBtn: 'إنشاء والحصول على كود الدعوة',
    joinBtn: 'انضمام للدوري',

    // Footer
    footerRights: 'جميع الحقوق محفوظة منصة MINI FPL © 2026',
    adDisclaimer: 'هذا الموقع مستقل ويستخدم إعلانات جوجل AdSense ببيانات مجانية ودعم فني متكامل.',

    // Common
    loading: 'جاري التحميل...',
  },
  en: {
    // Brand & Nav
    appName: 'MINI FPL',
    home: 'Home',
    guides: 'Guides & Tips',
    tips: 'Squad Tips',
    terms: 'Terms of Service',
    about: 'About Us',
    mySquad: 'My Squad',
    transfers: 'Transfers',
    points: 'Points',
    leagues: 'Leagues & Rank',
    adminPanel: 'Admin Panel',
    privacyPolicy: 'Privacy Policy',
    login: 'Log In',
    register: 'Register',
    logout: 'Log Out',
    welcome: 'Welcome',
    bank: 'Bank',
    freeTransfers: 'Free Transfers',
    deadline: 'Gameweek Deadline',

    // Pitch & Positions
    gkp: 'GKP',
    def: 'DEF',
    mid: 'MID',
    fwd: 'FWD',
    captain: 'Captain',
    viceCaptain: 'Vice Captain',
    saveLineup: 'Save Lineup',
    saving: 'Saving...',
    selectPlayerToSwap: 'Click a player then another to swap positions. Set Captain (C) and Vice (V).',

    // Transfers
    playerSelection: 'Player Selection',
    searchByName: 'Search player name...',
    allPlayers: 'All Positions',
    goalkeepers: 'Goalkeepers (GKP)',
    defenders: 'Defenders (DEF)',
    midfielders: 'Midfielders (MID)',
    forwards: 'Forwards (FWD)',
    sortByPoints: 'Total Points',
    sortByPrice: 'Price',
    sortByName: 'Name',
    reset: 'Reset',
    autoPick: 'Auto Pick',
    clearSquad: 'Clear Squad',
    saveTeam: 'Confirm & Save Team',
    submitting: 'Saving...',
    playersSelected: 'Players Selected',
    unlimitedTransfers: 'Unlimited free transfers before Gameweek 1 deadline',

    // Player Details Modal
    playerDetails: 'Player Performance Details',
    totalPoints: 'Total Points',
    price: 'Current Price',
    form: 'Form Rating',
    goals: 'Goals Scored',
    assists: 'Assists',
    cleanSheets: 'Clean Sheets',
    bonus: 'Bonus Points',
    yellowCards: 'Yellow Cards',
    redCards: 'Red Cards',
    upcomingFixtures: 'Upcoming Fixtures',
    status: 'News Status',
    available: 'Available to play',

    // Points Page
    pointsBreakdown: 'Gameweek Points Breakdown',
    rawPoints: 'Raw Points',
    transferCost: 'Transfer Cost',
    netPoints: 'Net Points',
    activeChip: 'Active Chip',
    none: 'None',
    autoSubbed: 'Auto-Subbed',

    // Leagues
    globalStandings: 'Global Standings',
    myMiniLeagues: 'My Private Leagues',
    rank: 'Rank',
    teamName: 'Team Name',
    pts: 'pts',
    createLeague: 'Create Private League',
    joinLeague: 'Join via Invite Code',
    leagueNamePlaceholder: 'League Name (e.g. Champions League)',
    joinCodePlaceholder: 'Enter 6-character invite code',
    createBtn: 'Create & Get Code',
    joinBtn: 'Join League',

    // Footer
    footerRights: 'All rights reserved MINI FPL Platform © 2026',
    adDisclaimer: 'Independent Fantasy Premier League clone powered by live data and AdSense.',

    // Common
    loading: 'Loading...',
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('fpl_lang') as Language) || 'ar';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('fpl_lang', newLang);
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isRtl: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
