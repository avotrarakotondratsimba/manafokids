import { motion } from 'framer-motion';
import { useState } from 'react';
import { MoreHorizontal, Edit3, Trash2, Play, Pause } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore, type Message as MessageType } from '@/store/chatStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageProps {
  message: MessageType;
  isOwn: boolean;
}

export function Message({ message, isOwn }: MessageProps) {
  const { deleteMessage, editMessage, toggleEditMessage } = useChatStore();
  const [editContent, setEditContent] = useState(message.content);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      editMessage(message.id, editContent.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditContent(message.content);
      toggleEditMessage(message.id);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const playVoiceMessage = () => {
    if (message.audioUrl) {
      const audio = new Audio(message.audioUrl);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex gap-3 p-3 rounded-lg hover:bg-accent/30 transition-all duration-200 message-appear ${
        isOwn ? 'flex-row-reverse' : ''
      }`}
    >
      <Avatar name={message.author.name} size="md" />
      
      <div className={`flex-1 min-w-0 ${isOwn ? 'text-right' : ''}`}>
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="font-semibold text-sm text-foreground">
            {message.author.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {message.isEditing ? (
          <div className="space-y-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSaveEdit}
              autoFocus
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Appuyez sur Entrée pour enregistrer • Échap pour annuler
            </p>
          </div>
        ) : (
          <div>
            {message.type === 'text' ? (
              <p className="text-sm text-foreground leading-relaxed">
                {message.content}
              </p>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/50 w-fit max-w-xs"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playVoiceMessage}
                  className="h-8 w-8 rounded-full bg-primary/20 hover:bg-primary/30"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1 bg-muted rounded-full flex-1">
                      <div className="h-full bg-primary rounded-full w-1/3"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {message.duration || 5}s
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {isOwn && !message.isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => toggleEditMessage(message.id)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteMessage(message.id)}
              className="flex items-center gap-2 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </motion.div>
  );
}