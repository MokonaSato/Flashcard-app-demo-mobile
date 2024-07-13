import React from 'react';
import { Card } from '@/components/ui/card';
import { Question } from '../../types';

interface ResultCardProps {
  question: Question;
  index: number;
  userAnswer: string | undefined;
  isCorrect: boolean | undefined;
}

const ResultCard: React.FC<ResultCardProps> = ({ question, index, userAnswer, isCorrect }) => (
  <Card className="p-4 shadow">
    <h4 className="font-semibold mb-2">問題 {index + 1}</h4>
    <p className="mb-2">{question.question}</p>
    <p className="mb-2">
      あなたの回答: 
      <span className={isCorrect ? "font-semibold" : "text-red-600 font-semibold"}>
        {userAnswer}
      </span>
    </p>
    <p className="mb-2">正解: <span className="font-semibold">{question.correctAnswer}</span></p>
  </Card>
);

export default ResultCard;