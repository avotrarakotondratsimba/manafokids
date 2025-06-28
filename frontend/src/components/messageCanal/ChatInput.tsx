import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceRecorder } from './VoiceRecorder';
import { useChatStore } from '@/store/chatStore';

export function ChatInput() {
  const [message, setMessage] = useState('');
  const { addMessage, currentUser, activeChannelId } = useChatStore() as unknown as { 
    addMessage: any; 
    currentUser: any; 
    activeChannelId: string; // or the correct type
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      addMessage({
        content: message.trim(),
        type: 'text',
        author: currentUser,
        channelId: activeChannelId
      });
      setMessage('');
    }
  };

  const handleSendVoiceMessage = (audioBlob: Blob, duration: number) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    addMessage({
      content: 'Message vocal',
      type: 'voice',
      author: currentUser,
      channelId: activeChannelId,
      audioUrl,
      duration
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-t border-border/50 bg-card/30 backdrop-blur-md"
    >
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Écrivez votre message..."
            className="w-full pr-12 py-3 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-200"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all duration-200"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        <div className="relative">
          <VoiceRecorder onSendVoiceMessage={handleSendVoiceMessage} />
        </div>
      </div>
    </motion.div>
  );
}