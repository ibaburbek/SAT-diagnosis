import React, { useState } from 'react';
import { StudentProfile, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Check, Compass, Info, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onComplete: (profile: StudentProfile) => void;
  onSkip: () => void;
  currentLanguage: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
}

export const OnboardingModal: React.FC<Props> = ({
  isOpen,
  onComplete,
  onSkip,
  currentLanguage,
  onChangeLanguage,
}) => {
  const [prefLang, setPrefLang] = useState<SupportedLanguage>(currentLanguage);
  const [currentScore, setCurrentScore] = useState<string>('');
  const [dontKnowCurrentScore, setDontKnowCurrentScore] = useState<boolean>(true);
  const [targetScore, setTargetScore] = useState<string>('720');
  const [examDate, setExamDate] = useState<string>('');
  const [notScheduled, setNotScheduled] = useState<boolean>(true);
  const [weeklyHours, setWeeklyHours] = useState<number>(4);
  const [priorPrep, setPriorPrep] = useState<'beginner' | 'some' | 'experienced'>('some');

  if (!isOpen) return null;

  const t = TRANSLATIONS[prefLang];

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setPrefLang(lang);
    onChangeLanguage(lang);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: StudentProfile = {
      preferredLanguage: prefLang,
      currentScore: dontKnowCurrentScore || !currentScore ? null : parseInt(currentScore, 10),
      targetScore: targetScore ? parseInt(targetScore, 10) : 700,
      examDate: notScheduled || !examDate ? null : examDate,
      weeklyHours,
      priorPrep,
      diagnosticMode: 'math_with_translation',
      createdAt: Date.now(),
    };
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Digital SAT Math Preparation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.onboardingTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {t.onboardingSubtitle}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {t.prefLanguage}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { code: 'en', label: 'English', native: 'English' },
                  { code: 'kk', label: 'Kazakh', native: 'Қазақша' },
                  { code: 'ru', label: 'Russian', native: 'Русский' },
                  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
                ] as const
              ).map(item => (
                <button
                  type="button"
                  key={item.code}
                  onClick={() => handleLanguageSelect(item.code)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    prefLang === item.code
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="text-sm font-medium">{item.native}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Scores Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Score */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.currentScoreLabel} (200 - 800)
              </label>
              <input
                type="number"
                min="200"
                max="800"
                step="10"
                disabled={dontKnowCurrentScore}
                value={currentScore}
                onChange={e => setCurrentScore(e.target.value)}
                placeholder="e.g. 540"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={dontKnowCurrentScore}
                  onChange={e => setDontKnowCurrentScore(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>{t.dontKnowScore}</span>
              </label>
            </div>

            {/* Target Score */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.targetScoreLabel} (600 - 800)
              </label>
              <input
                type="number"
                min="500"
                max="800"
                step="10"
                value={targetScore}
                onChange={e => setTargetScore(e.target.value)}
                placeholder="e.g. 720"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="text-[11px] text-slate-500 mt-1">Recommended for international competitive admissions: 700+</div>
            </div>
          </div>

          {/* Schedule Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Exam Date */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.examDateLabel}
              </label>
              <input
                type="date"
                disabled={notScheduled}
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={notScheduled}
                  onChange={e => setNotScheduled(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>{t.notScheduled}</span>
              </label>
            </div>

            {/* Weekly Study Hours */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {t.weeklyHoursLabel}: <strong className="text-indigo-600">{weeklyHours} hours</strong>
              </label>
              <input
                type="range"
                min="2"
                max="14"
                step="1"
                value={weeklyHours}
                onChange={e => setWeeklyHours(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>2 hrs (Light)</span>
                <span>4-6 hrs (Standard)</span>
                <span>10+ hrs (Intensive)</span>
              </div>
            </div>
          </div>

          {/* Prior Preparation Experience */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              {t.priorPrepLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(
                [
                  { id: 'beginner', label: t.prepBeginner },
                  { id: 'some', label: t.prepSome },
                  { id: 'experienced', label: t.prepExperienced },
                ] as const
              ).map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPriorPrep(opt.id)}
                  className={`p-3 text-left rounded-xl border text-xs transition-colors ${
                    priorPrep === opt.id
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-950 font-semibold ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              {t.diagnosticDisclaimer} All progress is saved in your browser.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors py-2"
            >
              {t.skipOnboarding}
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap"
            >
              {t.getStarted}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
