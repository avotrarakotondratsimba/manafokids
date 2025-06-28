import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useChatStore } from '@/store/chatStore';

interface VoiceRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob, duration: number) => void;
}

export function VoiceRecorder({ onSendVoiceMessage }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);
      
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRecording]);

  const sendVoiceMessage = useCallback(() => {
    if (audioBlob) {
      onSendVoiceMessage(audioBlob, duration);
      setAudioBlob(null);
      setDuration(0);
    }
  }, [audioBlob, duration, onSendVoiceMessage]);

  const cancelRecording = useCallback(() => {
    setAudioBlob(null);
    setDuration(0);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (audioBlob) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 p-2 bg-card/50 rounded-lg border border-border/50"
      >
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-foreground">
            Message vocal • {formatDuration(duration)}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={cancelRecording}
          className="h-8 w-8"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={sendVoiceMessage}
          className="h-8 w-8 bg-primary hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        size="icon"
        variant={isRecording ? "destructive" : "ghost"}
        onClick={isRecording ? stopRecording : startRecording}
        className={`h-10 w-10 rounded-full transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'hover:bg-primary/10'
        }`}
      >
        {isRecording ? (
          <Square className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-foreground bg-card/80 px-2 py-1 rounded-md backdrop-blur-sm"
        >
          {formatDuration(duration)}
        </motion.div>
      )}
    </motion.div>
  );
}