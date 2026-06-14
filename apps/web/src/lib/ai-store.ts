import { create } from 'zustand';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  title: string;
  contextType?: string;
  contextId?: string;
  messages: AiMessage[];
}

interface AiState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  togglePanel: () => void;
  
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  
  messages: AiMessage[];
  setMessages: (messages: AiMessage[]) => void;
  addMessage: (message: AiMessage) => void;
  
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
}

export const useAiStore = create<AiState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  
  activeConversationId: null,
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  
  isTyping: false,
  setIsTyping: (isTyping) => set({ isTyping }),
}));
