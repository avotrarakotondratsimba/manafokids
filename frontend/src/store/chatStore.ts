import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'voice';
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
  isEditing?: boolean;
  audioUrl?: string;
  duration?: number;
}

interface ChatState {
  messages: Message[];
  currentUser: {
    id: string;
    name: string;
    avatar: string;
  };
  isRecording: boolean;
  recordingDuration: number;
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, content: string) => void;
  toggleEditMessage: (messageId: string) => void;
  setRecording: (isRecording: boolean) => void;
  setRecordingDuration: (duration: number) => void;
}

// Mock data
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Salut tout le monde ! 👋',
    type: 'text',
    author: {
      id: '2',
      name: 'Alice Martin',
      avatar: 'AM'
    },
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    content: 'Comment ça va aujourd\'hui ?',
    type: 'text',
    author: {
      id: '3',
      name: 'Bob Johnson',
      avatar: 'BJ'
    },
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: '3',
    content: 'Bienvenue dans notre espace de discussion !',
    type: 'text',
    author: {
      id: '4',
      name: 'Clara Dupuis',
      avatar: 'CD'
    },
    timestamp: new Date(Date.now() - 900000)
  }
];

export const useChatStore = create<ChatState>((set, get) => ({
  messages: mockMessages,
  currentUser: {
    id: '1',
    name: 'Vous',
    avatar: 'V'
  },
  isRecording: false,
  recordingDuration: 0,

  addMessage: (messageData) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  },

  deleteMessage: (messageId: string) => {
    set((state) => ({
      messages: state.messages.filter(m => m.id !== messageId)
    }));
  },

  editMessage: (messageId: string, content: string) => {
    set((state) => ({
      messages: state.messages.map(m => 
        m.id === messageId 
          ? { ...m, content, isEditing: false }
          : m
      )
    }));
  },

  toggleEditMessage: (messageId: string) => {
    set((state) => ({
      messages: state.messages.map(m => 
        m.id === messageId 
          ? { ...m, isEditing: !m.isEditing }
          : { ...m, isEditing: false }
      )
    }));
  },

  setRecording: (isRecording: boolean) => {
    set({ isRecording });
    if (!isRecording) {
      set({ recordingDuration: 0 });
    }
  },

  setRecordingDuration: (duration: number) => {
    set({ recordingDuration: duration });
  }
}));