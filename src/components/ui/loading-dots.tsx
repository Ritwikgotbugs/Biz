
import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots = ({ className }: LoadingDotsProps) => {
  return (
    <div className={cn("flex items-center space-x-1.5", className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
};

export default LoadingDots;
