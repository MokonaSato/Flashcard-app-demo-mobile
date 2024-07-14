import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, PlusCircle, ChevronLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoadingSpinner from './common/LoadingSpinner';
import ErrorDisplay from './common/ErrorDisplay';
import { Tag, Word }from '../types';


const TagListPage: React.FC = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteTag, setDeleteTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState<string>('');
  const [showNewTagDialog, setShowNewTagDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchTags = localStorage.getItem('tags')
        if(fetchTags){
          setTags(JSON.parse(fetchTags));
        }
        const fetchWords = localStorage.getItem('words')
        if(fetchWords){
          setWords(JSON.parse(fetchWords));
        }
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getWordCountForTag = (tagId: number): number => {
    return words.filter(word => word.tagIds.includes(tagId)).length;
  };

  const startEditing = (tag: Tag) => {
    setEditingTag({ ...tag });
    setNewTagName(tag.name);
  };

  const saveEdit = async () => {
    if (newTagName.trim() !== '' && editingTag) {
      try {
        const editingTags = tags.map(tag => tag.id === editingTag.id ? { ...tag, name: newTagName.trim() } : tag)
        localStorage.setItem('tags', JSON.stringify(editingTags))
        setTags(editingTags);
        setEditingTag(null);
        setNewTagName('');
      } catch (error) {
        console.error('Error updating tag:', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setNewTagName('');
  };

  const confirmDelete = (tag: Tag) => {
    setDeleteTag(tag);
  };

  const executeDelete = async () => {
    if (deleteTag) {
      try {
        const deleteTags = tags.filter(tag => tag.id !== deleteTag.id)
        // await axios.delete(`${API_BASE_URL}/tags/${deleteTag.id}`);
        localStorage.setItem('tags', JSON.stringify(deleteTags))
        setTags(tags.filter(tag => tag.id !== deleteTag.id));
        setDeleteTag(null);
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteTag(null);
  };

  const addNewTag = async () => {
    if (newTagName.trim()) {
      try {
        const newTags = [...tags, { id: tags.length + 1 ,name: newTagName.trim() }]
        localStorage.setItem('tags', JSON.stringify(newTags))
        setTags(newTags);
        setNewTagName('');
        setShowNewTagDialog(false);
      } catch (error) {
        console.error('Error adding new tag:', error);
      }
    }
  };

  const goToSubjectList = () => {
    navigate('/');
  };

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <ErrorDisplay message={error}/>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <div className="flex items-center mb-4">
        <Button onClick={goToSubjectList} variant="ghost" size="sm" className="mr-2">
          <ChevronLeft size={16} />
        </Button>
        <h1 className="text-xl font-bold">タグ一覧</h1>
      </div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowNewTagDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新しいタグを追加
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <Card key={tag.id} className="shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {editingTag && editingTag.id === tag.id ? (
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full"
                />
              ) : (
                <CardTitle className='text-xl'>{tag.name}</CardTitle>
              )}
              <Badge variant="secondary">{getWordCountForTag(tag.id)}単語</Badge>
            </CardHeader>
            <CardContent>
              {editingTag && editingTag.id === tag.id ? (
                <div className="flex justify-end space-x-2">
                  <Button onClick={saveEdit} size="sm">保存</Button>
                  <Button onClick={cancelEdit} variant="outline" size="sm">キャンセル</Button>
                </div>
              ) : (
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => startEditing(tag)} variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button onClick={() => confirmDelete(tag)} variant="ghost" size="sm">
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteTag !== null} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>タグの削除</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTag && `「${deleteTag.name}」を本当に削除しますか？このタグが付いている単語からタグが削除されます。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showNewTagDialog} onOpenChange={setShowNewTagDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>新しいタグを作成</AlertDialogTitle>
            <AlertDialogDescription>
              新しいタグの名前を入力してください。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="新しいタグ名"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowNewTagDialog(false)}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={addNewTag}>作成</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TagListPage;