import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { SupportedLanguage } from '../types';

interface Props {
  text: string;
  language: SupportedLanguage;
  onOpenGlossaryTerm?: (termId: string) => void;
  className?: string;
}

export const HighlightText: React.FC<Props> = ({ text, language, onOpenGlossaryTerm, className = '' }) => {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  // Match glossary terms in text (case-insensitive)
  // Sort terms by length descending to match compound terms first (e.g. "rate of change" before "rate")
  const sortedTerms = [...GLOSSARY_TERMS].sort((a, b) => b.englishTerm.length - a.englishTerm.length);

  // Build regex
  const regexPattern = new RegExp(
    `\\b(${sortedTerms.map(t => t.englishTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );

  const parts = text.split(regexPattern);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const matchingTerm = sortedTerms.find(
          t => t.englishTerm.toLowerCase() === part.toLowerCase()
        );

        if (!matchingTerm) {
          return <span key={index}>{part}</span>;
        }

        const isTooltipOpen = activeTooltipId === matchingTerm.id;

        return (
          <span
            key={index}
            className="relative inline-block"
            onMouseEnter={() => setActiveTooltipId(matchingTerm.id)}
            onMouseLeave={() => setActiveTooltipId(null)}
          >
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                if (onOpenGlossaryTerm) {
                  onOpenGlossaryTerm(matchingTerm.id);
                } else {
                  setActiveTooltipId(isTooltipOpen ? null : matchingTerm.id);
                }
              }}
              className="text-indigo-600 underline decoration-indigo-400 decoration-dotted underline-offset-4 font-medium hover:text-indigo-800 transition-colors inline"
            >
              {part}
            </button>

            {/* Hover Tooltip / Mobile Popover */}
            {isTooltipOpen && (
              <span
                role="tooltip"
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-900 text-slate-100 rounded-lg shadow-xl text-xs z-50 pointer-events-auto border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-1 border-b border-slate-700 mb-1.5">
                  <span className="font-bold text-sky-400">{matchingTerm.englishTerm}</span>
                  <span className="text-[10px] text-slate-400">
                    {matchingTerm.translations[language]}
                  </span>
                </div>
                <div className="text-[11px] text-slate-200 leading-tight">
                  {matchingTerm.studentFriendlyExp[language]}
                </div>
                <div className="mt-2 text-[10px] text-indigo-400 flex items-center justify-between">
                  <span>Click to view full glossary</span>
                </div>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};
