/**
 * Core type definitions for ApexSAT Math Platform
 */

export type SupportedLanguage = 'en' | 'kk' | 'ru' | 'id';

export type DomainId = 
  | 'algebra' 
  | 'advanced_math' 
  | 'problem_solving' 
  | 'geometry_trig';

export type DifficultyLevel = 
  | 'foundation' 
  | 'developing' 
  | 'proficient' 
  | 'advanced';

export type ErrorCategory =
  | 'conceptual'
  | 'algebraic_manipulation'
  | 'arithmetic'
  | 'incorrect_formula'
  | 'graph_data_interpretation'
  | 'word_problem_comprehension'
  | 'vocabulary'
  | 'careless'
  | 'unknown';

export type MasteryStatus = 
  | 'strong' 
  | 'developing' 
  | 'needs_attention' 
  | 'not_enough_evidence';

export type QuestionFormat = 'multiple_choice' | 'grid_in';

export interface StudentProfile {
  name?: string;
  preferredLanguage: SupportedLanguage;
  currentScore?: number | null; // e.g. 520 or null for "I don't know"
  targetScore?: number | null;  // e.g. 700
  examDate?: string | null;     // YYYY-MM-DD or null
  weeklyHours: number;          // e.g. 4
  priorPrep: 'beginner' | 'some' | 'experienced';
  diagnosticMode: 'math_with_translation' | 'english_challenge';
  createdAt: number;
}

export interface QuestionChoice {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: string;
  domain: DomainId;
  topic: string;
  subtopic: string;
  primarySkillId: string;
  secondarySkillIds?: string[];
  difficulty: DifficultyLevel;
  format: QuestionFormat;
  questionText: string;
  choices?: QuestionChoice[]; // For multiple choice
  correctAnswer: string;      // 'A'/'B'/'C'/'D' or numerical string like '12', '3/4', '0.75'
  acceptableAnswers?: string[]; // E.g. ['0.75', '3/4', '.75']
  workedSolution: string[];   // Step by step
  underlyingConcept: string;
  distractorExplanations?: Record<string, string>; // Why A is wrong, etc.
  glossaryTerms: string[];    // Terms that can be highlighted
  hints: string[];            // Progressive hints
  estimatedSolvingTimeSec: number;
  translations?: Partial<Record<SupportedLanguage, {
    questionText: string;
    choices?: QuestionChoice[];
    workedSolution?: string[];
    underlyingConcept?: string;
    hints?: string[];
  }>>;
}

export interface SkillDefinition {
  id: string;
  domain: DomainId;
  topic: string;
  subtopic: string;
  title: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  prerequisites: string[]; // Skill IDs
  satWeightPercent: number; // Approx percentage in SAT
  keyFormulas?: string[];
}

export interface GlossaryTerm {
  id: string;
  englishTerm: string;
  translations: Record<SupportedLanguage, string>;
  simpleEnglishDef: string;
  studentFriendlyExp: Record<SupportedLanguage, string>;
  exampleUsage: string;
  skillIds: string[];
}

export interface StudentAnswer {
  questionId: string;
  submittedAnswer: string;
  isCorrect: boolean;
  skillId: string;
  difficulty: DifficultyLevel;
  format: QuestionFormat;
  translationUsed: boolean;
  errorCategory?: ErrorCategory;
  durationSec: number;
  timestamp: number;
}

export interface SkillMastery {
  skillId: string;
  attempts: number;
  correct: number;
  accuracy: number;
  difficultyDistribution: Record<DifficultyLevel, number>;
  errorPatterns: ErrorCategory[];
  evidenceStrength: 'low' | 'medium' | 'high';
  status: MasteryStatus;
  lastAssessedDate: string;
  recommendedNextAction: string;
}

export interface DiagnosticSession {
  id: string;
  startedAt: number;
  completedAt?: number;
  mode: 'math_with_translation' | 'english_challenge';
  currentQuestionIndex: number;
  targetQuestionCount: number;
  questionIds: string[];
  answers: Record<string, StudentAnswer>;
  isCompleted: boolean;
  isProvisional: boolean;
  activeDomainOrder: DomainId[];
}

export interface DomainPerformance {
  domainId: DomainId;
  domainName: Record<SupportedLanguage, string>;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  status: MasteryStatus;
  evidenceStrength: 'low' | 'medium' | 'high';
}

export interface DiagnosticReport {
  id: string;
  sessionId: string;
  generatedAt: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  completionStatus: 'full' | 'provisional';
  mode: 'math_with_translation' | 'english_challenge';
  translationUsageCount: number;
  domainPerformances: Record<DomainId, DomainPerformance>;
  skillMasteries: Record<string, SkillMastery>;
  strengths: string[];
  priorityGaps: string[];
  recommendedNextSteps: string[];
  selfReportedScore?: number | null;
}

export interface StudyPlanItem {
  id: string;
  skillId: string;
  topic: string;
  learningObjective: Record<SupportedLanguage, string>;
  whyNeeded: Record<SupportedLanguage, string>;
  currentStatus: MasteryStatus;
  prerequisites: string[];
  priority: 1 | 2 | 3; // 1: Foundational, 2: High-value, 3: Advanced
  estimatedMinutes: number;
  completed: boolean;
}

export interface StudyPlan {
  generatedAt: number;
  weeklyHours: number;
  targetScore?: number | null;
  examDate?: string | null;
  items: StudyPlanItem[];
}

export interface LessonContent {
  id: string;
  skillId: string;
  title: Record<SupportedLanguage, string>;
  summary: Record<SupportedLanguage, string>;
  keyRules: Array<{ rule: string; explanation: Record<SupportedLanguage, string> }>;
  commonSATTraps: Array<{ trap: string; fix: Record<SupportedLanguage, string> }>;
  interactiveType?: 'linear' | 'quadratic' | 'ratio' | 'circle';
  checkQuestions: Question[];
}

export interface AppStorageState {
  schemaVersion: number;
  profile: StudentProfile | null;
  currentSession: DiagnosticSession | null;
  pastSessions: DiagnosticSession[];
  latestReport: DiagnosticReport | null;
  studyPlan: StudyPlan | null;
  completedLessonIds: string[];
  practiceHistory: StudentAnswer[];
  activeGlossaryTermId?: string | null;
}
