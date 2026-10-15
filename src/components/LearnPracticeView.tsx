import React, { useState } from 'react';
import { LessonContent, Question, StudentAnswer, SupportedLanguage } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import { LinearVisualizer } from './widgets/LinearVisualizer';
import { QuadraticVisualizer } from './widgets/QuadraticVisualizer';
import { RatioVisualizer } from './widgets/RatioVisualizer';
import { CircleVisualizer } from './widgets/CircleVisualizer';
import { HighlightText } from './HighlightText';
import { validateAnswer } from '../services/adaptiveEngine';
import { TRANSLATIONS } from '../i18n/translations';
import { BookOpen, CheckCircle, HelpCircle, AlertOctagon, Lightbulb, ChevronRight, Check, X } from 'lucide-react';

interface Props {
  language: SupportedLanguage;
  initialSkillId?: string | null;
  onAnswerLogged: (answer: StudentAnswer) => void;
  onOpenGlossary: (termId?: string) => void;
}

export const LearnPracticeView: React.FC<Props> = ({
  language,
  initialSkillId,
  onAnswerLogged,
  onOpenGlossary,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    initialSkillId ? (LESSONS_DATA.find(l => l.skillId === initialSkillId)?.id || LESSONS_DATA[0].id) : LESSONS_DATA[0].id
  );

  const activeLesson: LessonContent =
    LESSONS_DATA.find(l => l.id === selectedLessonId) || LESSONS_DATA[0];

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});

  const handleSelectChoice = (questionId: string, choiceId: string) => {
    if (checkedQuestions[questionId]) return;
    setPracticeAnswers(prev => ({ ...prev, [questionId]: choiceId }));
  };

  const handleGridInChange = (questionId: string, val: string) => {
    if (checkedQuestions[questionId]) return;
    setPracticeAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleCheckAnswer = (q: Question) => {
    const studentAnsVal = practiceAnswers[q.id];
    if (!studentAnsVal) return;

    setCheckedQuestions(prev => ({ ...prev, [q.id]: true }));
    const { isCorrect } = validateAnswer(q, studentAnsVal);

    const record: StudentAnswer = {
      questionId: q.id,
      submittedAnswer: studentAnsVal,
      isCorrect,
      skillId: q.primarySkillId,
      difficulty: q.difficulty,
      format: q.format,
      translationUsed: false,
      durationSec: 45,
      timestamp: Date.now(),
    };
    onAnswerLogged(record);
  };

  const handleShowNextHint = (qId: string, maxHints: number) => {
    setRevealedHints(prev => {
      const current = prev[qId] || 0;
      return { ...prev, [qId]: Math.min(maxHints, current + 1) };
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          SAT Math Topic Lessons & Interactive Practice
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Deep-dive into essential concepts, manipulate live visual mathematical models, and practice with immediate step-by-step solutions.
        </p>
      </div>

      {/* Lesson Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {LESSONS_DATA.map(lesson => {
          const isSelected = activeLesson.id === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {lesson.title[language]}
            </button>
          );
        })}
      </div>

      {/* Active Lesson Header & Rules */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Lesson Module
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {activeLesson.title[language]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
            {activeLesson.summary[language]}
          </p>
        </div>

        {/* Interactive Model Embed */}
        <div className="pt-2">
          {activeLesson.interactiveType === 'linear' && (
            <LinearVisualizer language={language} />
          )}
          {activeLesson.interactiveType === 'quadratic' && (
            <QuadraticVisualizer language={language} />
          )}
          {activeLesson.interactiveType === 'ratio' && (
            <RatioVisualizer language={language} />
          )}
          {activeLesson.interactiveType === 'circle' && (
            <CircleVisualizer language={language} />
          )}
        </div>

        {/* Core Rules Grid */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.keyFormulas}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLesson.keyRules.map((ruleItem, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-mono text-xs font-bold text-indigo-900">{ruleItem.rule}</div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {ruleItem.explanation[language]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAT Traps Callout */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" />
            <span>Common Digital SAT Traps & Misconceptions</span>
          </div>
          <div className="space-y-2">
            {activeLesson.commonSATTraps.map((trapItem, idx) => (
              <div key={idx} className="p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-xs space-y-1">
                <div className="font-bold text-rose-950">Trap: {trapItem.trap}</div>
                <div className="text-rose-900/90 leading-relaxed">
                  <strong>The Fix:</strong> {trapItem.fix[language]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Check Questions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Concept Mastery Checks ({activeLesson.checkQuestions.length} Questions)
            </h3>
            <p className="text-xs text-slate-500">
              Test your understanding now. Instant step-by-step solutions and progressive hints are available.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {activeLesson.checkQuestions.map((question, qIdx) => {
            const isChecked = Boolean(checkedQuestions[question.id]);
            const currentAnswer = practiceAnswers[question.id] || '';
            const { isCorrect } = validateAnswer(question, currentAnswer);
            const hintsCount = revealedHints[question.id] || 0;

            const translatedQ = question.translations?.[language];
            const qText = (language !== 'en' && translatedQ?.questionText) || question.questionText;
            const choices = (language !== 'en' && translatedQ?.choices) || question.choices;
            const workedSol = (language !== 'en' && translatedQ?.workedSolution) || question.workedSolution;

            return (
              <div
                key={question.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Practice Item {qIdx + 1}</span>
                    <span>·</span>
                    <span className="capitalize">{question.difficulty}</span>
                    <span>·</span>
                    <span>{question.format === 'multiple_choice' ? 'Multiple Choice' : 'Grid-In'}</span>
                  </div>

                  {isChecked && (
                    <div className="flex items-center gap-1 font-semibold">
                      {isCorrect ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <X className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                  <HighlightText
                    text={qText}
                    language={language}
                    onOpenGlossaryTerm={termId => onOpenGlossary(termId)}
                  />
                </div>

                {/* Answer Options */}
                {question.format === 'multiple_choice' && choices ? (
                  <div className="space-y-2.5">
                    {choices.map(choice => {
                      const isSelected = currentAnswer === choice.id;
                      let choiceStyles = 'border-slate-200 bg-white hover:bg-slate-50';

                      if (isChecked) {
                        if (choice.id === question.correctAnswer) {
                          choiceStyles = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold';
                        } else if (isSelected && !isCorrect) {
                          choiceStyles = 'border-rose-500 bg-rose-50/70 text-rose-950';
                        }
                      } else if (isSelected) {
                        choiceStyles = 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold ring-1 ring-indigo-600';
                      }

                      return (
                        <button
                          key={choice.id}
                          disabled={isChecked}
                          onClick={() => handleSelectChoice(question.id, choice.id)}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-colors text-xs sm:text-sm ${choiceStyles} ${
                            isChecked ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {choice.id}
                          </span>
                          <span className="pt-0.5">{choice.text}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="max-w-xs space-y-2">
                    <input
                      type="text"
                      disabled={isChecked}
                      value={currentAnswer}
                      onChange={e => handleGridInChange(question.id, e.target.value)}
                      placeholder={t.enterAnswerPlaceholder}
                      className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {isChecked && (
                      <div className="text-xs font-mono text-slate-600">
                        Accepted Answer: <strong className="text-emerald-700">{question.correctAnswer}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Hints and Check Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {question.hints && question.hints.length > 0 && (
                      <button
                        onClick={() => handleShowNextHint(question.id, question.hints.length)}
                        className="px-3 py-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>
                          {hintsCount < question.hints.length
                            ? `Show Hint (${hintsCount}/${question.hints.length})`
                            : 'All Hints Shown'}
                        </span>
                      </button>
                    )}
                  </div>

                  {!isChecked ? (
                    <button
                      onClick={() => handleCheckAnswer(question)}
                      disabled={!currentAnswer}
                      className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors ${
                        currentAnswer
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Check Answer
                    </button>
                  ) : null}
                </div>

                {/* Revealed Hints */}
                {hintsCount > 0 && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 text-xs text-amber-900">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <Lightbulb className="w-4 h-4" />
                      <span>Progressive Hints</span>
                    </div>
                    {question.hints.slice(0, hintsCount).map((hint, hIdx) => (
                      <div key={hIdx} className="pl-2 border-l-2 border-amber-400">
                        <strong>Hint {hIdx + 1}:</strong> {hint}
                      </div>
                    ))}
                  </div>
                )}

                {/* Worked Solution (Revealed after check) */}
                {isChecked && (
                  <div className="p-5 bg-slate-900 text-slate-100 rounded-xl text-xs space-y-3 border border-slate-800">
                    <div className="font-bold text-sm text-indigo-300">
                      Step-by-Step Worked Solution
                    </div>
                    <div className="space-y-1.5 text-slate-300 leading-relaxed font-mono">
                      {workedSol.map((step, sIdx) => (
                        <div key={sIdx}>{step}</div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      <strong className="text-slate-200">Core SAT Concept:</strong> {question.underlyingConcept}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
