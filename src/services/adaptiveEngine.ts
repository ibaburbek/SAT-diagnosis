import { DifficultyLevel, DiagnosticSession, DomainId, Question, StudentAnswer, ErrorCategory } from '../types';
import { QUESTION_BANK } from '../data/questionBank';
import { SKILLS_TAXONOMY } from '../data/skillsTaxonomy';

const DOMAIN_ROTATION: DomainId[] = ['algebra', 'advanced_math', 'problem_solving', 'geometry_trig'];
const DEFAULT_TARGET_QUESTION_COUNT = 16;

/**
 * Initializes a new adaptive diagnostic session
 */
export function initializeDiagnosticSession(mode: 'math_with_translation' | 'english_challenge'): DiagnosticSession {
  const sessionId = 'diag_' + Date.now();
  
  // Pick 4 calibration starter questions (one foundation/developing from each domain)
  const initialQuestionIds: string[] = [];
  for (const domain of DOMAIN_ROTATION) {
    const candidate = QUESTION_BANK.find(
      q => q.domain === domain && (q.difficulty === 'foundation' || q.difficulty === 'developing')
    );
    if (candidate) {
      initialQuestionIds.push(candidate.id);
    }
  }

  return {
    id: sessionId,
    startedAt: Date.now(),
    mode,
    currentQuestionIndex: 0,
    targetQuestionCount: DEFAULT_TARGET_QUESTION_COUNT,
    questionIds: initialQuestionIds,
    answers: {},
    isCompleted: false,
    isProvisional: false,
    activeDomainOrder: DOMAIN_ROTATION,
  };
}

/**
 * Determines next question adaptively based on student's answers so far
 */
export function getNextAdaptiveQuestion(session: DiagnosticSession): Question | null {
  const answeredQids = Object.keys(session.answers);
  
  // If we haven't exhausted the pre-allocated queue, check if current index has a question
  if (session.currentQuestionIndex < session.questionIds.length) {
    const qid = session.questionIds[session.currentQuestionIndex];
    const q = QUESTION_BANK.find(item => item.id === qid);
    if (q) return q;
  }

  // If question budget is reached, return null to signal completion
  if (answeredQids.length >= session.targetQuestionCount) {
    return null;
  }

  // Determine which domain needs the most evidence next
  const domainAnswerCounts: Record<DomainId, number> = {
    algebra: 0,
    advanced_math: 0,
    problem_solving: 0,
    geometry_trig: 0,
  };

  const domainSuccessCounts: Record<DomainId, number> = {
    algebra: 0,
    advanced_math: 0,
    problem_solving: 0,
    geometry_trig: 0,
  };

  Object.values(session.answers).forEach(ans => {
    const q = QUESTION_BANK.find(item => item.id === ans.questionId);
    if (q) {
      domainAnswerCounts[q.domain]++;
      if (ans.isCorrect) {
        domainSuccessCounts[q.domain]++;
      }
    }
  });

  // Pick domain with lowest representation
  const sortedDomains = [...DOMAIN_ROTATION].sort(
    (a, b) => domainAnswerCounts[a] - domainAnswerCounts[b]
  );
  const targetDomain = sortedDomains[0];

  // Determine target difficulty for this domain based on recent answers in target domain
  const domainAnswers = Object.values(session.answers).filter(ans => {
    const q = QUESTION_BANK.find(item => item.id === ans.questionId);
    return q?.domain === targetDomain;
  });

  let targetDifficulty: DifficultyLevel = 'developing';
  if (domainAnswers.length > 0) {
    const lastAns = domainAnswers[domainAnswers.length - 1];
    if (lastAns.isCorrect) {
      // Step up difficulty if correct
      if (lastAns.difficulty === 'foundation') targetDifficulty = 'developing';
      else if (lastAns.difficulty === 'developing') targetDifficulty = 'proficient';
      else targetDifficulty = 'advanced';
    } else {
      // Step down or check prerequisite
      if (lastAns.difficulty === 'advanced') targetDifficulty = 'proficient';
      else if (lastAns.difficulty === 'proficient') targetDifficulty = 'developing';
      else targetDifficulty = 'foundation';
    }
  }

  // Find candidate questions not yet answered
  let candidates = QUESTION_BANK.filter(
    q => q.domain === targetDomain && !answeredQids.includes(q.id) && q.difficulty === targetDifficulty
  );

  // If no exact match, relax difficulty constraint
  if (candidates.length === 0) {
    candidates = QUESTION_BANK.filter(
      q => q.domain === targetDomain && !answeredQids.includes(q.id)
    );
  }

  // If still no candidates in this domain, pick any unanswered question
  if (candidates.length === 0) {
    candidates = QUESTION_BANK.filter(q => !answeredQids.includes(q.id));
  }

  if (candidates.length === 0) {
    return null; // All questions answered
  }

  // Check if previous error was on a skill with a prerequisite we should probe
  if (domainAnswers.length > 0) {
    const lastAns = domainAnswers[domainAnswers.length - 1];
    if (!lastAns.isCorrect) {
      const failedSkill = SKILLS_TAXONOMY.find(s => s.id === lastAns.skillId);
      if (failedSkill && failedSkill.prerequisites.length > 0) {
        const prereqCandidate = candidates.find(
          c => failedSkill.prerequisites.includes(c.primarySkillId)
        );
        if (prereqCandidate) {
          return prereqCandidate;
        }
      }
    }
  }

  return candidates[0];
}

/**
 * Validates a student's answer against the question's correct answer and acceptable alternatives
 */
export function validateAnswer(question: Question, input: string): { isCorrect: boolean; normalized: string } {
  const cleanInput = input.trim();
  
  if (question.format === 'multiple_choice') {
    const isCorrect = cleanInput.toUpperCase() === question.correctAnswer.toUpperCase();
    return { isCorrect, normalized: cleanInput.toUpperCase() };
  }

  // Grid-in numeric validation
  const acceptable = [question.correctAnswer, ...(question.acceptableAnswers || [])].map(a => a.trim().toLowerCase());
  
  // Direct string match
  if (acceptable.includes(cleanInput.toLowerCase())) {
    return { isCorrect: true, normalized: cleanInput };
  }

  // Fraction vs Decimal evaluation (e.g. '3/4' vs '0.75' or '1/2' vs '0.5')
  try {
    const parseNumber = (val: string): number | null => {
      if (val.includes('/')) {
        const parts = val.split('/');
        if (parts.length === 2) {
          const num = parseFloat(parts[0]);
          const den = parseFloat(parts[1]);
          if (!isNaN(num) && !isNaN(den) && den !== 0) {
            return num / den;
          }
        }
      }
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };

    const studentNum = parseNumber(cleanInput);
    if (studentNum !== null) {
      for (const acc of acceptable) {
        const targetNum = parseNumber(acc);
        if (targetNum !== null && Math.abs(studentNum - targetNum) < 0.0001) {
          return { isCorrect: true, normalized: cleanInput };
        }
      }
    }
  } catch {
    // ignore parsing failure
  }

  return { isCorrect: false, normalized: cleanInput };
}

/**
 * Categorizes the plausible error type if the answer is incorrect
 */
export function inferErrorCategory(question: Question, studentAnswer: string, translationUsed: boolean): ErrorCategory {
  // If the question involves strong English phrasing (at least, at most) and translation was NOT used,
  // there is high likelihood of vocabulary/language comprehension trap
  if (question.glossaryTerms.some(term => ['at_least', 'at_most', 'no_more_than', 'no_less_than'].includes(term)) && !translationUsed) {
    return 'vocabulary';
  }

  // Look at distractor explanations if multiple choice
  if (question.format === 'multiple_choice' && question.distractorExplanations) {
    const reason = question.distractorExplanations[studentAnswer.toUpperCase()];
    if (reason) {
      const lower = reason.toLowerCase();
      if (lower.includes('formula') || lower.includes('reciprocal') || lower.includes('factor theorem')) {
        return 'incorrect_formula';
      }
      if (lower.includes('sign') || lower.includes('subtracting') || lower.includes('adding') || lower.includes('arithmetic')) {
        return 'arithmetic';
      }
      if (lower.includes('factor') || lower.includes('distribut') || lower.includes('square')) {
        return 'algebraic_manipulation';
      }
      if (lower.includes('word') || lower.includes('percentage') || lower.includes('rate')) {
        return 'word_problem_comprehension';
      }
    }
  }

  if (question.domain === 'problem_solving') {
    return 'word_problem_comprehension';
  }

  if (question.domain === 'algebra') {
    return 'algebraic_manipulation';
  }

  return 'conceptual';
}
