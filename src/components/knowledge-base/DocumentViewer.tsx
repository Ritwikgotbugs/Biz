import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
  dateUploaded?: string;
  category?: string;
  preview?: string;
}

interface DocumentViewerProps {
  document: Document | null;
}

const DocumentViewer = ({ document }: DocumentViewerProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document) {
      setLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [document]);

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No document selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="animate-pulse">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <p className="mt-4 text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  // If the document has a URL, display it in an iframe
  if (document.url) {
    return (
      <div className="w-full h-full">
        <iframe
          src={document.url}
          className="w-full h-[70vh] border-0"
          title={document.name}
        />
      </div>
    );
  }

  // Fallback for documents without URLs
  return (
    <div className="p-6">
      <div className="prose max-w-none">
        <h1 className="text-2xl font-bold mb-4">{document.name}</h1>
        <p className="text-muted-foreground">{document.description}</p>
        <div className="mt-4">
          <p><strong>Type:</strong> {document.type}</p>
          <p><strong>Size:</strong> {document.size}</p>
          {document.category && <p><strong>Category:</strong> {document.category}</p>}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
