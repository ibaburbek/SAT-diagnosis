import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  // Navigation
  navDashboard: string;
  navDiagnostic: string;
  navSkillMap: string;
  navStudyPlan: string;
  navLearnPractice: string;
  navVocabulary: string;
  navSettings: string;
  // Actions
  startDiagnostic: string;
  continueDiagnostic: string;
  viewReport: string;
  practiceSkill: string;
  viewLesson: string;
  resetProgress: string;
  exportData: string;
  importData: string;
  save: string;
  cancel: string;
  next: string;
  previous: string;
  submitAnswer: string;
  pauseTest: string;
  resumeTest: string;
  exitTest: string;
  finishTest: string;
  viewGlossary: string;
  showHint: string;
  hideHint: string;
  showSolution: string;
  // Diagnostic
  diagnosticTitle: string;
  diagnosticSubtitle: string;
  mathModeLabel: string;
  englishModeLabel: string;
  questionNumber: string;
  difficultyLabel: string;
  domainLabel: string;
  enterAnswerPlaceholder: string;
  pauseConfirmText: string;
  // Statuses
  statusStrong: string;
  statusDeveloping: string;
  statusNeedsAttention: string;
  statusNotEnoughEvidence: string;
  // Disclaimers
  diagnosticDisclaimer: string;
  localDataDisclaimer: string;
  // Common
  minutes: string;
  hours: string;
  accuracy: string;
  questions: string;
  prerequisites: string;
  keyFormulas: string;
  // Onboarding
  onboardingTitle: string;
  onboardingSubtitle: string;
  prefLanguage: string;
  currentScoreLabel: string;
  targetScoreLabel: string;
  dontKnowScore: string;
  examDateLabel: string;
  notScheduled: string;
  weeklyHoursLabel: string;
  priorPrepLabel: string;
  prepBeginner: string;
  prepSome: string;
  prepExperienced: string;
  getStarted: string;
  skipOnboarding: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'ApexSAT Math',
    tagline: 'Adaptive Digital SAT Math Engine for International Students',
    navDashboard: 'Dashboard',
    navDiagnostic: 'Diagnostic Test',
    navSkillMap: 'My Skill Map',
    navStudyPlan: 'Study Plan',
    navLearnPractice: 'Learn & Practice',
    navVocabulary: 'Vocabulary',
    navSettings: 'Settings',
    startDiagnostic: 'Start Diagnostic',
    continueDiagnostic: 'Resume Test',
    viewReport: 'View Diagnostic Report',
    practiceSkill: 'Targeted Practice',
    viewLesson: 'Study Lesson',
    resetProgress: 'Reset Progress',
    exportData: 'Export Progress (JSON)',
    importData: 'Import Progress',
    save: 'Save',
    cancel: 'Cancel',
    next: 'Next Question',
    previous: 'Previous Question',
    submitAnswer: 'Submit Answer',
    pauseTest: 'Pause & Save',
    resumeTest: 'Resume Diagnostic',
    exitTest: 'Exit Test',
    finishTest: 'Complete Diagnostic',
    viewGlossary: 'Math Glossary',
    showHint: 'Need a Hint?',
    hideHint: 'Hide Hint',
    showSolution: 'Worked Solution',
    diagnosticTitle: 'Adaptive Digital SAT Math Diagnostic',
    diagnosticSubtitle: 'Calibrates dynamically across all 4 SAT domains. Take 20-30 minutes at your own pace.',
    mathModeLabel: 'Mathematics Diagnostic (Translations Available)',
    englishModeLabel: 'English Challenge (English Only)',
    questionNumber: 'Question',
    difficultyLabel: 'Difficulty',
    domainLabel: 'Domain',
    enterAnswerPlaceholder: 'Type numerical answer (e.g. 6, 3/4, 0.75)',
    pauseConfirmText: 'Progress saved locally. You can resume at any time.',
    statusStrong: 'Strong',
    statusDeveloping: 'Developing',
    statusNeedsAttention: 'Needs Attention',
    statusNotEnoughEvidence: 'Not Enough Evidence',
    diagnosticDisclaimer: 'Educational Notice: This diagnostic evaluates conceptual mastery across SAT domains. It is not an official College Board SAT score.',
    localDataDisclaimer: 'Privacy Notice: All data is stored locally in your browser. It does not sync to a cloud server and can be cleared if you delete browser data.',
    minutes: 'min',
    hours: 'hrs/week',
    accuracy: 'Accuracy',
    questions: 'Questions',
    prerequisites: 'Prerequisites',
    keyFormulas: 'Key Formulas & Rules',
    onboardingTitle: 'Welcome to ApexSAT Math',
    onboardingSubtitle: 'Personalized preparation designed for international students targeting 700+.',
    prefLanguage: 'Preferred Interface & Translation Language',
    currentScoreLabel: 'Current / Baseline SAT Math Score',
    targetScoreLabel: 'Target SAT Math Score',
    dontKnowScore: "I don't know my baseline yet",
    examDateLabel: 'Upcoming SAT Exam Date',
    notScheduled: 'Not scheduled yet',
    weeklyHoursLabel: 'Available Study Time per Week',
    priorPrepLabel: 'Prior SAT Math Preparation',
    prepBeginner: 'Beginner (Just starting out)',
    prepSome: 'Some preparation (Familiar with SAT topics)',
    prepExperienced: 'Experienced (Retaking or aiming for 750+)',
    getStarted: 'Begin Diagnostic Journey',
    skipOnboarding: 'Explore as Guest',
  },
  kk: {
    appName: 'ApexSAT Math',
    tagline: 'Халықаралық оқушыларға арналған бейімделгіш Digital SAT Math платформасы',
    navDashboard: 'Басты бет',
    navDiagnostic: 'Диагностикалық тест',
    navSkillMap: 'Дағдылар картасы',
    navStudyPlan: 'Оқу жоспары',
    navLearnPractice: 'Сабақтар және жаттығу',
    navVocabulary: 'Сөздік',
    navSettings: 'Баптаулар',
    startDiagnostic: 'Тестті бастау',
    continueDiagnostic: 'Тестті жалғастыру',
    viewReport: 'Есепті қарау',
    practiceSkill: 'Есептер шығару',
    viewLesson: 'Сабақты оқу',
    resetProgress: 'Прогресті өшіру',
    exportData: 'Прогресті жүктеп алу (JSON)',
    importData: 'JSON файлын жүктеу',
    save: 'Сақтау',
    cancel: 'Болдырмау',
    next: 'Келесі сұрақ',
    previous: 'Алдыңғы сұрақ',
    submitAnswer: 'Жауапты тапсыру',
    pauseTest: 'Кідірту және сақтау',
    resumeTest: 'Жалғастыру',
    exitTest: 'Шығу',
    finishTest: 'Тестті аяқтау',
    viewGlossary: 'Математикалық сөздік',
    showHint: 'Көмек керек пе?',
    hideHint: 'Көмекті жасыру',
    showSolution: 'Толық шешімі',
    diagnosticTitle: 'Бейімделгіш Digital SAT Math диагностикасы',
    diagnosticSubtitle: '4 бағыт бойынша дағдыларыңызды тексереді. 20-30 минут уақытыңызды бөліңіз.',
    mathModeLabel: 'Математикалық диагностика (аудармасымен)',
    englishModeLabel: 'Ағылшын тілі сынағы (тек ағылшынша)',
    questionNumber: 'Сұрақ',
    difficultyLabel: 'Күрделілігі',
    domainLabel: 'Бөлім',
    enterAnswerPlaceholder: 'Сандық жауапты жазыңыз (мыс. 6, 3/4, 0.75)',
    pauseConfirmText: 'Нәтижелер браузерде сақталды. Кез келген уақытта жалғастыра аласыз.',
    statusStrong: 'Мықты',
    statusDeveloping: 'Дамып келе жатыр',
    statusNeedsAttention: 'Көңіл бөлуді қажет етеді',
    statusNotEnoughEvidence: 'Деректер жеткіліксіз',
    diagnosticDisclaimer: 'Ескерту: Бұл тест математикалық ұғымдарды бағалайды және ресми SAT балы болып табылмайды.',
    localDataDisclaimer: 'Құпиялылық: Барлық деректер тек сіздің браузеріңізде сақталады. Бұлтты серверлерге жіберілмейді.',
    minutes: 'мин',
    hours: 'сағ/апта',
    accuracy: 'Дәлдік',
    questions: 'Сұрақтар',
    prerequisites: 'Алғышарттар',
    keyFormulas: 'Негізгі формулалар',
    onboardingTitle: 'ApexSAT Math жүйесіне қош келдіңіз',
    onboardingSubtitle: '700+ баллды мақсат еткен оқушыларға арналған жеке оқу жолы.',
    prefLanguage: 'Негізгі тілді таңдаңыз',
    currentScoreLabel: 'Қазіргі SAT Math балыңыз',
    targetScoreLabel: 'Мақсатты балыңыз',
    dontKnowScore: 'Әзірге білмеймін',
    examDateLabel: 'SAT емтиханының күні',
    notScheduled: 'Әлі белгіленбеген',
    weeklyHoursLabel: 'Аптасына бөле алатын уақытыңыз',
    priorPrepLabel: 'Бұрынғы дайындық тәжірибеңіз',
    prepBeginner: 'Жаңадан бастаушы',
    prepSome: 'Аздаған тәжірибем бар',
    prepExperienced: 'Тәжірибелі (қайта тапсырушы)',
    getStarted: 'Диагностиканы бастау',
    skipOnboarding: 'Қонақ ретінде көру',
  },
  ru: {
    appName: 'ApexSAT Math',
    tagline: 'Адаптивная платформа подготовки к Digital SAT Math для международных студентов',
    navDashboard: 'Панель',
    navDiagnostic: 'Диагностика',
    navSkillMap: 'Карта навыков',
    navStudyPlan: 'План учебы',
    navLearnPractice: 'Уроки и практика',
    navVocabulary: 'Словарь терминов',
    navSettings: 'Настройки',
    startDiagnostic: 'Начать тест',
    continueDiagnostic: 'Продолжить тест',
    viewReport: 'Отчет диагностики',
    practiceSkill: 'Целевая практика',
    viewLesson: 'Открыть урок',
    resetProgress: 'Сбросить прогресс',
    exportData: 'Экспорт прогресса (JSON)',
    importData: 'Импорт из JSON',
    save: 'Сохранить',
    cancel: 'Отмена',
    next: 'Следующий вопрос',
    previous: 'Предыдущий вопрос',
    submitAnswer: 'Отправить ответ',
    pauseTest: 'Пауза и сохранение',
    resumeTest: 'Продолжить тест',
    exitTest: 'Выйти из теста',
    finishTest: 'Завершить тест',
    viewGlossary: 'Словарь терминов',
    showHint: 'Нужна подсказка?',
    hideHint: 'Скрыть подсказку',
    showSolution: 'Пошаговое решение',
    diagnosticTitle: 'Адаптивный диагностический тест Digital SAT Math',
    diagnosticSubtitle: 'Оценивает уровень владения по 4 разделам SAT. Займет 20–30 минут в комфортном темпе.',
    mathModeLabel: 'Математическая диагностика (с переводом)',
    englishModeLabel: 'Английский вызов (только английский)',
    questionNumber: 'Вопрос',
    difficultyLabel: 'Сложность',
    domainLabel: 'Раздел',
    enterAnswerPlaceholder: 'Введите числовой ответ (напр. 6, 3/4, 0.75)',
    pauseConfirmText: 'Прогресс сохранен локально. Вы можете вернуться в любое время.',
    statusStrong: 'Уверенно',
    statusDeveloping: 'В процессе',
    statusNeedsAttention: 'Требует внимания',
    statusNotEnoughEvidence: 'Недостаточно данных',
    diagnosticDisclaimer: 'Важно: Тест оценивает концептуальное понимание и не является официальным баллом College Board.',
    localDataDisclaimer: 'Конфиденциальность: Все данные хранятся локально в вашем браузере и не передаются в облако.',
    minutes: 'мин',
    hours: 'ч/нед',
    accuracy: 'Точность',
    questions: 'Вопросы',
    prerequisites: 'Пререквизиты',
    keyFormulas: 'Формулы и правила',
    onboardingTitle: 'Добро пожаловать в ApexSAT Math',
    onboardingSubtitle: 'Индивидуальная траектория подготовки для международных студентов на 700+.',
    prefLanguage: 'Предпочитаемый язык интерфейса и перевода',
    currentScoreLabel: 'Текущий балл по SAT Math',
    targetScoreLabel: 'Целевой балл по SAT Math',
    dontKnowScore: 'Пока не знаю свой балл',
    examDateLabel: 'Дата предстоящего экзамена SAT',
    notScheduled: 'Экзамен еще не назначен',
    weeklyHoursLabel: 'Часов занятий в неделю',
    priorPrepLabel: 'Опыт подготовки к SAT',
    prepBeginner: 'Начинающий (только стартую)',
    prepSome: 'Есть опыт (знаком с форматом)',
    prepExperienced: 'Опытный (пересдача / цель 750+)',
    getStarted: 'Перейти к диагностике',
    skipOnboarding: 'Пропустить и войти гостем',
  },
  id: {
    appName: 'ApexSAT Math',
    tagline: 'Platform Persiapan Digital SAT Math Adaptif untuk Siswa Internasional',
    navDashboard: 'Dasbor',
    navDiagnostic: 'Tes Diagnostik',
    navSkillMap: 'Peta Kemampuan',
    navStudyPlan: 'Rencana Belajar',
    navLearnPractice: 'Pelajaran & Latihan',
    navVocabulary: 'Kosa Kata',
    navSettings: 'Pengaturan',
    startDiagnostic: 'Mulai Diagnostik',
    continueDiagnostic: 'Lanjutkan Tes',
    viewReport: 'Lihat Laporan',
    practiceSkill: 'Latihan Terarah',
    viewLesson: 'Pelajari Materi',
    resetProgress: 'Reset Kemajuan',
    exportData: 'Ekspor Data (JSON)',
    importData: 'Impor Data JSON',
    save: 'Simpan',
    cancel: 'Batal',
    next: 'Soal Berikutnya',
    previous: 'Soal Sebelumnya',
    submitAnswer: 'Kirim Jawaban',
    pauseTest: 'Jeda & Simpan',
    resumeTest: 'Lanjutkan Tes',
    exitTest: 'Keluar Tes',
    finishTest: 'Selesaikan Tes',
    viewGlossary: 'Glosarium Matematika',
    showHint: 'Butuh Petunjuk?',
    hideHint: 'Sembunyikan Petunjuk',
    showSolution: 'Pembahasan Lengkap',
    diagnosticTitle: 'Diagnostik Adaptif Digital SAT Math',
    diagnosticSubtitle: 'Mengukur penguasaan konsep di 4 domain SAT. Durasi 20-30 menit sesuai kecepatan Anda.',
    mathModeLabel: 'Diagnostik Matematika (Bantuan Terjemahan Tersedia)',
    englishModeLabel: 'Tantangan Bahasa Inggris (Hanya Bahasa Inggris)',
    questionNumber: 'Soal',
    difficultyLabel: 'Tingkat Kesulitan',
    domainLabel: 'Domain',
    enterAnswerPlaceholder: 'Ketik jawaban angka (misal 6, 3/4, 0.75)',
    pauseConfirmText: 'Progres tersimpan di peramban. Anda dapat melanjutkannya kapan saja.',
    statusStrong: 'Kuat',
    statusDeveloping: 'Berkembang',
    statusNeedsAttention: 'Perlu Perhatian',
    statusNotEnoughEvidence: 'Bukti Belum Cukup',
    diagnosticDisclaimer: 'Pemberitahuan: Tes ini memperkirakan penguasaan keterampilan dan bukan skor resmi SAT College Board.',
    localDataDisclaimer: 'Privasi: Semua data disimpan secara lokal di browser Anda dan tidak disimpan di server cloud.',
    minutes: 'menit',
    hours: 'jam/minggu',
    accuracy: 'Akurasi',
    questions: 'Soal',
    prerequisites: 'Prasyarat',
    keyFormulas: 'Rumus Kunci & Aturan',
    onboardingTitle: 'Selamat Datang di ApexSAT Math',
    onboardingSubtitle: 'Persiapan terarah untuk siswa internasional dengan target skor 700+.',
    prefLanguage: 'Pilihan Bahasa Antarmuka & Terjemahan',
    currentScoreLabel: 'Skor SAT Math Saat Ini',
    targetScoreLabel: 'Target Skor SAT Math',
    dontKnowScore: 'Belum tahu skor awal saya',
    examDateLabel: 'Tanggal Ujian SAT Mendatang',
    notScheduled: 'Belum terjadwal',
    weeklyHoursLabel: 'Waktu Belajar per Minggu',
    priorPrepLabel: 'Pengalaman Persiapan Sebelumnya',
    prepBeginner: 'Pemula (Baru memulai)',
    prepSome: 'Cukup berpengalaman (Kenal format SAT)',
    prepExperienced: 'Berpengalaman (Mengulang / target 750+)',
    getStarted: 'Mulai Perjalanan Belajar',
    skipOnboarding: 'Masuk sebagai Tamu',
  },
};
