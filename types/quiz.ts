export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizQuestion extends Question {
  id: number;
  choices: string[];
}

export interface UserAnswer {
  questionId: number;
  answer: string;
}

export interface QuizState {
  email: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<number, string>;
  visitedQuestions: Set<number>;
  startTime: number;
  timeRemaining: number;
}

export interface QuizResult {
  email: string;
  questions: QuizQuestion[];
  userAnswers: Record<number, string>;
  score: number;
  totalQuestions: number;
}
