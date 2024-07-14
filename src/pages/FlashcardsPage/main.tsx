import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderComponent from './HeaderComponent';
import WordCardList from './WordCardList';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { Word, Tag, Subject } from '../../types';

const FlashcardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [subjectName, setSubjectName] = useState<string>('');
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [filterMarked, setFilterMarked] = useState<'all' | 'marked' | 'unmarked'>('all');
  const [sortMethod, setSortMethod] = useState<string>('createdAt-desc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchWords();
        await fetchTags();
        await fetchSubjectName();
      } catch (err) {
        setError('データの読み込み中にエラーが発生しました。後でもう一度お試しください。');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  useEffect(() => {
    applyFilterAndSort();
  }, [words, filterMarked, sortMethod]);

  const fetchWords = async () => {
    try {
      const fetchWords = localStorage.getItem('words')
      if (fetchWords){
        const parseWords: Word[] = JSON.parse(fetchWords)
        setWords(parseWords.filter(w => w.subjectId === Number(subjectId)));
      }
    } catch (err) {
      console.error('Error fetching words:', err);
    }
  };

  const fetchTags = async () => {
    try {
      const fetchTags = localStorage.getItem('tags')
      if (fetchTags){
        setTags(JSON.parse(fetchTags));
      }
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const fetchSubjectName = async () => {
    try {
      const fetchSubjects = localStorage.getItem('subjects')
      if (fetchSubjects){
        const parseSubjects: Subject[] = JSON.parse(fetchSubjects)
        setSubjectName(parseSubjects.filter(s => s.id === Number(subjectId))[0].name);
      }
    } catch (error) {
      console.error('Error fetching subject name:', error);
    }
  };

  const applyFilterAndSort = () => {
    let filtered = words;
    if (filterMarked === 'marked') {
      filtered = words.filter(word => word.isMarked);
    } else if (filterMarked === 'unmarked') {
      filtered = words.filter(word => !word.isMarked);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortMethod) {
        case 'word-asc':
          return a.word.localeCompare(b.word);
        case 'word-desc':
          return b.word.localeCompare(a.word);
        case 'createdAt-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredWords(sorted);
  };

  const toggleMarkWord = async (word: Word) => {
    try {
      const markedWord = { ...word, isMarked: !word.isMarked }
      const putWord = words.map(w => w.id === markedWord.id ? markedWord : w)
      localStorage.setItem('words', JSON.stringify(putWord))
      setWords(putWord);
    } catch (error) {
      console.error('Error toggling word mark:', error);
    }
  };

  const deleteWord = async (id: number) => {
    try {
      const deleteWords = words.filter(w => w.id !== id)
      localStorage.setItem('words', JSON.stringify(deleteWords))
      setWords(deleteWords);
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const selectWord = (word: Word) => {
    navigate(`/flashcard/${subjectId}/edit/${word.id}`);
  };

  const startNewWord = () => {
    navigate(`/flashcard/${subjectId}/new`);
  };

  const goToSubjectList = () => {
    navigate('/');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <HeaderComponent
        subjectName={subjectName}
        onNavigateBack={goToSubjectList}
        onFilterChange={(filter: 'all' | 'marked' | 'unmarked') => setFilterMarked(filter)}
        onSortChange={(sort: string) => setSortMethod(sort)}
        onNewWord={startNewWord}
      />
      
      <div className="h-[calc(100vh-120px)]">
        <WordCardList
          words={filteredWords}
          tags={tags}
          onSelectWord={selectWord}
          onToggleMarkWord={toggleMarkWord}
          onDeleteWord={deleteWord}
        />
      </div>
    </div>
  );
};

export default FlashcardsPage;