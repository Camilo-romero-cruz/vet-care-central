
import { create } from "zustand";

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
};

interface ChatStore {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  apiKey: string | null;
  toggleChat: () => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  setApiKey: (key: string) => void;
}

export const useChat = create<ChatStore>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  apiKey: localStorage.getItem("deepseek-api-key") || null,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          ...message,
        },
      ],
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setApiKey: (key) => {
    localStorage.setItem("deepseek-api-key", key);
    set({ apiKey: key });
  },
}));
