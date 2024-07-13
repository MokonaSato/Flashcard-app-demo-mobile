export type Subject = { id: number, name: string }
export type Word = { 
  id: number, 
  subjectId: number, 
  word: string, 
  meaning: string, 
  tagIds: number[], 
  isMarked: boolean, 
  createdAt: string
}
export type Tag = {
  id: number,
  name: string
}
export type Question = {
  id: number,
  question: string,
  choices: string[],
  correctAnswer: string,
}
export type TestSet = {
  id: number,
  subjectId: number,
  name: string,
  questions: Question[]
}
export type TestResult = {
  id: number;
  testSetId: number;
  subjectId: number;
  correctAnswers: number;
  totalQuestions: number;
  date: string;
  answerHistory: {
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}