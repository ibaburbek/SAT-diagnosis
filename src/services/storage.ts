import { AppStorageState, DiagnosticReport, DiagnosticSession, StudentAnswer, StudentProfile, StudyPlan } from '../types';

const STORAGE_KEY = 'apex_sat_math_state_v1';
const CURRENT_SCHEMA_VERSION = 1;

export const DEFAULT_STORAGE_STATE: AppStorageState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  profile: null,
  currentSession: null,
  pastSessions: [],
  latestReport: null,
  studyPlan: null,
  completedLessonIds: [],
  practiceHistory: [],
  activeGlossaryTermId: null,
};

export function loadAppState(): AppStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STORAGE_STATE;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.schemaVersion === CURRENT_SCHEMA_VERSION) {
      return {
        ...DEFAULT_STORAGE_STATE,
        ...parsed,
      };
    }
    // Schema mismatch or outdated; return safe fallback
    return DEFAULT_STORAGE_STATE;
  } catch (err) {
    console.warn('Failed to parse localStorage data for SAT Math app:', err);
    return DEFAULT_STORAGE_STATE;
  }
}

export function saveAppState(state: AppStorageState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function updateProfile(profile: StudentProfile): AppStorageState {
  const state = loadAppState();
  const newState: AppStorageState = { ...state, profile };
  saveAppState(newState);
  return newState;
}

export function saveDiagnosticSession(session: DiagnosticSession): AppStorageState {
  const state = loadAppState();
  const newState: AppStorageState = {
    ...state,
    currentSession: session,
  };
  saveAppState(newState);
  return newState;
}

export function saveCompletedSession(session: DiagnosticSession, report: DiagnosticReport, studyPlan: StudyPlan): AppStorageState {
  const state = loadAppState();
  const newState: AppStorageState = {
    ...state,
    currentSession: null,
    pastSessions: [session, ...state.pastSessions.slice(0, 9)],
    latestReport: report,
    studyPlan: studyPlan,
  };
  saveAppState(newState);
  return newState;
}

export function savePracticeAnswer(answer: StudentAnswer): AppStorageState {
  const state = loadAppState();
  const newState: AppStorageState = {
    ...state,
    practiceHistory: [answer, ...state.practiceHistory.slice(0, 199)],
  };
  saveAppState(newState);
  return newState;
}

export function toggleLessonCompleted(lessonId: string): AppStorageState {
  const state = loadAppState();
  const exists = state.completedLessonIds.includes(lessonId);
  const completedLessonIds = exists
    ? state.completedLessonIds.filter(id => id !== lessonId)
    : [...state.completedLessonIds, lessonId];
  const newState = { ...state, completedLessonIds };
  saveAppState(newState);
  return newState;
}

export function toggleStudyPlanItem(itemId: string): AppStorageState {
  const state = loadAppState();
  if (!state.studyPlan) return state;
  const updatedItems = state.studyPlan.items.map(item =>
    item.id === itemId ? { ...item, completed: !item.completed } : item
  );
  const newState: AppStorageState = {
    ...state,
    studyPlan: {
      ...state.studyPlan,
      items: updatedItems,
    },
  };
  saveAppState(newState);
  return newState;
}

export function resetAllData(): AppStorageState {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_STORAGE_STATE;
}

export function exportDataAsJson(): string {
  const state = loadAppState();
  return JSON.stringify(state, null, 2);
}

export function importDataFromJson(jsonString: string): { success: boolean; state?: AppStorageState; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON file format.' };
    }
    const validatedState: AppStorageState = {
      ...DEFAULT_STORAGE_STATE,
      ...parsed,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    };
    saveAppState(validatedState);
    return { success: true, state: validatedState };
  } catch (err) {
    return { success: false, error: 'File contains malformed JSON.' };
  }
}

/**
 * Seeding presets for teachers to evaluate different student profiles and mastery journeys
 */
export function seedDemoData(preset: 'struggling_algebra' | 'intermediate_balanced' | 'high_achiever'): AppStorageState {
  const now = Date.now();
  const sampleAnswers: Record<string, StudentAnswer> = {};

  if (preset === 'struggling_algebra') {
    // Fails algebra & basic formulas, good at geometry angles
    sampleAnswers['q_alg_01'] = {
      questionId: 'q_alg_01',
      submittedAnswer: 'A',
      isCorrect: false,
      skillId: 'alg_linear_eq',
      difficulty: 'foundation',
      format: 'multiple_choice',
      translationUsed: true,
      errorCategory: 'algebraic_manipulation',
      durationSec: 42,
      timestamp: now - 3600000,
    };
    sampleAnswers['q_alg_02'] = {
      questionId: 'q_alg_02',
      submittedAnswer: 'A',
      isCorrect: false,
      skillId: 'alg_linear_func',
      difficulty: 'foundation',
      format: 'multiple_choice',
      translationUsed: true,
      errorCategory: 'incorrect_formula',
      durationSec: 50,
      timestamp: now - 3500000,
    };
    sampleAnswers['q_alg_04'] = {
      questionId: 'q_alg_04',
      submittedAnswer: 'B',
      isCorrect: false,
      skillId: 'alg_inequalities',
      difficulty: 'developing',
      format: 'multiple_choice',
      translationUsed: false,
      errorCategory: 'vocabulary',
      durationSec: 65,
      timestamp: now - 3400000,
    };
    sampleAnswers['q_adv_01'] = {
      questionId: 'q_adv_01',
      submittedAnswer: 'B',
      isCorrect: true,
      skillId: 'adv_quadratics',
      difficulty: 'foundation',
      format: 'multiple_choice',
      translationUsed: true,
      durationSec: 38,
      timestamp: now - 3300000,
    };
    sampleAnswers['q_ps_01'] = {
      questionId: 'q_ps_01',
      submittedAnswer: '68',
      isCorrect: true,
      skillId: 'ps_percentages',
      difficulty: 'foundation',
      format: 'grid_in',
      translationUsed: false,
      durationSec: 30,
      timestamp: now - 3200000,
    };
    sampleAnswers['q_geo_01'] = {
      questionId: 'q_geo_01',
      submittedAnswer: '65',
      isCorrect: true,
      skillId: 'geo_lines_triangles',
      difficulty: 'foundation',
      format: 'grid_in',
      translationUsed: false,
      durationSec: 25,
      timestamp: now - 3100000,
    };
    sampleAnswers['q_geo_02'] = {
      questionId: 'q_geo_02',
      submittedAnswer: '10',
      isCorrect: true,
      skillId: 'geo_trig_right_tri',
      difficulty: 'foundation',
      format: 'grid_in',
      translationUsed: false,
      durationSec: 28,
      timestamp: now - 3000000,
    };
  } else if (preset === 'high_achiever') {
    // Solves almost all foundation, developing, and proficient correctly
    const correctIds = ['q_alg_01', 'q_alg_02', 'q_alg_03', 'q_alg_05', 'q_alg_06', 'q_adv_01', 'q_adv_02', 'q_adv_03', 'q_adv_04', 'q_adv_05', 'q_ps_01', 'q_ps_02', 'q_ps_03', 'q_ps_04', 'q_ps_05', 'q_geo_01', 'q_geo_02', 'q_geo_03', 'q_geo_04', 'q_geo_05'];
    correctIds.forEach((qid, idx) => {
      sampleAnswers[qid] = {
        questionId: qid,
        submittedAnswer: 'CORRECT',
        isCorrect: true,
        skillId: qid.includes('alg') ? 'alg_linear_eq' : qid.includes('adv') ? 'adv_quadratics' : qid.includes('ps') ? 'ps_percentages' : 'geo_lines_triangles',
        difficulty: idx % 2 === 0 ? 'proficient' : 'developing',
        format: 'multiple_choice',
        translationUsed: false,
        durationSec: 32,
        timestamp: now - (correctIds.length - idx) * 60000,
      };
    });
  } else {
    // Intermediate balanced
    const mixed = [
      { qid: 'q_alg_01', ok: true },
      { qid: 'q_alg_02', ok: true },
      { qid: 'q_alg_04', ok: false, err: 'vocabulary' as const },
      { qid: 'q_alg_05', ok: true },
      { qid: 'q_adv_01', ok: true },
      { qid: 'q_adv_03', ok: true },
      { qid: 'q_adv_06', ok: false, err: 'algebraic_manipulation' as const },
      { qid: 'q_ps_01', ok: true },
      { qid: 'q_ps_03', ok: false, err: 'arithmetic' as const },
      { qid: 'q_geo_01', ok: true },
      { qid: 'q_geo_03', ok: true },
      { qid: 'q_geo_05', ok: false, err: 'incorrect_formula' as const },
    ];
    mixed.forEach(({ qid, ok, err }, idx) => {
      sampleAnswers[qid] = {
        questionId: qid,
        submittedAnswer: ok ? 'CORRECT' : 'WRONG',
        isCorrect: ok,
        skillId: qid.includes('alg') ? 'alg_linear_eq' : qid.includes('adv') ? 'adv_quadratics' : qid.includes('ps') ? 'ps_percentages' : 'geo_lines_triangles',
        difficulty: 'developing',
        format: 'multiple_choice',
        translationUsed: idx % 3 === 0,
        errorCategory: err,
        durationSec: 45,
        timestamp: now - (mixed.length - idx) * 60000,
      };
    });
  }

  const demoProfile: StudentProfile = {
    name: preset === 'struggling_algebra' ? 'Aruzhan (Almaty)' : preset === 'high_achiever' ? 'Budi (Jakarta)' : 'Dmitry (Tashkent)',
    preferredLanguage: preset === 'struggling_algebra' ? 'kk' : preset === 'high_achiever' ? 'id' : 'ru',
    currentScore: preset === 'struggling_algebra' ? 510 : preset === 'high_achiever' ? 710 : 610,
    targetScore: preset === 'struggling_algebra' ? 680 : preset === 'high_achiever' ? 780 : 720,
    examDate: '2026-12-05',
    weeklyHours: 6,
    priorPrep: preset === 'high_achiever' ? 'experienced' : 'some',
    diagnosticMode: 'math_with_translation',
    createdAt: now - 86400000,
  };

  const newState: AppStorageState = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    profile: demoProfile,
    currentSession: null,
    pastSessions: [],
    latestReport: null,
    studyPlan: null,
    completedLessonIds: preset === 'high_achiever' ? ['lesson_linear_func', 'lesson_quadratics'] : [],
    practiceHistory: Object.values(sampleAnswers),
    activeGlossaryTermId: null,
  };

  saveAppState(newState);
  return newState;
}
