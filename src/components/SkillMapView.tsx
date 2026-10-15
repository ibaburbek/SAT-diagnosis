import React, { useState } from 'react';
import { DomainId, MasteryStatus, SkillDefinition, SkillMastery, SupportedLanguage } from '../types';
import { DOMAIN_INFO, SKILLS_TAXONOMY } from '../data/skillsTaxonomy';
import { TRANSLATIONS } from '../i18n/translations';
import { ArrowRight, BookOpen, CheckCircle, HelpCircle, AlertCircle, ArrowUpRight, Target } from 'lucide-react';

interface Props {
  language: SupportedLanguage;
  skillMasteries: Record<string, SkillMastery>;
  onStartLesson: (skillId: string) => void;
  onStartPractice: (skillId: string) => void;
}

export const SkillMapView: React.FC<Props> = ({
  language,
  skillMasteries,
  onStartLesson,
  onStartPractice,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedDomain, setSelectedDomain] = useState<DomainId>('algebra');
  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    SKILLS_TAXONOMY.find(s => s.domain === 'algebra')?.id || SKILLS_TAXONOMY[0].id
  );

  const selectedSkill: SkillDefinition | undefined =
    SKILLS_TAXONOMY.find(s => s.id === selectedSkillId) || SKILLS_TAXONOMY[0];

  const currentMastery: SkillMastery | undefined = skillMasteries[selectedSkill.id];

  const getStatusIcon = (status?: MasteryStatus) => {
    switch (status) {
      case 'strong':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'developing':
        return <ArrowUpRight className="w-4 h-4 text-amber-600" />;
      case 'needs_attention':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusLabel = (status?: MasteryStatus) => {
    switch (status) {
      case 'strong':
        return <span className="text-emerald-700 font-semibold text-xs">Strong</span>;
      case 'developing':
        return <span className="text-amber-700 font-semibold text-xs">Developing</span>;
      case 'needs_attention':
        return <span className="text-rose-700 font-semibold text-xs">Needs Attention</span>;
      default:
        return <span className="text-slate-500 font-medium text-xs">Not Enough Evidence</span>;
    }
  };

  const domainSkills = SKILLS_TAXONOMY.filter(s => s.domain === selectedDomain);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          SAT Math Interactive Skill Map
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore conceptual prerequisites, evidence thresholds, and targeted training for all Digital SAT topics.
        </p>
      </div>

      {/* Domain Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {(Object.keys(DOMAIN_INFO) as DomainId[]).map(domainKey => {
          const info = DOMAIN_INFO[domainKey];
          const isSelected = selectedDomain === domainKey;
          return (
            <button
              key={domainKey}
              onClick={() => {
                setSelectedDomain(domainKey);
                const firstSkill = SKILLS_TAXONOMY.find(s => s.domain === domainKey);
                if (firstSkill) setSelectedSkillId(firstSkill.id);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{info.title[language]}</span>
              <span className="text-[10px] text-slate-400 ml-1.5 font-normal">({info.weight})</span>
            </button>
          );
        })}
      </div>

      {/* 2-Zone Layout: Left Skills Grid / Right Selected Skill Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Skills Explorer */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Skills in {DOMAIN_INFO[selectedDomain].title[language]}
          </div>

          <div className="space-y-2">
            {domainSkills.map(skill => {
              const mastery = skillMasteries[skill.id];
              const isSelected = selectedSkill.id === skill.id;
              return (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-indigo-600 bg-white ring-1 ring-indigo-600 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(mastery?.status)}
                      <span className="text-sm font-bold text-slate-900">
                        {skill.title[language]}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {skill.subtopic}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {getStatusLabel(mastery?.status)}
                    <div className="text-[10px] font-mono text-slate-400 mt-1">
                      {mastery ? `${mastery.accuracy}% (${mastery.attempts} att)` : '0 attempts'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs uppercase tracking-wider text-indigo-600 font-semibold">
                {selectedSkill.topic} · SAT Weight: {selectedSkill.satWeightPercent}%
              </span>
              {getStatusLabel(currentMastery?.status)}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3">
              {selectedSkill.title[language]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {selectedSkill.description[language]}
            </p>
          </div>

          {/* Evidence Metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <div className="text-slate-500 text-[11px]">Accuracy</div>
              <div className="font-mono text-base font-bold text-indigo-600 tabular-nums">
                {currentMastery?.accuracy || 0}%
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">Evaluated Items</div>
              <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                {currentMastery?.attempts || 0}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">Confidence</div>
              <div className="font-mono text-base font-bold capitalize text-slate-700">
                {currentMastery?.evidenceStrength || 'Low'}
              </div>
            </div>
          </div>

          {/* Key Formulas & Rules */}
          {selectedSkill.keyFormulas && selectedSkill.keyFormulas.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                {t.keyFormulas}
              </div>
              <div className="space-y-1.5">
                {selectedSkill.keyFormulas.map((formula, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono border border-slate-800"
                  >
                    {formula}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites Chain */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Conceptual Prerequisites
            </div>
            {selectedSkill.prerequisites.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSkill.prerequisites.map(prereqId => {
                  const prereqSkill = SKILLS_TAXONOMY.find(s => s.id === prereqId);
                  const prereqMastery = skillMasteries[prereqId];
                  return (
                    <button
                      key={prereqId}
                      onClick={() => {
                        if (prereqSkill) {
                          setSelectedDomain(prereqSkill.domain);
                          setSelectedSkillId(prereqSkill.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-xs text-slate-800 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {getStatusIcon(prereqMastery?.status)}
                      <span>{prereqSkill ? prereqSkill.title[language] : prereqId}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">
                Foundational starting skill — no prior prerequisites required.
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => onStartLesson(selectedSkill.id)}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>{t.viewLesson}</span>
            </button>

            <button
              onClick={() => onStartPractice(selectedSkill.id)}
              className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>{t.practiceSkill}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
