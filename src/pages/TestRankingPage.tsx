import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorDisplay from './common/ErrorDisplay';

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

interface QuestionRanking {
  id: number;
  question: string;
  correctRate: number;
}

const TestRankingPage: React.FC = () => {
  const { subjectId, testId } = useParams<{ subjectId: string, testId: string }>();
  const navigate = useNavigate();
  
  const [testName, setTestName] = useState<string>('');
  const [questions, setQuestions] = useState<QuestionRanking[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
  const [questionDetails, setQuestionDetails] = useState<{ [key: number]: Question }>({});

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchTestSets = localStorage.getItem('testSets')
        const fetchTestResults = localStorage.getItem('testResults')
        if (fetchTestSets && fetchTestResults){
          const parseTestSets: TestSet[] = JSON.parse(fetchTestSets)
          const testSet = parseTestSets.filter(t => t.id === Number(testId))[0];
          setTestName(testSet.name);

          const parseTestResults: TestResult[] = JSON.parse(fetchTestResults)
          const filterTestResult = parseTestResults.filter(r => r.testSetId === Number(testId))

          const questionRankings = calculateQuestionRankings(testSet.questions, filterTestResult);
          setQuestions(questionRankings);
          
          const details = testSet.questions.reduce((acc, q) => ({...acc, [q.id]: q}), {});
          setQuestionDetails(details);
        }
      } catch (err) {
        setError('データの読み込み中にエラーが発生しました。後でもう一度お試しください。');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [testId, subjectId]);

  const calculateQuestionRankings = (questions: Question[], testResults: TestResult[]): QuestionRanking[] => {
    const questionStats = questions.reduce((acc, q) => ({
      ...acc,
      [q.id]: { correct: 0, total: 0 }
    }), {} as { [key: number]: { correct: number, total: number } });

    testResults.forEach(result => {
      result.answerHistory.forEach(answer => {
        questionStats[answer.questionId].total++;
        if (answer.isCorrect) {
          questionStats[answer.questionId].correct++;
        }
      });
    });

    return questions.map(q => ({
      id: q.id,
      question: q.question,
      correctRate: questionStats[q.id].total > 0
        ? (questionStats[q.id].correct / questionStats[q.id].total) * 100
        : 0
    }));
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    return sortOrder === 'asc' 
      ? a.correctRate - b.correctRate 
      : b.correctRate - a.correctRate;
  });

  const goToTestList = () => {
    navigate(`/testlist/${subjectId}`);
  };

  const toggleQuestionExpansion = (questionId: number) => {
    setExpandedQuestionId(expandedQuestionId === questionId ? null : questionId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Button onClick={goToTestList} variant="ghost" size="sm" className="mr-2">
            <ChevronLeft size={16} />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{testName}</h1>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={toggleSortOrder} 
            variant="outline" 
            size="sm" 
            className='border-black text-sm py-1'
          >
            <ArrowUpDown size={16} className="mr-2" />
            {sortOrder === 'asc' ? '正答率：低い順' : '正答率：高い順'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedQuestions.map((question) => (
          <Card 
          key={question.id} 
          className={`transition-all duration-200 shadow-md hover:shadow-lg ${
            question.correctRate < 30 
              ? 'bg-red-50' 
              : ''
          }`} 
        >
          <CardContent className="p-4">
              <div 
                className="cursor-pointer"
                onClick={() => toggleQuestionExpansion(question.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">問{question.id}</span>
                  {expandedQuestionId === question.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <div className="mt-1">
                  <p>{question.question}</p>
                  <div className="flex justify-end mt-1 mr-6">
                    <span className={`font-semibold ${question.correctRate < 30 ? 'text-red-600' : ''}`}>
                      正答率 {question.correctRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              {expandedQuestionId === question.id && questionDetails[question.id] && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <ul className="list-disc pl-5 mb-2">
                    {questionDetails[question.id].choices.map((choice, index) => (
                      <li key={index}>
                        {choice}
                      </li>
                    ))}
                  </ul>
                  <details>
                    <summary>正解</summary>
                    {questionDetails[question.id].correctAnswer}
                  </details>
                </div>
              )}
            </CardContent>
        </Card>
        ))}
      </div>
    </div>
  );
};

export default TestRankingPage;