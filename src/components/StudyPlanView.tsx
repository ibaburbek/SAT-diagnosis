import React, { useState } from 'react';
import { StudyPlan, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CheckCircle2, Circle, Clock, Flame, BookOpen, Target, Calendar, ChevronRight } from 'lucide-react';

interface Props {
  plan: StudyPlan | null;
  language: SupportedLanguage;
  onToggleItem: (itemId: string) => void;
  onStartLesson: (skillId: string) => void;
  onStartPractice: (skillId: string) => void;
  onStartDiagnostic: () => void;
}

export const StudyPlanView: React.FC<Props> = ({
  plan,
  language,
  onToggleItem,
  onStartLesson,
  onStartPractice,
  onStartDiagnostic,
}) => {
  const t = TRANSLATIONS[language];
  const [priorityFilter, setPriorityFilter] = useState<'all' | 1 | 2 | 3>('all');

  if (!plan || plan.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
          <Target className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Active Study Plan Yet</h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Take the 20-30 minute adaptive diagnostic test first to identify your specific gaps and generate an ordered roadmap.
        </p>
        <button
          onClick={onStartDiagnostic}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
        >
          {t.startDiagnostic}
        </button>
      </div>
    );
  }

  const completedCount = plan.items.filter(i => i.completed).length;
  const totalCount = plan.items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = plan.items.filter(
    item => priorityFilter === 'all' || item.priority === priorityFilter
  );

  const getPriorityLabel = (p: 1 | 2 | 3) => {
    switch (p) {
      case 1:
        return <span className="text-rose-700 font-semibold text-xs">Priority 1: Foundational Gap</span>;
      case 2:
        return <span className="text-amber-700 font-semibold text-xs">Priority 2: High-Value Growth</span>;
      case 3:
        return <span className="text-indigo-700 font-semibold text-xs">Priority 3: Advanced Refinement</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Plan Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs text-slate-500 mb-1">Personalized Digital SAT Math Plan</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Your Customized Curriculum
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
            {plan.targetScore && (
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <div className="text-[10px] text-slate-400">TARGET</div>
                <div className="font-bold text-indigo-600 text-sm">{plan.targetScore}</div>
              </div>
            )}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <div className="text-[10px] text-slate-400">WEEKLY PACE</div>
              <div className="font-bold text-slate-900 text-sm">{plan.weeklyHours} hrs</div>
            </div>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700">Curriculum Completion</span>
            <span className="font-mono text-slate-500">{completedCount} of {totalCount} completed ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Priority Segmented Filter */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setPriorityFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            priorityFilter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Items ({plan.items.length})
        </button>
        <button
          onClick={() => setPriorityFilter(1)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            priorityFilter === 1
              ? 'bg-white text-rose-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Priority 1 ({plan.items.filter(i => i.priority === 1).length})
        </button>
        <button
          onClick={() => setPriorityFilter(2)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            priorityFilter === 2
              ? 'bg-white text-amber-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Priority 2 ({plan.items.filter(i => i.priority === 2).length})
        </button>
        <button
          onClick={() => setPriorityFilter(3)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            priorityFilter === 3
              ? 'bg-white text-indigo-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Priority 3 ({plan.items.filter(i => i.priority === 3).length})
        </button>
      </div>

      {/* Item List */}
      <div className="space-y-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4 ${
              item.completed ? 'border-slate-200 bg-slate-50/50 opacity-80' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => onToggleItem(item.id)}
                className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {getPriorityLabel(item.priority)}
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500 font-medium">{item.topic}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>~{item.estimatedMinutes} min</span>
                  </span>
                </div>

                <h3
                  className={`text-base font-bold ${
                    item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {item.learningObjective[language] || item.learningObjective.en}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  {item.whyNeeded[language] || item.whyNeeded.en}
                </p>

                {item.prerequisites.length > 0 && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold">Prerequisites:</span> {item.prerequisites.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <button
                onClick={() => onStartLesson(item.skillId)}
                className="w-full sm:w-auto px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.viewLesson}</span>
              </button>
              <button
                onClick={() => onStartPractice(item.skillId)}
                className="w-full sm:w-auto px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Target className="w-3.5 h-3.5" />
                <span>{t.practiceSkill}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
