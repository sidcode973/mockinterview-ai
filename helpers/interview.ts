import { IQuestion } from "@/backend/models/interview-model";

export const saveAnswerToLocalStorage = (
  interviewId: string,
  questionId: string,
  answer: string
) => {
  const key = `interview-${interviewId}-answers`;
  const storedAnswers = JSON.parse(localStorage.getItem(key) || "{}");
  storedAnswers[questionId] = answer;

  localStorage.setItem(key, JSON.stringify(storedAnswers));
};

export const getAnswerFromLocalStorage = (
  interviewId: string,
  questionId: string
) => {
  const key = `interview-${interviewId}-answers`;
  const storedAnswers = JSON.parse(localStorage.getItem(key) || "{}");
  return storedAnswers[questionId] || "";
};

export const getAnswersFromLocalStorage = (interviewId: string) => {
  const key = `interview-${interviewId}-answers`;
  const storedAnswers = localStorage.getItem(key);
  return storedAnswers ? JSON.parse(storedAnswers) : null;
};

export const getFirstIncompleteQuestionIndex = (questions: IQuestion[]) => {
   const firstIncompleteIndex = questions?.findIndex(
    (question: IQuestion) => !question?.completed
   )
   return firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0;
}

export const calculateAverageScore = (questions: IQuestion[]): string => {
  if (!questions || questions?.length === 0) return "0";

  // Only average questions that were actually answered (not passed, not skipped)
  const answeredQuestions = questions.filter(
    (q) => q?.completed && q?.answer && q?.answer !== "pass"
  );

  if (answeredQuestions.length === 0) return "0";

  const totalScore = answeredQuestions.reduce(
    (sum, question) => sum + (question?.result?.overallScore || 0),
    0
  );

  const avg = totalScore / answeredQuestions.length;

  // Show integer when whole number (9 not 9.0), keep 1 decimal only when needed (7.5)
  return parseFloat(avg.toFixed(1)).toString();
};

export const calculateDuration = (duration: number, durationLeft: number) => {
  const durationUsedInMinutes = ((duration - durationLeft) / 60).toFixed(0);
  const totalDurationInMinutes = (duration / 60).toFixed(0);

  return {
    total: parseInt(totalDurationInMinutes),
    strValue: `${durationUsedInMinutes} / ${totalDurationInMinutes} min`,
    chartDataValue: parseFloat(durationUsedInMinutes),
  };
};