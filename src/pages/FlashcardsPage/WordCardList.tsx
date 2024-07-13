import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Word, Tag } from '../../types'

interface WordCardListProps {
  words: Word[];
  tags: Tag[];
  onSelectWord: (word: Word) => void;
  onToggleMarkWord: (word: Word) => void;
  onDeleteWord: (id: number) => void;
}

const WordCardList: React.FC<WordCardListProps> = ({ 
  words, 
  tags, 
  onSelectWord, 
  onToggleMarkWord, 
  onDeleteWord 
}) => {
  const truncateContent = (content: string, maxLength: number = 20): string => {
    const strippedContent = content.replace(/<[^>]+>/g, '');
    if (strippedContent.length <= maxLength) return strippedContent;
    return strippedContent.substring(0, maxLength) + '...';
  };

  return (
    <div className="w-2/5 pr-4 overflow-y-auto">
      {words.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          単語カードがありません
        </div>
      ) : (
        words.map(word => (
          <Card key={word.id} className="mb-2 cursor-pointer">
            <CardContent className="p-4 flex justify-between items-start">
              <div onClick={() => onSelectWord(word)} className="flex-grow">
                <p className="font-bold">{word.word}</p>
                <p className="text-sm text-gray-600">{truncateContent(word.meaning)}</p>
                <div className="mt-2">
                  {word.tagIds && word.tagIds.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag && (
                      <Badge key={tagId} variant="secondary" className="mr-1 mb-1">{tag.name}</Badge>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 mt-1">作成日時: {new Date(word.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end ml-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMarkWord(word);
                  }}
                >
                  <Star size={16} fill={word.isMarked ? "gold" : "none"} color={word.isMarked ? "gold" : "currentColor"} />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="mt-2" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteWord(word.id);
                  }}
                >
                  削除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default WordCardList;