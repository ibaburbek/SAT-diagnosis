import React, { useState, useEffect } from 'react';
import { AppStorageState, DiagnosticSession, StudentAnswer, StudentProfile, SupportedLanguage } from './types';
import {
  loadAppState,
  saveAppState,
  saveDiagnosticSession,
  saveCompletedSession,
  savePracticeAnswer,
  toggleStudyPlanItem,
  updateProfile,
  seedDemoData,
} from './services/storage';
import { initializeDiagnosticSession } from './services/adaptiveEngine';
import { generateDiagnosticReport, generateStudyPlan } from './services/masteryEngine';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { DiagnosticRunner } from './components/DiagnosticRunner';
import { DiagnosticReportView } from './components/DiagnosticReportView';
import { SkillMapView } from './components/SkillMapView';
import { StudyPlanView } from './components/StudyPlanView';
import { LearnPracticeView } from './components/LearnPracticeView';
import { VocabularyView } from './components/VocabularyView';
import { SettingsView } from './components/SettingsView';
import { OnboardingModal } from './components/OnboardingModal';
import { GlossaryModal } from './components/GlossaryModal';

export default function App() {
  const [state, setState] = useState<AppStorageState>(loadAppState);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [selectedGlossaryTermId, setSelectedGlossaryTermId] = useState<string | null>(null);
  const [targetedSkillForLesson, setTargetedSkillForLesson] = useState<string | null>(null);

  // If user profile is not set, open onboarding modal on initial load
  useEffect(() => {
    if (!state.profile) {
      setIsOnboardingOpen(true);
    }
  }, [state.profile]);

  const currentLanguage: SupportedLanguage = state.profile?.preferredLanguage || 'en';

  const handleLanguageChange = (lang: SupportedLanguage) => {
    if (state.profile) {
      const updated = updateProfile({ ...state.profile, preferredLanguage: lang });
      setState(updated);
    } else {
      setState(prev => ({
        ...prev,
        profile: {
          preferredLanguage: lang,
          weeklyHours: 4,
          priorPrep: 'some',
          diagnosticMode: 'math_with_translation',
          createdAt: Date.now(),
        },
      }));
    }
  };

  const handleOnboardingComplete = (profile: StudentProfile) => {
    const updated = updateProfile(profile);
    setState(updated);
    setIsOnboardingOpen(false);
    // Start diagnostic right away
    handleStartDiagnostic();
  };

  const handleOnboardingSkip = () => {
    const guestProfile: StudentProfile = {
      name: 'Guest Student',
      preferredLanguage: currentLanguage,
      weeklyHours: 4,
      priorPrep: 'some',
      diagnosticMode: 'math_with_translation',
      createdAt: Date.now(),
    };
    const updated = updateProfile(guestProfile);
    setState(updated);
    setIsOnboardingOpen(false);
  };

  const handleStartDiagnostic = () => {
    const newSession = initializeDiagnosticSession(
      state.profile?.diagnosticMode || 'math_with_translation'
    );
    const updated = saveDiagnosticSession(newSession);
    setState(updated);
    setActiveTab('diagnostic');
  };

  const handleResumeDiagnostic = () => {
    setActiveTab('diagnostic');
  };

  const handleAnswerSubmitted = (updatedSession: DiagnosticSession, answer: StudentAnswer) => {
    if (updatedSession.isCompleted) {
      handleFinishSession(updatedSession);
    } else {
      const updated = saveDiagnosticSession(updatedSession);
      setState(updated);
    }
  };

  const handlePauseSession = (session: DiagnosticSession) => {
    const updated = saveDiagnosticSession(session);
    setState(updated);
    setActiveTab('dashboard');
  };

  const handleFinishSession = (session: DiagnosticSession) => {
    const report = generateDiagnosticReport(session, state.profile);
    const plan = generateStudyPlan(report, state.profile);
    const updated = saveCompletedSession(session, report, plan);
    setState(updated);
    setActiveTab('diagnostic'); // Shows report view
  };

  const handlePracticeAnswerLogged = (ans: StudentAnswer) => {
    const updated = savePracticeAnswer(ans);
    // If we have an existing latest report, refresh skill mastery
    if (updated.latestReport) {
      const existingAnswers = Object.values(updated.practiceHistory);
      const fakeSession: DiagnosticSession = {
        id: 'practice_refresh',
        startedAt: Date.now(),
        mode: 'math_with_translation',
        currentQuestionIndex: 0,
        targetQuestionCount: 16,
        questionIds: [],
        answers: updated.practiceHistory.reduce((acc, curr) => {
          acc[curr.questionId] = curr;
          return acc;
        }, {} as Record<string, StudentAnswer>),
        isCompleted: true,
        isProvisional: false,
        activeDomainOrder: ['algebra', 'advanced_math', 'problem_solving', 'geometry_trig'],
      };
      const refreshedReport = generateDiagnosticReport(fakeSession, updated.profile);
      const refreshedPlan = generateStudyPlan(refreshedReport, updated.profile);
      const withRefreshed = {
        ...updated,
        latestReport: refreshedReport,
        studyPlan: refreshedPlan,
      };
      saveAppState(withRefreshed);
      setState(withRefreshed);
      return;
    }
    setState(updated);
  };

  const handleTogglePlanItem = (itemId: string) => {
    const updated = toggleStudyPlanItem(itemId);
    setState(updated);
  };

  const handleOpenGlossary = (termId?: string) => {
    setSelectedGlossaryTermId(termId || null);
    setIsGlossaryOpen(true);
  };

  const handleStartLessonForSkill = (skillId: string) => {
    setTargetedSkillForLesson(skillId);
    setActiveTab('learn');
  };

  const handleStartPracticeForSkill = (skillId: string) => {
    setTargetedSkillForLesson(skillId);
    setActiveTab('learn');
  };

  const handleSeedDemoFromSettings = (preset: 'struggling_algebra' | 'intermediate_balanced' | 'high_achiever') => {
    const seeded = seedDemoData(preset);
    // Generate report & study plan based on seeded answers
    const fakeSession: DiagnosticSession = {
      id: 'demo_' + Date.now(),
      startedAt: Date.now() - 3600000,
      mode: 'math_with_translation',
      currentQuestionIndex: 12,
      targetQuestionCount: 16,
      questionIds: seeded.practiceHistory.map(a => a.questionId),
      answers: seeded.practiceHistory.reduce((acc, curr) => {
        acc[curr.questionId] = curr;
        return acc;
      }, {} as Record<string, StudentAnswer>),
      isCompleted: true,
      isProvisional: false,
      activeDomainOrder: ['algebra', 'advanced_math', 'problem_solving', 'geometry_trig'],
    };
    const report = generateDiagnosticReport(fakeSession, seeded.profile);
    const plan = generateStudyPlan(report, seeded.profile);
    const fullState: AppStorageState = {
      ...seeded,
      latestReport: report,
      studyPlan: plan,
    };
    saveAppState(fullState);
    setState(fullState);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={currentLanguage}
        onChangeLanguage={handleLanguageChange}
        hasActiveSession={Boolean(state.currentSession && !state.currentSession.isCompleted)}
        onPrimaryAction={() => {
          if (state.currentSession && !state.currentSession.isCompleted) {
            handleResumeDiagnostic();
          } else {
            handleStartDiagnostic();
          }
        }}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardView
            state={state}
            language={currentLanguage}
            onNavigateTab={setActiveTab}
            onStartDiagnostic={handleStartDiagnostic}
            onResumeDiagnostic={handleResumeDiagnostic}
            onOpenGlossary={handleOpenGlossary}
            onSeedDemo={handleSeedDemoFromSettings}
          />
        )}

        {activeTab === 'diagnostic' && (
          <>
            {state.currentSession && !state.currentSession.isCompleted ? (
              <DiagnosticRunner
                session={state.currentSession}
                language={currentLanguage}
                onAnswerSubmitted={handleAnswerSubmitted}
                onPauseSession={handlePauseSession}
                onFinishSession={handleFinishSession}
                onOpenGlossary={handleOpenGlossary}
              />
            ) : state.latestReport ? (
              <DiagnosticReportView
                report={state.latestReport}
                language={currentLanguage}
                onNavigateSkillMap={() => setActiveTab('skill_map')}
                onNavigateStudyPlan={() => setActiveTab('study_plan')}
                onStartNewDiagnostic={handleStartDiagnostic}
              />
            ) : (
              <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-xs space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Adaptive Diagnostic Assessment</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Start an adaptive 20-30 minute diagnostic across Algebra, Advanced Math, Problem-Solving, and Geometry. Calibrates dynamically with no rush.
                </p>
                <button
                  onClick={handleStartDiagnostic}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
                >
                  Start Diagnostic Now
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'skill_map' && (
          <SkillMapView
            language={currentLanguage}
            skillMasteries={state.latestReport?.skillMasteries || {}}
            onStartLesson={handleStartLessonForSkill}
            onStartPractice={handleStartPracticeForSkill}
          />
        )}

        {activeTab === 'study_plan' && (
          <StudyPlanView
            plan={state.studyPlan}
            language={currentLanguage}
            onToggleItem={handleTogglePlanItem}
            onStartLesson={handleStartLessonForSkill}
            onStartPractice={handleStartPracticeForSkill}
            onStartDiagnostic={handleStartDiagnostic}
          />
        )}

        {activeTab === 'learn' && (
          <LearnPracticeView
            language={currentLanguage}
            initialSkillId={targetedSkillForLesson}
            onAnswerLogged={handlePracticeAnswerLogged}
            onOpenGlossary={handleOpenGlossary}
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyView language={currentLanguage} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            language={currentLanguage}
            onChangeLanguage={handleLanguageChange}
            onStateReloaded={() => setState(loadAppState())}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ApexSAT Math · International Adaptive Diagnostic & Learning Platform</span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Browser-Local Storage</span>
            <span>·</span>
            <span>Digital SAT Math Preparation</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              Teacher Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
        currentLanguage={currentLanguage}
        onChangeLanguage={handleLanguageChange}
      />

      {/* Global Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        language={currentLanguage}
        initialTermId={selectedGlossaryTermId}
      />
    </div>
  );
}
