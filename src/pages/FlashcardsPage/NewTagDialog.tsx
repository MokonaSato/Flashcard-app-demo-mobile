import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewTagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newTagName: string;
  onNewTagNameChange: (value: string) => void;
}

const NewTagDialog: React.FC<NewTagDialogProps> = ({ isOpen, onClose, onConfirm, newTagName, onNewTagNameChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新規タグの作成</DialogTitle>
          <DialogDescription>
            新しいタグの名前を入力してください。
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="新しいタグ名"
          value={newTagName}
          onChange={(e) => onNewTagNameChange(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={onConfirm}>作成</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTagDialog;