import { DiagnosticReport, DiagnosticSession, DomainId, DomainPerformance, MasteryStatus, SkillMastery, StudentAnswer, StudentProfile, StudyPlan, StudyPlanItem, SupportedLanguage } from '../types';
import { DOMAIN_INFO, SKILLS_TAXONOMY } from '../data/skillsTaxonomy';
import { QUESTION_BANK } from '../data/questionBank';

/**
 * Calculates domain performance and individual skill masteries from a set of student answers
 */
export function generateDiagnosticReport(session: DiagnosticSession, profile: StudentProfile | null): DiagnosticReport {
  const answers = Object.values(session.answers);
  const totalQuestions = answers.length;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const translationUsageCount = answers.filter(a => a.translationUsed).length;

  // Domain breakdown
  const domainPerformances: Record<DomainId, DomainPerformance> = {
    algebra: calculateDomainScore('algebra', answers),
    advanced_math: calculateDomainScore('advanced_math', answers),
    problem_solving: calculateDomainScore('problem_solving', answers),
    geometry_trig: calculateDomainScore('geometry_trig', answers),
  };

  // Skill masteries
  const skillMasteries: Record<string, SkillMastery> = {};
  const strengths: string[] = [];
  const priorityGaps: string[] = [];

  SKILLS_TAXONOMY.forEach(skill => {
    const skillAnswers = answers.filter(a => a.skillId === skill.id);
    const mastery = evaluateSkillMastery(skill.id, skillAnswers);
    skillMasteries[skill.id] = mastery;

    if (mastery.status === 'strong') {
      strengths.push(skill.id);
    } else if (mastery.status === 'needs_attention') {
      priorityGaps.push(skill.id);
    }
  });

  const isProvisional = totalQuestions < 10;
  const completionStatus = isProvisional ? 'provisional' : 'full';

  // Recommended next steps
  const recommendedNextSteps: string[] = [];
  if (priorityGaps.length > 0) {
    recommendedNextSteps.push(`Focus immediate preparation on foundational gaps: ${priorityGaps.length} skills flagged.`);
  } else {
    recommendedNextSteps.push('Solid core baseline observed across tested domains. Target advanced difficulty problems.');
  }

  if (translationUsageCount > totalQuestions / 2) {
    recommendedNextSteps.push('Build English mathematical vocabulary (e.g. at least, rate of change) to improve speed on the actual Digital SAT.');
  }

  return {
    id: 'report_' + Date.now(),
    sessionId: session.id,
    generatedAt: Date.now(),
    totalQuestions,
    correctCount,
    accuracy,
    completionStatus,
    mode: session.mode,
    translationUsageCount,
    domainPerformances,
    skillMasteries,
    strengths,
    priorityGaps,
    recommendedNextSteps,
    selfReportedScore: profile?.currentScore || null,
  };
}

function calculateDomainScore(domainId: DomainId, allAnswers: StudentAnswer[]): DomainPerformance {
  const domainAnswers = allAnswers.filter(a => {
    const q = QUESTION_BANK.find(item => item.id === a.questionId);
    return q?.domain === domainId;
  });

  const total = domainAnswers.length;
  const correct = domainAnswers.filter(a => a.isCorrect).length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  let status: MasteryStatus = 'not_enough_evidence';
  let evidenceStrength: 'low' | 'medium' | 'high' = 'low';

  if (total >= 3) {
    evidenceStrength = total >= 5 ? 'high' : 'medium';
    if (accuracy >= 75) status = 'strong';
    else if (accuracy >= 45) status = 'developing';
    else status = 'needs_attention';
  } else if (total > 0) {
    status = accuracy >= 50 ? 'developing' : 'needs_attention';
  }

  return {
    domainId,
    domainName: DOMAIN_INFO[domainId].title,
    totalQuestions: total,
    correctAnswers: correct,
    accuracy,
    status,
    evidenceStrength,
  };
}

function evaluateSkillMastery(skillId: string, answers: StudentAnswer[]): SkillMastery {
  const attempts = answers.length;
  const correct = answers.filter(a => a.isCorrect).length;
  const accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

  const difficultyDistribution = {
    foundation: answers.filter(a => a.difficulty === 'foundation').length,
    developing: answers.filter(a => a.difficulty === 'developing').length,
    proficient: answers.filter(a => a.difficulty === 'proficient').length,
    advanced: answers.filter(a => a.difficulty === 'advanced').length,
  };

  const errorPatterns = answers
    .filter(a => !a.isCorrect && a.errorCategory)
    .map(a => a.errorCategory!);

  let evidenceStrength: 'low' | 'medium' | 'high' = 'low';
  let status: MasteryStatus = 'not_enough_evidence';
  let recommendedNextAction = 'Take a diagnostic check to assess this skill.';

  if (attempts === 0) {
    evidenceStrength = 'low';
    status = 'not_enough_evidence';
    recommendedNextAction = 'Practice 2-3 questions to establish baseline mastery.';
  } else if (attempts === 1) {
    evidenceStrength = 'low';
    if (answers[0].isCorrect) {
      status = 'developing';
      recommendedNextAction = 'Verify with a higher-difficulty problem to confirm mastery.';
    } else {
      status = 'needs_attention';
      recommendedNextAction = 'Review core lesson rules and check prerequisites.';
    }
  } else {
    // 2 or more attempts
    evidenceStrength = attempts >= 3 ? 'high' : 'medium';
    const hasProficientOrAdvancedCorrect = answers.some(
      a => a.isCorrect && (a.difficulty === 'proficient' || a.difficulty === 'advanced')
    );

    if (accuracy >= 75 && hasProficientOrAdvancedCorrect) {
      status = 'strong';
      recommendedNextAction = 'Maintain mastery with periodic timed practice.';
    } else if (accuracy >= 50) {
      status = 'developing';
      recommendedNextAction = 'Work through targeted practice on intermediate questions.';
    } else {
      status = 'needs_attention';
      recommendedNextAction = 'Study the concept lesson and practice foundational questions first.';
    }
  }

  return {
    skillId,
    attempts,
    correct,
    accuracy,
    difficultyDistribution,
    errorPatterns,
    evidenceStrength,
    status,
    lastAssessedDate: answers.length > 0 ? new Date(answers[answers.length - 1].timestamp).toLocaleDateString() : 'Not yet',
    recommendedNextAction,
  };
}

/**
 * Generates an ordered, personalized study plan based on gaps, prerequisites, target score, and weekly study time
 */
export function generateStudyPlan(report: DiagnosticReport, profile: StudentProfile | null): StudyPlan {
  const weeklyHours = profile?.weeklyHours || 4;
  const items: StudyPlanItem[] = [];

  // 1. Identify Priority 1: Foundational Gaps & Prerequisite Dependencies
  SKILLS_TAXONOMY.forEach(skill => {
    const mastery = report.skillMasteries[skill.id];
    const isGap = mastery && mastery.status === 'needs_attention';
    const isPrereqOfGap = SKILLS_TAXONOMY.some(
      other => other.prerequisites.includes(skill.id) && report.skillMasteries[other.id]?.status === 'needs_attention'
    );

    if (isGap || (isPrereqOfGap && mastery?.status !== 'strong')) {
      items.push({
        id: 'plan_' + skill.id,
        skillId: skill.id,
        topic: skill.topic,
        learningObjective: {
          en: `Master fundamental rules of ${skill.title.en}`,
          kk: `${skill.title.kk} негізгі ережелерін меңгеру`,
          ru: `Освоить базовые правила темы «${skill.title.ru}»`,
          id: `Kuasai aturan dasar topik ${skill.title.id}`,
        },
        whyNeeded: {
          en: 'Identified as a critical priority learning gap in your diagnostic assessment.',
          kk: 'Диагностикалық тексеру нәтижесінде басым білім алшақтығы ретінде анықталды.',
          ru: 'Выявлен как ключевой пробел в знаниях по результатам диагностического теста.',
          id: 'Teridentifikasi sebagai kesenjangan prioritas utama dalam tes diagnostik Anda.',
        },
        currentStatus: mastery ? mastery.status : 'not_enough_evidence',
        prerequisites: skill.prerequisites,
        priority: 1,
        estimatedMinutes: Math.round(weeklyHours * 10),
        completed: false,
      });
    }
  });

  // 2. Identify Priority 2: High-value skills in developing status or high SAT weight
  SKILLS_TAXONOMY.forEach(skill => {
    const alreadyIncluded = items.some(i => i.skillId === skill.id);
    if (!alreadyIncluded) {
      const mastery = report.skillMasteries[skill.id];
      if (mastery && (mastery.status === 'developing' || mastery.status === 'not_enough_evidence')) {
        items.push({
          id: 'plan_' + skill.id,
          skillId: skill.id,
          topic: skill.topic,
          learningObjective: {
            en: `Advance from developing to proficient in ${skill.title.en}`,
            kk: `${skill.title.kk} бойынша дағдыны жетік деңгейге жеткізу`,
            ru: `Улучшить уровень владения темой «${skill.title.ru}» до уверенного`,
            id: `Tingkatkan kemampuan ${skill.title.id} dari berkembang ke mahir`,
          },
          whyNeeded: {
            en: `High-frequency Digital SAT topic (${skill.satWeightPercent}% exam weight) that needs consolidation.`,
            kk: `Digital SAT емтиханында жоғары жиілікпен келетін маңызды тақырып (${skill.satWeightPercent}% салмақ).`,
            ru: `Часто встречающаяся тема Digital SAT (${skill.satWeightPercent}% веса экзамена).`,
            id: `Topik frekuensi tinggi Digital SAT (bobot ujian ${skill.satWeightPercent}%) yang perlu dimantapkan.`,
          },
          currentStatus: mastery.status,
          prerequisites: skill.prerequisites,
          priority: 2,
          estimatedMinutes: Math.round(weeklyHours * 8),
          completed: false,
        });
      }
    }
  });

  // 3. Priority 3: Refinement and Advanced mastery on remaining strong skills
  SKILLS_TAXONOMY.forEach(skill => {
    const alreadyIncluded = items.some(i => i.skillId === skill.id);
    if (!alreadyIncluded) {
      items.push({
        id: 'plan_' + skill.id,
        skillId: skill.id,
        topic: skill.topic,
        learningObjective: {
          en: `Target advanced hard questions for ${skill.title.en}`,
          kk: `${skill.title.kk} бойынша күрделі деңгейдегі есептерді шешу`,
          ru: `Тренировка сложных задач повышенного уровня по теме «${skill.title.ru}»`,
          id: `Latihan soal tingkat lanjut untuk topik ${skill.title.id}`,
        },
        whyNeeded: {
          en: 'You showed strong baseline performance; now push for 700+ score perfection.',
          kk: 'Сізде жақсы база бар; енді 700+ баллға жету үшін күрделі сұрақтарды пысықтаңыз.',
          ru: 'У вас хорошая база; теперь оттачивайте мастерство для результата 700+.',
          id: 'Performa dasar Anda sudah kuat; sekarang kejar kesempurnaan skor 700+.',
        },
        currentStatus: 'strong',
        prerequisites: skill.prerequisites,
        priority: 3,
        estimatedMinutes: Math.round(weeklyHours * 6),
        completed: false,
      });
    }
  });

  // Sort by priority (1, then 2, then 3)
  items.sort((a, b) => a.priority - b.priority);

  return {
    generatedAt: Date.now(),
    weeklyHours,
    targetScore: profile?.targetScore || null,
    examDate: profile?.examDate || null,
    items,
  };
}
