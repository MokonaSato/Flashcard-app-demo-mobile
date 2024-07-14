import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Word, Tag } from '../../types';
import NewTagDialog from './NewTagDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';
import { ChevronLeft } from 'lucide-react';

const WordEditPage: React.FC = () => {
  const { subjectId, wordId } = useParams<{ subjectId: string; wordId: string }>();
  const navigate = useNavigate();

  const [word, setWord] = useState<string>('');
  const [meaning, setMeaning] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewTagDialog, setShowNewTagDialog] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchTags();
        if (wordId !== 'new') {
          await fetchWord();
        }
      } catch (err) {
        setError('データの読み込み中にエラーが発生しました。後でもう一度お試しください。');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [wordId, subjectId]);

  const fetchWord = async () => {
    const fetchWords = localStorage.getItem('words');
    if (fetchWords) {
      const parseWords: Word[] = JSON.parse(fetchWords);
      const selectedWord = parseWords.find(w => w.id === Number(wordId) && w.subjectId === Number(subjectId));
      if (selectedWord) {
        setWord(selectedWord.word);
        setMeaning(selectedWord.meaning);
        setSelectedTags(selectedWord.tagIds);
      }
    }
  };

  const fetchTags = async () => {
    const fetchTags = localStorage.getItem('tags');
    if (fetchTags) {
      setTags(JSON.parse(fetchTags));
    }
  };

  const handleSave = async () => {
    try {
      const fetchWords = localStorage.getItem('words');
      let words: Word[] = fetchWords ? JSON.parse(fetchWords) : [];

      if (wordId === 'new') {
        const newWord: Word = {
          id: words.length + 1,
          subjectId: Number(subjectId),
          word: word,
          meaning: meaning,
          tagIds: selectedTags,
          isMarked: false,
          createdAt: new Date().toISOString()
        };
        words.push(newWord);
      } else {
        words = words.map(w => 
          w.id === Number(wordId) && w.subjectId === Number(subjectId)
            ? { ...w, word, meaning, tagIds: selectedTags }
            : w
        );
      }

      localStorage.setItem('words', JSON.stringify(words));
      navigate(`/flashcard/${subjectId}`);
    } catch (error) {
      console.error('Error saving word:', error);
      setError('単語の保存中にエラーが発生しました。');
    }
  };

  const handleBack = () => {
    navigate(`/flashcard/${subjectId}`);
  };

  const handleCancel = () => {
    navigate(`/flashcard/${subjectId}`);
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const addNewTag = async () => {
    if (newTagName.trim()) {
      try {
        const newTag = {
          id: tags.length + 1,
          name: newTagName.trim()
        };
        const updatedTags = [...tags, newTag];
        localStorage.setItem('tags', JSON.stringify(updatedTags));
        setTags(updatedTags);
        setSelectedTags([...selectedTags, newTag.id]);
        setNewTagName('');
        setShowNewTagDialog(false);
      } catch (error) {
        console.error('Error adding new tag:', error);
      }
    }
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'background': ['yellow', 'green', 'blue', 'red', 'white'] }],
    ],
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <div className="flex items-center justify-start mb-4">
        <Button onClick={handleBack} variant="ghost" size="sm" className="flex items-center">
          <ChevronLeft size={16} className="mr-2" />
        </Button>
        <h1 className="text-2xl font-bold">{wordId === 'new' ? '新規単語追加' : '単語編集'}</h1>
      </div>
      <div className="flex flex-col">
        <Input
          type="text"
          placeholder="単語"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="mb-2"
        />
        <div className="mb-2" style={{ height: '350px' }}>
          <ReactQuill
            theme="snow"
            value={meaning}
            onChange={setMeaning}
            modules={modules}
            style={{ height: '100%' }}
          />
        </div>
        <div className="mt-12 mb-2 flex flex-wrap items-center">
          {tags.map(tag => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className={`mr-1 mb-1 cursor-pointer ${selectedTags.includes(tag.id) ? '' : 'border-black bg-white'}`}
              onClick={() => toggleTag(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
          <Button variant="outline" size="sm" onClick={() => setShowNewTagDialog(true)} className='border-black'>
            新規タグ
          </Button>
        </div>
        <div>
          <Button onClick={handleSave} className="mr-2">{wordId === 'new' ? '追加' : '更新'}</Button>
          <Button onClick={handleCancel} variant="outline" className='border-black'>キャンセル</Button>
        </div>
      </div>

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

export default WordEditPage;