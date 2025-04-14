import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, Paperclip, Bot, User, Image, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import LoadingDots from "@/components/ui/loading-dots";
import { Badge } from "@/components/ui/badge";

// Message type
interface Message {
  id: string;
  content: string;
  role: "user" | "bot";
  timestamp: Date;
  attachments?: Attachment[];
}

// Attachment type
interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
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
  const [userUploads, setUserUploads] = useState<Attachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const preventAutoScroll = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      
      // Create attachment object
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size)
      };
      
      // Add to attachments
      setAttachments(prev => [...prev, newAttachment]);
      
      // In a real app, you'd upload this file to your backend
      toast.success(`"${file.name}" added to your message`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsSending(true);
    
    try {
      // Show typing indicator with loading state
      const response = await ChatService.askQuestion(input, userUploads);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "bot",
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
    if (!preventAutoScroll.current && endOfMessagesRef.current && messages.length > 1) {
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
                  
                  {/* Display attachments if any */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <div 
                          key={attachment.id} 
                          className="flex items-center gap-2 bg-white/10 p-2 rounded-md"
                        >
                          <File className="h-4 w-4" />
                          <span className="text-xs truncate">{attachment.name}</span>
                          <span className="text-xs opacity-70">{attachment.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
        {/* Display selected attachments */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <Badge 
                key={attachment.id} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                <File className="h-3 w-3" />
                <span className="text-xs truncate max-w-[150px]">{attachment.name}</span>
                <button 
                  onClick={() => removeAttachment(attachment.id)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about startup requirements, legal compliances, or sector-specific regulations..."
            className="resize-none"
            rows={2}
          />
          <div className="flex flex-col gap-2 self-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10"
                  >
                    <Paperclip className="h-4 w-4" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach a file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              onClick={handleSendMessage}
              disabled={(!input.trim() && attachments.length === 0) || isSending}
              className="h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Your chatbot is connected to your personal knowledge base and will provide personalized guidance based on your business information.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
