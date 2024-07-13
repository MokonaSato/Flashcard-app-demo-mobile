import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import AlertComponent from '../common/AlertComponent';
import HeaderComponent from './HeaderComponent';
import WordCardList from './WordCardList';
import WordEditForm from './WordEditForm';
import NewTagDialog from './NewTagDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { Word, Tag, Subject } from '../../types';

const FlashcardsPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [subjectName, setSubjectName] = useState<string>('');
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [newWord, setNewWord] = useState<string>('');
  const [newMeaning, setNewMeaning] = useState<string>('');
  const [newTags, setNewTags] = useState<number[]>([]);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [pendingWordSelection, setPendingWordSelection] = useState<Word | null>(null);
  const [filterMarked, setFilterMarked] = useState<'all' | 'marked' | 'unmarked'>('all');
  const [sortMethod, setSortMethod] = useState<string>('createdAt-desc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewTagDialog, setShowNewTagDialog] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<string>('');
  const [isContentChanged, setIsContentChanged] = useState<boolean>(false);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchWords();
        await fetchTags();
      } catch (err) {
        setError('データの読み込み中にエラーが発生しました。後でもう一度お試しください。');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
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
        console.error('Error fetching tags:', error);
      }
    };

    fetchData();
    fetchSubjectName();
  }, [subjectId]);

  useEffect(() => {
    applyFilterAndSort();
  }, [words, filterMarked, sortMethod]);

  const fetchWords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchWords = localStorage.getItem('words')
      if (fetchWords){
        const parseWords: Word[] = JSON.parse(fetchWords)
        setWords(parseWords.filter(w => w.subjectId === Number(subjectId)));
      }
    } catch (err) {
      setError('Failed to fetch words. Please try again later.');
      console.error('Error fetching words:', err);
    } finally {
      setIsLoading(false);
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

  const addWord = async () => {
    if (newWord && newMeaning) {
      try {
        const postWord: Word = {
          id: words.length + 1,
          subjectId: Number(subjectId),
          word: newWord,
          meaning: newMeaning,
          tagIds: newTags,
          isMarked: false,
          createdAt: new Date().toISOString()
        }
        const newWords = [...words, postWord]
        localStorage.setItem('words', JSON.stringify(newWords))
        setWords(newWords);
        resetForm();
      } catch (error) {
        console.error('Error adding word:', error);
      }
    }
  };

  const updateWord = async () => {
    if (selectedWord) {
      try {
        const putWord: Word = {
          ...selectedWord,
          word: newWord,
          meaning: newMeaning,
          tagIds: newTags
        }
        const newWords = words.map(w => w.id === putWord.id ? putWord : w)
        localStorage.setItem('words', JSON.stringify(newWords))
        setWords(newWords);
        resetForm();
      } catch (error) {
        console.error('Error updating word:', error);
      }
    }
  };

  const deleteWord = async (id: number) => {
    try {
      const deleteWords = words.filter(w => w.id !== id)
      localStorage.setItem('words', JSON.stringify(deleteWords))
      setWords(deleteWords);
      if (selectedWord && selectedWord.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting word:', error);
    }
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

  const addNewTag = async () => {
    if (newTagName.trim()) {
      try {
        const newTag = {
          id: tags.length + 1,
          name: newTagName.trim()
        }
        const postTags = [...tags, newTag]
        localStorage.setItem('tags', JSON.stringify(postTags))
        setTags(postTags);
        setNewTags([...newTags, newTag.id]);
        setNewTagName('');
        setShowNewTagDialog(false);
      } catch (error) {
        console.error('Error adding new tag:', error);
      }
    }
  };

  const resetForm = useCallback(() => {
    setSelectedWord(null);
    setNewWord('');
    setNewMeaning('');
    setNewTags([]);
    setIsContentChanged(false);
  }, []);

  const startNewWord = () => {
    if (isContentChanged) {
      setShowWarning(true);
      setPendingWordSelection(null);
    } else {
      resetForm();
    }
  };

  const selectWord = (word: Word) => {
    if (isContentChanged) {
      setShowWarning(true);
      setPendingWordSelection(word);
    } else {
      setSelectedWord(word);
      setNewWord(word.word);
      setNewMeaning(word.meaning);
      setNewTags(word.tagIds);
      setIsContentChanged(false);
    }
  };

  const handleContentChange = useCallback(() => {
    if (selectedWord) {
      const isChanged = 
        newWord !== selectedWord.word ||
        newMeaning !== selectedWord.meaning ||
        JSON.stringify(newTags.sort()) !== JSON.stringify(selectedWord.tagIds.sort());
      setIsContentChanged(isChanged);
    } else {
      setIsContentChanged(newWord !== '' || newMeaning !== '' || newTags.length > 0);
    }
  }, [newWord, newMeaning, newTags, selectedWord]);

  useEffect(() => {
    handleContentChange();
  }, [handleContentChange]); 

  const handleWarningConfirm = () => {
    setShowWarning(false);
    if (pendingWordSelection) {
      setSelectedWord(pendingWordSelection);
      setNewWord(pendingWordSelection.word);
      setNewMeaning(pendingWordSelection.meaning);
      setNewTags(pendingWordSelection.tagIds);
    } else {
      resetForm();
    }
    setPendingWordSelection(null);
    setIsContentChanged(false);
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
    setPendingWordSelection(null);
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
      
      <div className="flex h-[calc(100vh-120px)]">
        <WordCardList
          words={filteredWords}
          tags={tags}
          onSelectWord={selectWord}
          onToggleMarkWord={toggleMarkWord}
          onDeleteWord={deleteWord}
        />
        
        <WordEditForm
          newWord={newWord}
          newMeaning={newMeaning}
          newTags={newTags}
          tags={tags}
          selectedWord={selectedWord}
          onWordChange={(value) => {
            setNewWord(value);
            handleContentChange();
          }}
          onMeaningChange={(value) => {
            setNewMeaning(value);
            handleContentChange();
          }}
          onTagsChange={(tagId: number) => {
            setNewTags(prev => 
              prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
            );
            handleContentChange();
          }}
          onAddWord={addWord}
          onUpdateWord={updateWord}
          onResetForm={resetForm}
          onShowNewTagDialog={() => setShowNewTagDialog(true)}
        />
      </div>

      <AlertComponent
        isOpen={showWarning}
        onClose={handleWarningCancel}
        onConfirm={handleWarningConfirm}
        title="警告"
        description="編集中の内容は破棄されます。よろしいですか？"
      />


      <NewTagDialog
        isOpen={showNewTagDialog}
        onClose={() => setShowNewTagDialog(false)}
        onConfirm={addNewTag}
        newTagName={newTagName}
        onNewTagNameChange={setNewTagName}
      />
    </div>
  );
};

export default FlashcardsPage;