
import { Chat } from "@/components/Chat";
import { ThemeProvider } from "@/hooks/use-theme";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Chat App</h1>
          <p className="text-xl text-muted-foreground">Click the button in the bottom right to start chatting!</p>
        </div>
        <Chat />
      </div>
    </ThemeProvider>
  );
};

export default Index;
