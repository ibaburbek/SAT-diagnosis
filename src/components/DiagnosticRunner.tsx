import React, { useState, useEffect } from 'react';
import { DiagnosticSession, Question, StudentAnswer, SupportedLanguage } from '../types';
import { getNextAdaptiveQuestion, inferErrorCategory, validateAnswer } from '../services/adaptiveEngine';
import { HighlightText } from './HighlightText';
import { TRANSLATIONS } from '../i18n/translations';
import { BookOpen, Pause, Globe, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  session: DiagnosticSession;
  language: SupportedLanguage;
  onAnswerSubmitted: (session: DiagnosticSession, answer: StudentAnswer) => void;
  onPauseSession: (session: DiagnosticSession) => void;
  onFinishSession: (session: DiagnosticSession) => void;
  onOpenGlossary: (termId?: string) => void;
}

export const DiagnosticRunner: React.FC<Props> = ({
  session,
  language,
  onAnswerSubmitted,
  onPauseSession,
  onFinishSession,
  onOpenGlossary,
}) => {
  const t = TRANSLATIONS[language];
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [gridInInput, setGridInInput] = useState<string>('');
  const [useTranslation, setUseTranslation] = useState<boolean>(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Load next question whenever session answers or question index changes
  useEffect(() => {
    const nextQ = getNextAdaptiveQuestion(session);
    setCurrentQuestion(nextQ);
    setSelectedChoice('');
    setGridInInput('');
    setUseTranslation(false);
    setQuestionStartTime(Date.now());
  }, [session.currentQuestionIndex, Object.keys(session.answers).length]);

  if (!currentQuestion) {
    // Diagnostic completed or question queue finished
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Diagnostic Assessment Complete</h2>
        <p className="text-sm text-slate-600 mb-6">
          You have completed all calibration stages across the 4 SAT Math domains. Ready to generate your diagnostic mastery report and personalized study plan.
        </p>
        <button
          onClick={() => onFinishSession(session)}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
        >
          {t.viewReport}
        </button>
      </div>
    );
  }

  const answeredCount = Object.keys(session.answers).length;
  const currentQNum = answeredCount + 1;
  const targetTotal = session.targetQuestionCount;
  const progressPercent = Math.min(100, Math.round((answeredCount / targetTotal) * 100));

  // Question text & choices in active translation if toggled
  const translatedContent = currentQuestion.translations?.[language];
  const displayQuestionText = (useTranslation && translatedContent?.questionText)
    ? translatedContent.questionText
    : currentQuestion.questionText;

  const displayChoices = (useTranslation && translatedContent?.choices)
    ? translatedContent.choices
    : currentQuestion.choices;

  const isAnswerProvided = currentQuestion.format === 'multiple_choice'
    ? Boolean(selectedChoice)
    : Boolean(gridInInput.trim());

  const handleSubmit = () => {
    if (!isAnswerProvided) return;

    const submittedVal = currentQuestion.format === 'multiple_choice' ? selectedChoice : gridInInput;
    const { isCorrect } = validateAnswer(currentQuestion, submittedVal);
    const durationSec = Math.max(5, Math.round((Date.now() - questionStartTime) / 1000));
    const errorCat = !isCorrect ? inferErrorCategory(currentQuestion, submittedVal, useTranslation) : undefined;

    const studentAns: StudentAnswer = {
      questionId: currentQuestion.id,
      submittedAnswer: submittedVal,
      isCorrect,
      skillId: currentQuestion.primarySkillId,
      difficulty: currentQuestion.difficulty,
      format: currentQuestion.format,
      translationUsed: useTranslation,
      errorCategory: errorCat,
      durationSec,
      timestamp: Date.now(),
    };

    const updatedAnswers = {
      ...session.answers,
      [currentQuestion.id]: studentAns,
    };

    const updatedSession: DiagnosticSession = {
      ...session,
      currentQuestionIndex: session.currentQuestionIndex + 1,
      answers: updatedAnswers,
    };

    // If reached target, or early finish
    if (Object.keys(updatedAnswers).length >= targetTotal) {
      updatedSession.isCompleted = true;
    }

    onAnswerSubmitted(updatedSession, studentAns);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Top Bar / Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-900">
              {t.questionNumber} {currentQNum} of {targetTotal}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-medium text-slate-500 capitalize">
              {currentQuestion.domain.replace('_', ' ')}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 capitalize">
              Level: <strong className="text-indigo-600">{currentQuestion.difficulty}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenGlossary()}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-md transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.viewGlossary}</span>
            </button>
            <button
              onClick={() => onPauseSession(session)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-md transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>{t.pauseTest}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Translation Banner / Switch (if not in english only mode) */}
        {session.mode === 'math_with_translation' && language !== 'en' && (
          <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Translation Support ({language.toUpperCase()})</span>
            </div>
            <button
              onClick={() => setUseTranslation(!useTranslation)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                useTranslation
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {useTranslation ? 'Show Original English' : 'Show Translated Text'}
            </button>
          </div>
        )}

        {/* Question Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-base sm:text-lg text-slate-900 font-medium leading-relaxed whitespace-pre-line">
            <HighlightText
              text={displayQuestionText}
              language={language}
              onOpenGlossaryTerm={termId => onOpenGlossary(termId)}
            />
          </div>

          {/* Answer Controls */}
          {currentQuestion.format === 'multiple_choice' && displayChoices ? (
            <div className="space-y-3 pt-2">
              {displayChoices.map(choice => {
                const isSelected = selectedChoice === choice.id;
                return (
                  <button
                    key={choice.id}
                    onClick={() => setSelectedChoice(choice.id)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800 hover:bg-slate-50/60'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {choice.id}
                    </span>
                    <span className="text-sm pt-0.5">{choice.text}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Student-Produced Response (Grid-In)
              </label>
              <div className="max-w-xs">
                <input
                  type="text"
                  value={gridInInput}
                  onChange={e => setGridInInput(e.target.value)}
                  placeholder={t.enterAnswerPlaceholder}
                  className="w-full px-4 py-2.5 text-base font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="text-[11px] text-slate-500">
                You may enter an integer, decimal (e.g. 0.75), or fraction (e.g. 3/4).
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            {t.exitTest}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isAnswerProvided}
            className={`px-6 py-2.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shadow-xs ${
              isAnswerProvided
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{currentQNum >= targetTotal ? t.finishTest : t.submitAnswer}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Early Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <ShieldAlert className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900">Pause or Finish Early?</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have completed {answeredCount} questions so far. You can save your progress and return later, or conclude now to receive a provisional diagnostic report.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Continue Test
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onPauseSession(session);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Save & Exit
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onFinishSession(session);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Generate Report Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
