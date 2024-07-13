import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswerSelect: (answer: string, isCorrect: boolean) => void;
  onNextQuestion: () => void;
  onShowResult: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onAnswerSelect,
  onNextQuestion,
  onShowResult,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    const isCorrect = answer === question.correctAnswer;
    onAnswerSelect(answer, isCorrect);
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      onNextQuestion();
    } else {
      onShowResult();
    }
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <Card className='shadow'>
      <CardContent className="p-6">
        <h2 className="text-xl mb-4">問題 {currentQuestionIndex + 1} / {totalQuestions}</h2>
        <p className="mb-4">{question.question}</p>
        <div className="space-y-2">
          {question.choices.map((choice, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerClick(choice)}
              variant={selectedAnswer === choice ? (choice === question.correctAnswer ? "default" : "destructive") : "outline"}
              className="w-full justify-start border-gray-400"
              disabled={isAnswered}
            >
              {choice}
            </Button>
          ))}
        </div>
        {isAnswered && (
          <Alert className="mt-4" variant={selectedAnswer === question.correctAnswer ? "default" : "destructive"}>
            <AlertDescription>
              {selectedAnswer === question.correctAnswer ? "正解です！" : `不正解です。正解は「${question.correctAnswer}」です。`}
            </AlertDescription>
          </Alert>
        )}
        {isAnswered && (
          <Button
            onClick={handleNextClick}
            className="mt-4"
          >
            {currentQuestionIndex < totalQuestions - 1 ? "次の問題" : "結果を見る"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;