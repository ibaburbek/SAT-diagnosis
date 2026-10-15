import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { exportDataAsJson, importDataFromJson, resetAllData, seedDemoData } from '../services/storage';
import { Download, Upload, Trash2, Sparkles, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  language: SupportedLanguage;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onStateReloaded: () => void;
}

export const SettingsView: React.FC<Props> = ({
  language,
  onChangeLanguage,
  onStateReloaded,
}) => {
  const t = TRANSLATIONS[language];
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const handleExport = () => {
    const jsonStr = exportDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apexsat_student_progress_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const res = importDataFromJson(content);
      if (res.success) {
        setImportStatus({ success: true, msg: 'Progress imported successfully!' });
        onStateReloaded();
      } else {
        setImportStatus({ success: false, msg: res.error || 'Failed to import file.' });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    onStateReloaded();
  };

  const handleSeedDemo = (preset: 'struggling_algebra' | 'intermediate_balanced' | 'high_achiever') => {
    seedDemoData(preset);
    onStateReloaded();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Application Settings & Teacher Data Sandbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage local storage data, export or import student progress JSON, and test simulated student profiles.
        </p>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900">Language & International Settings</h3>
        <p className="text-xs text-slate-500">
          Switch the platform interface and glossary explanations at any time. All active answers and history are preserved.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {(
            [
              { code: 'en', label: 'English', native: 'English' },
              { code: 'kk', label: 'Kazakh', native: 'Қазақша' },
              { code: 'ru', label: 'Russian', native: 'Русский' },
              { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
            ] as const
          ).map(item => (
            <button
              key={item.code}
              onClick={() => onChangeLanguage(item.code)}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                language === item.code
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="text-xs text-slate-500">{item.label}</div>
              <div className="text-sm font-medium">{item.native}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Teacher / Evaluator Demo Presets */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-base font-bold text-slate-900">Teacher & Evaluator Demo Presets</h3>
        </div>
        <p className="text-xs text-slate-500">
          Instantly load pre-calibrated student profiles to evaluate the adaptive diagnostic reporting, skill map, and study plans:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => handleSeedDemo('struggling_algebra')}
            className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left transition-colors cursor-pointer space-y-1.5"
          >
            <div className="text-xs font-bold text-rose-800">1. Struggling Algebra Student</div>
            <div className="text-[11px] text-rose-900/80">
              Low accuracy in linear equations and inequalities; triggers Priority 1 algebra gaps and prerequisite warnings.
            </div>
          </button>

          <button
            onClick={() => handleSeedDemo('intermediate_balanced')}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 text-left transition-colors cursor-pointer space-y-1.5"
          >
            <div className="text-xs font-bold text-amber-800">2. Intermediate Balanced Student</div>
            <div className="text-[11px] text-amber-900/80">
              60% accuracy with developing proficiency across all 4 domains; balanced Priority 2 curriculum.
            </div>
          </button>

          <button
            onClick={() => handleSeedDemo('high_achiever')}
            className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 text-left transition-colors cursor-pointer space-y-1.5"
          >
            <div className="text-xs font-bold text-emerald-800">3. High Achiever Student</div>
            <div className="text-[11px] text-emerald-900/80">
              High accuracy across foundation & developing questions; focuses on Priority 3 hard SAT questions.
            </div>
          </button>
        </div>
      </div>

      {/* Export / Import Data */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900">Data Portability (Export & Import)</h3>
        <p className="text-xs text-slate-500">
          Transfer progress between devices or save copies of student records in standard JSON format.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>{t.exportData}</span>
          </button>

          <label className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>{t.importData}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        {importStatus && (
          <div
            className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              importStatus.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {importStatus.success ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{importStatus.msg}</span>
          </div>
        )}
      </div>

      {/* Reset Progress Section */}
      <div className="bg-white rounded-2xl border border-rose-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-rose-700">
          <Trash2 className="w-5 h-5" />
          <h3 className="text-base font-bold text-rose-950">Reset Local Student Progress</h3>
        </div>
        <p className="text-xs text-slate-600">
          Permanently clear all assessment records, saved diagnostic sessions, and study plan history from this browser.
        </p>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          {t.resetProgress}
        </button>
      </div>

      {/* Local Storage Notice */}
      <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-start gap-3">
        <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          {t.localDataDisclaimer} Clearing your browser cookies or browsing data will remove local progress.
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900">Confirm Reset</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete all saved test attempts, mastery ratings, and study plans? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
