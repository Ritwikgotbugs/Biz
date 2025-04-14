import ChatInterface from "@/components/chatbot/ChatInterface";
import { useLayoutEffect, useRef } from "react";

const Chatbot = () => {
  // Ref to scroll to top on mount
  const containerRef = useRef<HTMLDivElement>(null);

  // Use useLayoutEffect instead of useEffect to ensure scrolling happens before render
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen" ref={containerRef}>
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">StartKaro AI Assistant</h1>
            <p className="text-muted-foreground mb-6">
              Get personalized guidance for your startup journey based on your documents and profile.
            </p>
            
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chatbot;
