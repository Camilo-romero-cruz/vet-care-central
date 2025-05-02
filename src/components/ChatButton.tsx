
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";

export const ChatButton = () => {
  const { isOpen, toggleChat } = useChat();

  return (
    <button
      aria-label="Open chat"
      onClick={toggleChat}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transition-all duration-300",
        "hover:scale-110 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isOpen && "rotate-90 scale-90 opacity-0 pointer-events-none"
      )}
    >
      <Bot className="h-6 w-6 text-primary-foreground" />
    </button>
  );
};
