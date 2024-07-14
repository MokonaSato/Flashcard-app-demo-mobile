import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Subject } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2, Tag } from 'lucide-react';
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

const SubjectListPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteSubject, setDeleteSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSubjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = localStorage.getItem('subjects')
        if (res){
          setSubjects(JSON.parse(res));
        }
      } catch (err) {
        setError('Failed to fetch subjects. Please try again later.');
        console.error('Error fetching subjects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    getSubjects();
  }, []);

  const addNewSubject = async () => {
    const newSubject: Subject = { id: subjects.length + 1, name: `新しい科目 ${subjects.length + 1}` };
    try {
      const newSubjects=[...subjects, newSubject]
      localStorage.setItem('subjects', JSON.stringify(newSubjects))
      setSubjects(newSubjects);
    } catch (err) {
      console.error('Error adding new subject:', err);
    }
  };

  const startEditing = (subject: Subject) => {
    setEditingSubject({ ...subject });
  };

  const saveEdit = async () => {
    if (editingSubject) {
      try {
        const editingSubjects = subjects.map(s => s.id === editingSubject.id ? editingSubject : s)
        localStorage.setItem('subjects', JSON.stringify(editingSubjects))
        setSubjects(subjects.map(s => s.id === editingSubject.id ? editingSubject : s));
        setEditingSubject(null);
      } catch (err) {
        console.error('Error updating subject:', err);
      }
    }
  };

  const cancelEdit = () => {
    setEditingSubject(null);
  };

  const confirmDelete = (subject: Subject) => {
    setDeleteSubject(subject);
  };

  const executeDelete = async () => {
    if (deleteSubject) {
      try {
        const deleteSubjects = subjects.filter(s => s.id !== deleteSubject.id)
        localStorage.setItem('subjects', JSON.stringify(deleteSubjects))
        setSubjects(deleteSubjects);
        setDeleteSubject(null);
      } catch (err) {
        console.error('Error deleting subject:', err);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteSubject(null);
  };
  
  const goToTagList = () => {
    navigate('/tag');
  };
  
  const openVocabulary = (subjectId: number) => {
    navigate(`/flashcard/${subjectId}`);
  };

  const startTest = (subjectId: number) => {
    navigate(`/testlist/${subjectId}`);
  };

  if (isLoading) {
    return <LoadingSpinner/>
  }

  if (error) {
    return <ErrorDisplay message={error}/>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">単語帳アプリ</h1>
        <div className="flex justify-end">
          <Button onClick={goToTagList} variant="outline" className='border-black'>
            <Tag className="mr-2 h-4 w-4" />
            タグ一覧
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <Card key={subject.id} className="shadow">
            <CardHeader>
              {editingSubject && editingSubject.id === subject.id ? (
                <Input
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  className="mb-2"
                />
              ) : (
                <CardTitle>{subject.name}</CardTitle>
              )}
            </CardHeader>
            <CardContent>
              {editingSubject && editingSubject.id === subject.id ? (
                <div className="flex justify-end">
                  <Button onClick={saveEdit} className="mr-2" size="sm">保存</Button>
                  <Button onClick={cancelEdit} variant="outline" size="sm">キャンセル</Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-start space-x-2 mb-2">
                    <Button onClick={() => openVocabulary(subject.id)}>単語帳</Button>
                    <Button onClick={() => startTest(subject.id)} variant="outline" className='border-black'>テスト</Button>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => startEditing(subject)} variant="ghost" size="sm" className="mr-2">
                      <Edit size={16} />
                    </Button>
                    <Button onClick={() => confirmDelete(subject)} variant="ghost" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
        <Card className="flex items-center justify-center cursor-pointer shadow" onClick={addNewSubject}>
          <CardContent>
            <div className="text-center">
              <PlusCircle className="mx-auto mb-2" size={24} />
              <p>新しい科目を追加</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteSubject !== null} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>科目の削除</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteSubject && `「${deleteSubject.name}」を本当に削除しますか？「${deleteSubject.name}」の単語帳とテストも削除されます。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubjectListPage;