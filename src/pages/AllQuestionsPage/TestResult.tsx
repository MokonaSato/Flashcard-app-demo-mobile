import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '../../types';
import ResultCard from './ResultCard';

interface TestResultProps {
  correctAnswers: number;
  totalQuestions: number;
  questions: Question[];
  answerHistory: {
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
  }[];
  onRestartTest: () => void;
  onGoToTestList: () => void;
}

const TestResult: React.FC<TestResultProps> = ({
  correctAnswers,
  totalQuestions,
  questions,
  answerHistory,
  onRestartTest,
  onGoToTestList,
}) => {
  const percentage = (correctAnswers / totalQuestions) * 100;

  return (
    <Card className='shadow'>
      <CardContent className="p-6">
        <h2 className="text-xl mb-4">テスト完了！</h2>
        <p className="mb-2">正答数: {correctAnswers} / {totalQuestions}</p>
        <p className="mb-4">正答率: {percentage.toFixed(2)}%</p>
        <h3 className="text-lg font-semibold mb-2">問題ごとの結果:</h3>
        <div className="space-y-4 mb-4">
          {questions.map((question, index) => (
            <ResultCard
              key={question.id}
              question={question}
              index={index}
              userAnswer={answerHistory.find(h => h.questionId === question.id)?.userAnswer}
              isCorrect={answerHistory.find(h => h.questionId === question.id)?.isCorrect}
            />
          ))}
        </div>
        <div className="flex space-x-4">
          <Button onClick={onRestartTest}>もう一度挑戦する</Button>
          <Button onClick={onGoToTestList} variant="outline" className='border-black'>テスト一覧へ</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResult;