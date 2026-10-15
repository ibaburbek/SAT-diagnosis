import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { GlossaryTerm, SupportedLanguage } from '../types';
import { BookOpen, Search, Sparkles, ChevronRight } from 'lucide-react';

interface Props {
  language: SupportedLanguage;
}

export const VocabularyView: React.FC<Props> = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTermId, setSelectedTermId] = useState<string>(GLOSSARY_TERMS[0].id);
  const [flashcardMode, setFlashcardMode] = useState<boolean>(false);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const filtered = GLOSSARY_TERMS.filter(term => {
    const q = searchTerm.toLowerCase();
    return (
      term.englishTerm.toLowerCase().includes(q) ||
      (term.translations[language] || '').toLowerCase().includes(q) ||
      term.simpleEnglishDef.toLowerCase().includes(q)
    );
  });

  const activeTerm: GlossaryTerm | undefined =
    GLOSSARY_TERMS.find(t => t.id === selectedTermId) || filtered[0] || GLOSSARY_TERMS[0];

  const currentFlashcard = GLOSSARY_TERMS[cardIndex % GLOSSARY_TERMS.length];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Digital SAT Math Phrasing & Glossary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Carefully curated mathematical vocabulary with context-specific translations in Kazakh, Russian, and Indonesian.
          </p>
        </div>

        <button
          onClick={() => {
            setFlashcardMode(!flashcardMode);
            setIsFlipped(false);
          }}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
            flashcardMode
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          {flashcardMode ? 'View Full List' : 'Interactive Flashcards Mode'}
        </button>
      </div>

      {flashcardMode ? (
        <div className="p-8 flex flex-col items-center justify-center min-h-[460px] bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 mb-4">
            Card {((cardIndex % GLOSSARY_TERMS.length) + 1)} of {GLOSSARY_TERMS.length} · Tap card to flip
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-lg min-h-[280px] bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col justify-between cursor-pointer hover:border-indigo-400 transition-all text-center select-none"
          >
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400">
                {isFlipped ? 'Translation & SAT Meaning' : 'English SAT Term'}
              </span>
            </div>

            <div className="my-auto py-6">
              {!isFlipped ? (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                    {currentFlashcard.englishTerm}
                  </h2>
                  <p className="text-xs text-slate-500">What does this represent in SAT word problems?</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-lg font-bold text-indigo-600">
                    {currentFlashcard.translations[language]}
                  </div>
                  <p className="text-sm text-slate-800 font-medium">
                    {currentFlashcard.studentFriendlyExp[language]}
                  </p>
                  <div className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    Example: {currentFlashcard.exampleUsage}
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-indigo-600 font-medium">
              Click to flip
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => {
                setCardIndex(prev => (prev > 0 ? prev - 1 : GLOSSARY_TERMS.length - 1));
                setIsFlipped(false);
              }}
              className="px-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              Previous Card
            </button>
            <button
              onClick={() => {
                setCardIndex(prev => prev + 1);
                setIsFlipped(false);
              }}
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-xs cursor-pointer"
            >
              Next Card
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Left Glossary Index */}
          <div className="lg:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filter mathematical terms..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 max-h-[600px]">
              {filtered.map(term => {
                const isSelected = activeTerm?.id === term.id;
                return (
                  <button
                    key={term.id}
                    onClick={() => setSelectedTermId(term.id)}
                    className={`w-full text-left p-4 flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-950 font-semibold border-r-2 border-indigo-600'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{term.englishTerm}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {term.translations[language]}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Term Detail View */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {activeTerm && (
              <>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600">
                    Glossary Entry
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                    {activeTerm.englishTerm}
                  </h2>
                  <div className="text-sm font-semibold text-slate-600 mt-1">
                    Translation: {activeTerm.translations[language]}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Standard English Definition
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {activeTerm.simpleEnglishDef}
                  </p>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                  <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    Student-Friendly Explanation ({language.toUpperCase()})
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {activeTerm.studentFriendlyExp[language]}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Digital SAT Context Example
                  </div>
                  <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs border border-slate-800">
                    {activeTerm.exampleUsage}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
