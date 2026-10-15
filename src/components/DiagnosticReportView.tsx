import React from 'react';
import { DiagnosticReport, SupportedLanguage } from '../types';
import { SKILLS_TAXONOMY } from '../data/skillsTaxonomy';
import { TRANSLATIONS } from '../i18n/translations';
import { Award, AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Globe, Shield, Sparkles } from 'lucide-react';

interface Props {
  report: DiagnosticReport;
  language: SupportedLanguage;
  onNavigateSkillMap: () => void;
  onNavigateStudyPlan: () => void;
  onStartNewDiagnostic: () => void;
}

export const DiagnosticReportView: React.FC<Props> = ({
  report,
  language,
  onNavigateSkillMap,
  onNavigateStudyPlan,
  onStartNewDiagnostic,
}) => {
  const t = TRANSLATIONS[language];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'strong':
        return <span className="text-emerald-700 font-semibold text-xs">Strong Mastery</span>;
      case 'developing':
        return <span className="text-amber-700 font-semibold text-xs">Developing</span>;
      case 'needs_attention':
        return <span className="text-rose-700 font-semibold text-xs">Priority Gap</span>;
      default:
        return <span className="text-slate-500 font-medium text-xs">Needs Evidence</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Diagnostic Assessment Report</span>
              <span>·</span>
              <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
              {report.completionStatus === 'provisional' && (
                <>
                  <span>·</span>
                  <span className="text-amber-600 font-semibold">Provisional (Incomplete Coverage)</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Your Digital SAT Math Diagnostic Profile
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onNavigateStudyPlan}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>{t.navStudyPlan}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* High-level KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">{t.questions} Answered</div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {report.totalQuestions}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">{t.accuracy}</div>
            <div className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
              {report.accuracy}%
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Priority Gaps</div>
            <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
              {report.priorityGaps.length}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 mb-1">Strengths Identified</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              {report.strengths.length}
            </div>
          </div>
        </div>

        {/* Translation Assistance & Language Insight */}
        {report.translationUsageCount > 0 && (
          <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-3 text-xs text-indigo-950">
            <Globe className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold">Language Assistance Analysis:</div>
              <p>
                You utilized translation support on {report.translationUsageCount} out of {report.totalQuestions} questions. In mathematics scoring, your concept understanding was assessed accurately. We recommend practicing with the English Glossary to increase reading speed for official SAT test conditions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Domain Breakdown Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <span>Performance by SAT Math Domain</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(report.domainPerformances).map(domain => (
            <div
              key={domain.domainId}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {domain.domainName[language] || domain.domainName.en}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {domain.totalQuestions} questions evaluated · Evidence: {domain.evidenceStrength}
                  </div>
                </div>
                {getStatusBadge(domain.status)}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Accuracy</span>
                  <span className="font-mono font-semibold tabular-nums">{domain.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      domain.accuracy >= 75
                        ? 'bg-emerald-500'
                        : domain.accuracy >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${domain.accuracy}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Gaps & Strengths Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Gaps */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Priority Skill Gaps</h3>
          </div>
          <p className="text-xs text-slate-500">
            Skills requiring immediate foundational review and prerequisite strengthening.
          </p>

          <div className="divide-y divide-slate-100">
            {report.priorityGaps.length > 0 ? (
              report.priorityGaps.map(skillId => {
                const skill = SKILLS_TAXONOMY.find(s => s.id === skillId);
                const mastery = report.skillMasteries[skillId];
                if (!skill) return null;
                return (
                  <div key={skillId} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{skill.title[language]}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {mastery ? `${mastery.accuracy}% accuracy (${mastery.attempts} attempts)` : 'Uncertain evidence'}
                      </div>
                    </div>
                    <span className="text-rose-600 font-medium shrink-0">Needs Attention</span>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-500 py-4 italic">
                No severe foundational skill gaps detected in this calibration.
              </div>
            )}
          </div>
        </div>

        {/* Confirmed Strengths */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <Award className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Demonstrated Strengths</h3>
          </div>
          <p className="text-xs text-slate-500">
            Skills where high conceptual accuracy and proficient-level mastery were shown.
          </p>

          <div className="divide-y divide-slate-100">
            {report.strengths.length > 0 ? (
              report.strengths.map(skillId => {
                const skill = SKILLS_TAXONOMY.find(s => s.id === skillId);
                const mastery = report.skillMasteries[skillId];
                if (!skill) return null;
                return (
                  <div key={skillId} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{skill.title[language]}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {mastery ? `${mastery.accuracy}% accuracy` : 'High confidence'}
                      </div>
                    </div>
                    <span className="text-emerald-600 font-medium shrink-0">Strong</span>
                  </div>
                );
              })
            ) : (
              <div className="text-xs text-slate-500 py-4 italic">
                Continue practicing higher-difficulty questions to prove strong mastery.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Next Actions */}
      <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Next Action</div>
          <h3 className="text-base font-bold text-white">Continue Your Personalized Prep</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            We generated an adaptive study plan arranged into Priority 1 (Gaps), Priority 2 (High-Value), and Priority 3 (Advanced Refinement).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateSkillMap}
            className="px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {t.navSkillMap}
          </button>
          <button
            onClick={onNavigateStudyPlan}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
          >
            {t.navStudyPlan}
          </button>
        </div>
      </div>

      {/* Educational Disclaimer */}
      <div className="text-[11px] text-slate-400 text-center py-2 max-w-2xl mx-auto">
        {t.diagnosticDisclaimer} {t.localDataDisclaimer}
      </div>
    </div>
  );
};
