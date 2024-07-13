import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Play, Trophy } from 'lucide-react';
import { Subject, TestSet } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorDisplay from './common/ErrorDisplay';


const TestListPage: React.FC = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subjectName, setSubjectName] = useState<string>('');
  const [testSets, setTestSets] = useState<TestSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchTestSets = localStorage.getItem('testSets')
        if (fetchTestSets){
          setTestSets(JSON.parse(fetchTestSets));
        }
        const fetchSubjects: string | null = localStorage.getItem('subjects')
        if (fetchSubjects){
          const parsedSubjects: Subject[] = JSON.parse(fetchSubjects)
          setSubjectName(parsedSubjects.filter(s => s.id === Number(subjectId))[0].name);
        }else{
          throw new Error('Subject not found');
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  const startTest = (testId: number) => {
    navigate(`/testlist/${subjectId}/all-questions/${testId}`);
  };

  const showRankingDialog = (testId: number) => {
    navigate(`/testlist/${subjectId}/ranking/${testId}`);
  };

  const goToSubjectList = () => {
    navigate('/');
  };

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <div className="flex items-center mb-6">
        <Button onClick={goToSubjectList} variant="ghost" size="sm" className="mr-2">
          <ChevronLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold">{subjectName} - テスト一覧</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testSets.map((testSet) => (
          <Card key={testSet.id} className='shadow'>
            <CardHeader>
              <CardTitle>{testSet.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">問題数: {testSet.questions.length}</p>
              <div className="flex justify-start space-x-2">
                <Button onClick={() => startTest(testSet.id)} className="flex items-center">
                  <Play size={16} className="mr-2" />
                  テストする
                </Button>
                <Button onClick={() => showRankingDialog(testSet.id)} variant="outline" className="flex items-center border-black">
                  <Trophy size={16} className="mr-2" />
                  ランキング
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestListPage;