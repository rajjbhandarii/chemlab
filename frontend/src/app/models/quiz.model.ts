export interface Quiz {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export interface QuizCount {
  Easy?: number;
  Medium?: number;
  Hard?: number;
}

export interface QuizState {
  questions: Quiz[];
  currentIndex: number;
  score: number;
  answers: (number | null)[];
  isComplete: boolean;
}
