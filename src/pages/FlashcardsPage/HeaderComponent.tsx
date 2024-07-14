import { Button } from '@/components/ui/button';
import { ChevronLeft, Filter, SortAsc } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterOption = 'all' | 'marked' | 'unmarked';
type SortOption = 'word-asc' | 'word-desc' | 'createdAt-asc' | 'createdAt-desc';

interface HeaderComponentProps {
  subjectName: string;
  onNavigateBack: () => void;
  onFilterChange: (filter: FilterOption) => void;
  onSortChange: (sort: SortOption) => void;
  onNewWord: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ 
  subjectName, 
  onNavigateBack, 
  onFilterChange, 
  onSortChange, 
  onNewWord 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Button onClick={onNavigateBack} variant="ghost" size="sm" className="mr-2">
          <ChevronLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold">{subjectName}</h1>
      </div>
      <div className="flex justify-end items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-black">
              <Filter size={16} className="mr-2" />
              フィルター
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onFilterChange('all')}>
              すべて表示
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('marked')}>
              マーク済みのみ
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('unmarked')}>
              未マークのみ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-black">
              <SortAsc size={16} className="mr-2" />
              ソート
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSortChange('word-asc')}>
              単語名（昇順）
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('word-desc')}>
              単語名（降順）
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('createdAt-asc')}>
              作成日時（古い順）
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('createdAt-desc')}>
              作成日時（新しい順）
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onNewWord}>新規作成</Button>
      </div>
    </div>
  );
};

export default HeaderComponent;