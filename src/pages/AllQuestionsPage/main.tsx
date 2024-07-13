import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import TestHeader from './TestHeader';
import QuestionCard from './QuestionCard';
import TestResult from './TestResult';
import { Subject } from '@/types';

interface Question {
  id: number;
  question: string;
  choices: string[];
  correctAnswer: string;
}

interface TestSet {
  id: number;
  name: string;
  subjectId: number;
  questions: Question[];
}

interface TestResult {
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

const AllQuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { subjectId, testId } = useParams<{ subjectId: string; testId: string }>();

  const [testSet, setTestSet] = useState<TestSet | null>(null);
  const [subjectName, setSubjectName] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answerHistory, setAnswerHistory] = useState<TestResult['answerHistory']>([]);

  useEffect(() => {
    const fetchTestData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchTestSets = localStorage.getItem('testSets')
        const fetchSubjects = localStorage.getItem('subjects')

        if (fetchTestSets){
          const parseTestSets: TestSet[] = JSON.parse(fetchTestSets)
          setTestSet(parseTestSets.filter(t => t.id === Number(testId))[0]);

        }
        if (fetchSubjects){
          const parseSubjects: Subject[] = JSON.parse(fetchSubjects)
          setSubjectName(parseSubjects.filter(s => s.id === Number(subjectId))[0].name);

        }
      } catch (err) {
        setError('Failed to fetch test data. Please try again later.');
        console.error('Error fetching test data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestData();
  }, [testId, subjectId]);

  const handleAnswerSelect = (answer: string, isCorrect: boolean) => {
    if (!testSet) return;
    
    const currentQuestion = testSet.questions[currentQuestionIndex];
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    setAnswerHistory(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        userAnswer: answer,
        isCorrect: isCorrect
      }
    ]);
  };


  const handleNextQuestion = () => {
    if (!testSet) return;
    if (currentQuestionIndex < testSet.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
      saveTestResult();
    }
  };

  const handleShowResult = () => {
    setShowResult(true);
    saveTestResult();
  };

  const saveTestResult = async () => {
    if (!testSet) return;
    try {
      const fetchTestResults = localStorage.getItem('testResults')
      if (fetchTestResults){
        const testResults = JSON.parse(fetchTestResults)
        const newResult: TestResult = {
          id: testResults.length + 1,
          testSetId: Number(testId),
          subjectId: Number(subjectId),
          correctAnswers,
          totalQuestions: testSet.questions.length,
          date: new Date().toISOString(),
          answerHistory: answerHistory
        };
        const newTestResults = [...testResults, newResult]
        localStorage.setItem('testResults', JSON.stringify(newTestResults))
        console.log('Test result saved:', newResult);
      }
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
    setAnswerHistory([]);
  };

  const goToTestList = () => {
    navigate(`/testlist/${subjectId}`);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!testSet) return <ErrorDisplay message="No test data available." />;

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <TestHeader subjectName={subjectName} testName={testSet.name} onBackClick={goToTestList} />
      
      {showResult ? (
        <TestResult
          correctAnswers={correctAnswers}
          totalQuestions={testSet.questions.length}
          questions={testSet.questions}
          answerHistory={answerHistory}
          onRestartTest={restartTest}
          onGoToTestList={goToTestList}
        />
      ) : (
        <QuestionCard
          question={testSet.questions[currentQuestionIndex]}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={testSet.questions.length}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={handleNextQuestion}
          onShowResult={handleShowResult}
        />
      )}
    </div>
  );
};

export default AllQuestionsPage;