
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Edit2, X } from "lucide-react";

interface MessageInputProps {
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  editingMessageId: string | null;
  onCancelEdit: () => void;
  isDisabled: boolean;
}

export function MessageInput({ 
  messageInput, 
  onMessageInputChange, 
  onSendMessage, 
  editingMessageId, 
  onCancelEdit,
  isDisabled 
}: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-3 md:p-4 border-t bg-card/50 backdrop-blur-sm">
      {editingMessageId && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-2 text-sm text-blue-700">
          <Edit2 className="h-4 w-4" />
          <span>Editing message</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            className="ml-auto p-1 h-auto text-blue-600 hover:text-blue-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <Button variant="ghost" size="icon" className="flex-shrink-0 hover:bg-accent hidden md:inline-flex">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Input 
          className="flex-1 bg-background" 
          placeholder={editingMessageId ? "Edit your message..." : "Type your message..."} 
          value={messageInput}
          onChange={(e) => onMessageInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          size="icon" 
          className="flex-shrink-0"
          onClick={onSendMessage}
          disabled={!messageInput.trim() || isDisabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
