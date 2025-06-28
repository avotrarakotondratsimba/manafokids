import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { VoiceRecorder } from '@/components/messageCanal/VoiceRecorder';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendVoiceMessage?: (audioBlob: Blob, duration: number) => void;
  isLoading?: boolean;
}

const ChatInput = ({ onSendMessage, onSendVoiceMessage, isLoading = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceMessage = (audioBlob: Blob, duration: number) => {
    if (onSendVoiceMessage) {
      onSendVoiceMessage(audioBlob, duration);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Tapez votre message..."
              disabled={isLoading}
              className="min-h-[48px] max-h-32 resize-none pr-12 border-border/50 focus:border-primary/50 transition-colors"
              rows={1}
            />
          </div>
          
          <div className="flex items-center gap-2">
            {onSendVoiceMessage && (
              <div className="relative">
                <VoiceRecorder onSendVoiceMessage={handleVoiceMessage} />
              </div>
            )}
            
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isLoading}
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;