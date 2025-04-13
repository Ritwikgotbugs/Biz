
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, Paperclip, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import LoadingDots from "@/components/ui/loading-dots";

// Message type
interface Message {
  id: string;
  content: string;
  role: "user" | "bot";
  timestamp: Date;
}

// Mock data service for chat
const ChatService = {
  askQuestion: async (question: string, userUploads: any[]): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Handle different types of questions with tailored responses
    if (question.toLowerCase().includes("document") || question.toLowerCase().includes("missing")) {
      return "Based on your uploaded documents, you still need to complete your GST registration. I also notice you haven't uploaded your company PAN card yet, which is required for tax filings.";
    }
    
    if (question.toLowerCase().includes("tax") || question.toLowerCase().includes("gst")) {
      return "For your tech startup, you'll need to register for GST if your annual turnover exceeds ₹20 lakhs. The current GST rate for most software services is 18%. I recommend filing returns quarterly using Form GSTR-1 and GSTR-3B.";
    }
    
    if (question.toLowerCase().includes("funding") || question.toLowerCase().includes("investor")) {
      return "For early-stage funding, you'll need these documents: Business plan, Financial projections, Company incorporation certificate, Shareholders agreement template, and DPIIT registration if you want to be recognized as a startup.";
    }
    
    if (question.toLowerCase().includes("register") || question.toLowerCase().includes("incorporation")) {
      return "To incorporate your company, you'll need: 1) Digital signatures for all directors, 2) Director Identification Numbers (DIN), 3) Proposed company name, 4) Address proof for registered office, 5) Identity/Address proof of all directors, 6) MOA and AOA documents. The process takes approximately 10-15 days.";
    }
    
    // Default response
    return "I've analyzed your query and the documents you've uploaded. For your specific business type, you'll need to ensure compliance with the Companies Act, 2013 and file annual returns with the MCA. If you need specific guidance on any particular regulation, please let me know!";
  }
};

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your StartKaro assistant. How can I help with your startup journey today?",
      role: "bot",
      timestamp: new Date()
    }
  ]);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [userUploads, setUserUploads] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const preventAutoScroll = useRef(false);
  
  // Fetch knowledge base data
  const { data: knowledgeData, isLoading: isLoadingKnowledge } = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        documents: [
          { id: '1', name: 'user_profile.pdf', type: 'application/pdf', size: '1.2 MB' },
          { id: '2', name: 'compliance_report.pdf', type: 'application/pdf', size: '2.5 MB' },
          { id: '3', name: 'business_plan.pdf', type: 'application/pdf', size: '3.1 MB' }
        ]
      };
    },
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // In a real app, you'd upload this file to your backend
      toast.success(`"${file.name}" added to your knowledge base`);
      
      // Mock adding to uploads
      setUserUploads((prev: any) => [...prev, {
        id: Date.now().toString(),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type
      }]);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user" as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    
    try {
      // Show typing indicator with loading state
      const response = await ChatService.askQuestion(input, userUploads);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "bot" as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      if (isFirstMessage) {
        setIsFirstMessage(false);
      }
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!preventAutoScroll.current && endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
    preventAutoScroll.current = false;
  }, [messages]);

  // Handle scroll events to prevent jumping when user is scrolling up
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isScrolledNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      preventAutoScroll.current = !isScrolledNearBottom;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between bg-primary text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <h2 className="text-lg font-semibold">StartKaro Assistant</h2>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-primary-foreground/10">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Paperclip className="h-5 w-5" />
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload documents to your knowledge base</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main chat area with messages */}
      <ScrollArea 
        className="flex-1 p-4 overflow-auto" 
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "bot" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {message.role === "bot" ? "Assistant" : "You"}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl p-4 bg-muted">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="h-4 w-4" />
                  <span className="font-medium">Assistant</span>
                </div>
                <LoadingDots />
              </div>
            </div>
          )}

          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>

      {/* Input area for user messages */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about startup requirements, legal compliances, or sector-specific regulations..."
            className="resize-none"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isSending}
            className="self-end"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Your chatbot is connected to your personal knowledge base and will provide personalized guidance based on your business information.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
