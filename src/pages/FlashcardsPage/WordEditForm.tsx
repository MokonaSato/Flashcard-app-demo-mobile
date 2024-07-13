import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Word, Tag } from '../../types'

interface WordEditFormProps {
  newWord: string;
  newMeaning: string;
  newTags: number[];
  tags: Tag[];
  selectedWord: Word | null;
  onWordChange: (value: string) => void;
  onMeaningChange: (content: string) => void;
  onTagsChange: (tagId: number) => void;
  onAddWord: () => void;
  onUpdateWord: () => void;
  onResetForm: () => void;
  onShowNewTagDialog: () => void;
}

const WordEditForm: React.FC<WordEditFormProps> = ({
  newWord,
  newMeaning,
  newTags,
  tags,
  selectedWord,
  onWordChange,
  onMeaningChange,
  onTagsChange,
  onAddWord,
  onUpdateWord,
  onResetForm,
  onShowNewTagDialog
}) => {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'background': ['yellow', 'green', 'blue', 'red', 'white'] }],
    ],
  };

  return (
    <div className="w-3/5 pl-4 flex flex-col">
      <Input
        type="text"
        placeholder="単語"
        value={newWord}
        onChange={(e) => onWordChange(e.target.value)}
        className="mb-2"
      />
      <div className="flex-grow mb-2 bg-white" style={{ height: '100%' }}>
        <ReactQuill
          theme="snow"
          value={newMeaning}
          onChange={onMeaningChange}
          modules={modules}
          style={{ height: '93%' }}
        />
      </div>
      <div className="mb-2 flex flex-wrap items-center">
        {tags.map(tag => (
          <Badge
            key={tag.id}
            variant={newTags.includes(tag.id) ? "default" : "outline"}
            className={newTags.includes(tag.id) ? "mr-1 mb-1 cursor-pointer" : "mr-1 mb-1 cursor-pointer border-black bg-white"}
            onClick={() => onTagsChange(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
        <Button variant="outline" size="sm" onClick={onShowNewTagDialog} className='border-black'>
          新規タグ
        </Button>
      </div>
      <div>
        {selectedWord ? (
          <Button onClick={onUpdateWord} className="mr-2">更新</Button>
        ) : (
          <Button onClick={onAddWord} className="mr-2">追加</Button>
        )}
        <Button onClick={onResetForm} variant="outline" className='border-black'>キャンセル</Button>
      </div>
    </div>
  );
};

export default WordEditForm;