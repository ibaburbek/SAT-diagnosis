import React from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  hasActiveSession: boolean;
  onPrimaryAction: () => void;
}

export const TopBar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  language,
  onChangeLanguage,
  hasActiveSession,
  onPrimaryAction,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onTabChange('dashboard')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer text-left"
        >
          ApexSAT Math
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {t.navDashboard}
          </button>
          <button
            onClick={() => onTabChange('diagnostic')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              activeTab === 'diagnostic' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {t.navDiagnostic}
          </button>
          <button
            onClick={() => onTabChange('skill_map')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              activeTab === 'skill_map' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {t.navSkillMap}
          </button>
          <button
            onClick={() => onTabChange('study_plan')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              activeTab === 'study_plan' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {t.navStudyPlan}
          </button>
          <button
            onClick={() => onTabChange('learn')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              activeTab === 'learn' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {t.navLearnPractice}
          </button>
          <button
            onClick={() => onTabChange('vocabulary')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              activeTab === 'vocabulary' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {t.navVocabulary}
          </button>
          <button
            onClick={() => onTabChange('settings')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 ${
              activeTab === 'settings' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            {t.navSettings}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Language Toggle */}
          <select
            value={language}
            onChange={e => onChangeLanguage(e.target.value as SupportedLanguage)}
            className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 border-none rounded-lg px-2.5 py-1.5 text-slate-700 cursor-pointer focus:outline-none"
            title="Language"
          >
            <option value="en">EN</option>
            <option value="kk">ҚАЗ</option>
            <option value="ru">РУС</option>
            <option value="id">IND</option>
          </select>

          <button
            onClick={onPrimaryAction}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {hasActiveSession ? t.continueDiagnostic : t.startDiagnostic}
          </button>
        </div>
      </div>

      {/* Mobile Nav row for small screens */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 text-[11px] font-medium text-slate-600 overflow-x-auto bg-slate-50/80">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : ''}`}
        >
          {t.navDashboard}
        </button>
        <button
          onClick={() => onTabChange('diagnostic')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'diagnostic' ? 'text-indigo-600 font-bold' : ''}`}
        >
          {t.navDiagnostic}
        </button>
        <button
          onClick={() => onTabChange('skill_map')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'skill_map' ? 'text-indigo-600 font-bold' : ''}`}
        >
          {t.navSkillMap}
        </button>
        <button
          onClick={() => onTabChange('study_plan')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'study_plan' ? 'text-indigo-600 font-bold' : ''}`}
        >
          {t.navStudyPlan}
        </button>
        <button
          onClick={() => onTabChange('learn')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'learn' ? 'text-indigo-600 font-bold' : ''}`}
        >
          {t.navLearnPractice}
        </button>
        <button
          onClick={() => onTabChange('vocabulary')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'vocabulary' ? 'text-indigo-600 font-bold' : ''}`}
        >
          {t.navVocabulary}
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className={`px-2 py-1 whitespace-nowrap ${activeTab === 'settings' ? 'text-indigo-600 font-bold' : ''}`}
        >
          {t.navSettings}
        </button>
      </div>
    </header>
  );
};
