
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/services/chat-service";
import { X, Send, Bot, Loader2, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";

export const ChatWindow = () => {
  const { isOpen, messages, addMessage, isLoading, setLoading, apiKey, setApiKey, toggleChat } = useChat();
  const [input, setInput] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false); // Changed to false since we have a default key
  const [apiKeyInput, setApiKeyInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }
    
    const userMessage = { role: "user" as const, content: input };
    addMessage(userMessage);
    setInput("");
    setLoading(true);
    
    try {
      const allMessages = [
        ...messages, 
        { id: "temp", role: "user", content: input, timestamp: Date.now() }
      ];
      
      const response = await sendMessage(allMessages, apiKey);
      addMessage({ role: "assistant", content: response });
    } catch (error: any) {
      toast.error("Error: " + (error.message || "Failed to send message"));
      
      if (error.message?.includes("API key")) {
        setShowApiKeyInput(true);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Save API key
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput);
      setShowApiKeyInput(false);
      toast.success("API key saved successfully");
    }
  };
  
  // Scroll to bottom when new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md md:max-w-lg h-[500px] rounded-lg shadow-xl bg-background border border-border flex flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-medium">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={toggleChat}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && !showApiKeyInput && (
          <div className="text-center text-muted-foreground p-6">
            <Bot className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>How can I assist you today?</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[80%] rounded-lg p-3",
              message.role === "user"
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted"
            )}
          >
            {message.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="bg-muted rounded-lg p-3 max-w-[80%] flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>
      
      {/* API key input */}
      {showApiKeyInput && (
        <div className="p-4 border-t">
          <div className="mb-2 text-sm">
            <p>Please enter your DeepSeek API key to continue:</p>
          </div>
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk-..."
              className="flex-1"
            />
            <Button onClick={handleSaveApiKey}>Save</Button>
          </div>
        </div>
      )}
      
      {/* Message input */}
      {!showApiKeyInput && (
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      )}
    </div>
  );
};
