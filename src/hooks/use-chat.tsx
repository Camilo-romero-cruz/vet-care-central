
import { create } from "zustand";

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
};

// Default API key
const DEFAULT_API_KEY = "sk-cfacd9a871164ae09d2ab64f81bfc943";

interface ChatStore {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  apiKey: string;
  toggleChat: () => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  setApiKey: (key: string) => void;
}

export const useChat = create<ChatStore>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  apiKey: localStorage.getItem("deepseek-api-key") || DEFAULT_API_KEY,
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
