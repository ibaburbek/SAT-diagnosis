import React from 'react';
import { AppStorageState, SupportedLanguage } from '../types';
import { DOMAIN_INFO } from '../data/skillsTaxonomy';
import { TRANSLATIONS } from '../i18n/translations';
import { ArrowRight, BookOpen, Compass, Flame, Play, Target, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  state: AppStorageState;
  language: SupportedLanguage;
  onNavigateTab: (tab: string) => void;
  onStartDiagnostic: () => void;
  onResumeDiagnostic: () => void;
  onOpenGlossary: (termId?: string) => void;
  onSeedDemo: (preset: 'struggling_algebra' | 'intermediate_balanced' | 'high_achiever') => void;
}

export const DashboardView: React.FC<Props> = ({
  state,
  language,
  onNavigateTab,
  onStartDiagnostic,
  onResumeDiagnostic,
  onOpenGlossary,
  onSeedDemo,
}) => {
  const t = TRANSLATIONS[language];
  const profile = state.profile;
  const currentSession = state.currentSession;
  const latestReport = state.latestReport;
  const studyPlan = state.studyPlan;

  const totalAnswered = (latestReport?.totalQuestions || 0) + state.practiceHistory.length;
  const strongCount = latestReport ? latestReport.strengths.length : 0;
  const gapCount = latestReport ? latestReport.priorityGaps.length : 0;
  const planCompletedCount = studyPlan ? studyPlan.items.filter(i => i.completed).length : 0;
  const planTotalCount = studyPlan ? studyPlan.items.length : 0;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Student Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Digital SAT Math Readiness</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {profile?.name ? `Welcome back, ${profile.name}` : 'Welcome to ApexSAT Math'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Targeting <strong className="text-white font-mono">{profile?.targetScore || 720}+</strong> on the Digital SAT Math exam. Master foundational algebra, nonlinear models, and international English phrasing.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {currentSession && !currentSession.isCompleted ? (
              <button
                onClick={onResumeDiagnostic}
                className="px-6 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-900" />
                <span>
                  {t.continueDiagnostic} ({Object.keys(currentSession.answers).length}/{currentSession.targetQuestionCount})
                </span>
              </button>
            ) : latestReport ? (
              <button
                onClick={() => onNavigateTab('diagnostic')}
                className="px-6 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.viewReport}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onStartDiagnostic}
                className="px-6 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-900" />
                <span>{t.startDiagnostic} (20-30 min)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Teacher / Evaluator Quick Preset Notice if no data yet */}
      {!latestReport && (
        <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Teacher / Evaluator Tip:</strong> Want to test reports and personalized study plans without taking a full diagnostic test right now?
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSeedDemo('struggling_algebra')}
              className="px-2.5 py-1 bg-white border border-indigo-300 rounded text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100/50"
            >
              Seed Algebra Gaps
            </button>
            <button
              onClick={() => onSeedDemo('high_achiever')}
              className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[11px] font-semibold hover:bg-indigo-700"
            >
              Seed High Achiever
            </button>
          </div>
        </div>
      )}

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Total Items Answered</div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalAnswered}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across diagnostic & practice</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Confirmed Strengths</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            {strongCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">High accuracy demonstrated</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Priority Gaps</div>
          <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
            {gapCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requires targeted lessons</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Study Plan Progress</div>
          <div className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
            {planTotalCount > 0 ? `${Math.round((planCompletedCount / planTotalCount) * 100)}%` : '0%'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{planCompletedCount} of {planTotalCount} objectives done</div>
        </div>
      </div>

      {/* 4 SAT Math Domains Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Digital SAT Math Domains</h2>
            <p className="text-xs text-slate-500">Evaluated conceptual coverage and readiness across the 4 exam categories.</p>
          </div>
          <button
            onClick={() => onNavigateTab('skill_map')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            <span>{t.navSkillMap}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(DOMAIN_INFO) as Array<keyof typeof DOMAIN_INFO>).map(domainKey => {
            const info = DOMAIN_INFO[domainKey];
            const perf = latestReport?.domainPerformances[domainKey];

            return (
              <div
                key={domainKey}
                onClick={() => onNavigateTab('skill_map')}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold">{info.weight} Weight</span>
                    <span className="font-mono">{perf ? `${perf.accuracy}%` : 'Not tested'}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {info.title[language]}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {info.description[language]}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-indigo-600 font-medium">Explore Skills</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority 1 Actions / Up Next in Study Plan */}
      {studyPlan && studyPlan.items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Up Next in Your Study Plan</h2>
            <button
              onClick={() => onNavigateTab('study_plan')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
            >
              <span>View Full Plan ({studyPlan.items.length} items)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studyPlan.items.slice(0, 3).map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="text-xs font-semibold text-rose-700 mb-1">
                    Priority {item.priority} · {item.topic}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.learningObjective[language] || item.learningObjective.en}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.whyNeeded[language] || item.whyNeeded.en}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-mono text-slate-400">~{item.estimatedMinutes} min</span>
                  <button
                    onClick={() => onNavigateTab('learn')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                  >
                    Start Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Vocabulary Flashcards Callout */}
      <div className="p-6 bg-slate-100/70 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Digital SAT English Math Terminology</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">International Student Math Glossary</h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Don't let confusing English phrases like <em>"at least"</em>, <em>"rate of change"</em>, or <em>"no more than"</em> cost you points on exam day.
          </p>
        </div>

        <button
          onClick={() => onOpenGlossary()}
          className="px-5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors shrink-0"
        >
          Open Glossary & Flashcards
        </button>
      </div>
    </div>
  );
};
