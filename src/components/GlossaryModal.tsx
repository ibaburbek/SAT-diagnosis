import React, { useState } from 'react';
import { GLOSSARY_TERMS } from '../data/glossary';
import { GlossaryTerm, SupportedLanguage } from '../types';
import { BookOpen, Search, X, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  initialTermId?: string | null;
}

export const GlossaryModal: React.FC<Props> = ({ isOpen, onClose, language, initialTermId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTermId, setSelectedTermId] = useState<string | null>(initialTermId || GLOSSARY_TERMS[0].id);
  const [studyCardIndex, setStudyCardIndex] = useState<number>(0);
  const [isFlashcardMode, setIsFlashcardMode] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredTerms = GLOSSARY_TERMS.filter(term => {
    const query = searchTerm.toLowerCase();
    const eng = term.englishTerm.toLowerCase();
    const translated = (term.translations[language] || '').toLowerCase();
    const def = term.simpleEnglishDef.toLowerCase();
    return eng.includes(query) || translated.includes(query) || def.includes(query);
  });

  const activeTerm: GlossaryTerm | undefined = 
    GLOSSARY_TERMS.find(t => t.id === selectedTermId) || filteredTerms[0] || GLOSSARY_TERMS[0];

  const currentFlashcard = GLOSSARY_TERMS[studyCardIndex % GLOSSARY_TERMS.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Digital SAT Math Glossary & Terminology</h3>
              <p className="text-xs text-slate-500">Multilingual mathematical phrasing for international students</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsFlashcardMode(!isFlashcardMode);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                isFlashcardMode
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {isFlashcardMode ? 'Browse Glossary' : 'Flashcards Mode'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {isFlashcardMode ? (
          <div className="p-8 flex flex-col items-center justify-center flex-1 min-h-[400px] bg-slate-50/50">
            <div className="text-xs text-slate-500 mb-4">
              Card {((studyCardIndex % GLOSSARY_TERMS.length) + 1)} of {GLOSSARY_TERMS.length} · Tap card to flip
            </div>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-lg min-h-[260px] bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col justify-between cursor-pointer hover:border-indigo-300 transition-all text-center select-none"
            >
              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400">
                  {isFlipped ? 'Answer / Translation' : 'English SAT Phrasing'}
                </span>
              </div>

              <div className="my-auto py-6">
                {!isFlipped ? (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentFlashcard.englishTerm}</h2>
                    <p className="text-sm text-slate-500">How is this defined and used in SAT word problems?</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-lg font-bold text-indigo-600">
                      {currentFlashcard.translations[language]}
                    </div>
                    <p className="text-sm text-slate-800 font-medium">
                      {currentFlashcard.studentFriendlyExp[language]}
                    </p>
                    <div className="text-xs font-mono text-slate-500 bg-slate-100 p-2 rounded">
                      Example: {currentFlashcard.exampleUsage}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-indigo-500 font-medium">
                Click anywhere to flip
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  setStudyCardIndex(prev => (prev > 0 ? prev - 1 : GLOSSARY_TERMS.length - 1));
                  setIsFlipped(false);
                }}
                className="px-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-700"
              >
                Previous Card
              </button>
              <button
                onClick={() => {
                  setStudyCardIndex(prev => prev + 1);
                  setIsFlipped(false);
                }}
                className="px-5 py-2 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
              >
                Next Card
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
            {/* Sidebar List */}
            <div className="md:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50/40">
              <div className="p-3 border-b border-slate-200">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search mathematical terms..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 divide-y divide-slate-100 max-h-[500px]">
                {filteredTerms.map(term => {
                  const isSelected = term.id === activeTerm?.id;
                  return (
                    <button
                      key={term.id}
                      onClick={() => setSelectedTermId(term.id)}
                      className={`w-full text-left p-3.5 flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/80 text-indigo-950 font-semibold border-r-2 border-indigo-600'
                          : 'hover:bg-slate-100/70 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-900">{term.englishTerm}</div>
                        <div className="text-[11px] text-slate-500">
                          {term.translations[language]}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Term Detail */}
            <div className="md:col-span-7 p-6 overflow-y-auto max-h-[550px] bg-white">
              {activeTerm ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600">
                        SAT Key Vocabulary
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{activeTerm.englishTerm}</h2>
                    <div className="text-sm font-semibold text-slate-600 mt-1">
                      {activeTerm.translations[language]}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Standard Definition (English)
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {activeTerm.simpleEnglishDef}
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100">
                    <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
                      Student Explanation ({language.toUpperCase()})
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {activeTerm.studentFriendlyExp[language]}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Digital SAT Context Example
                    </div>
                    <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono border border-slate-800">
                      {activeTerm.exampleUsage}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 text-sm">
                  No terms found matching your search.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: In diagnostic & lessons, terms with dotted underlines can be hovered or tapped for instant lookup.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
