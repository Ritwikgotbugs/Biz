
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { saveKnowledgeDocument } from "@/lib/supabase";
import { Upload, FileCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface KnowledgeUploadProps {
  isAdminUpload?: boolean;
  onUploadComplete?: () => void;
  buttonLabel?: string;
}

const KnowledgeUpload: React.FC<KnowledgeUploadProps> = ({ 
  isAdminUpload = false,
  onUploadComplete,
  buttonLabel = "Upload Document"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<any>(null);
  const { isAuthenticated } = useAuth();

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!allowedFileTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, DOC, DOCX, or TXT file.",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      setFileDetails({
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size)
      });
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to upload documents.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real app, you would upload the file to storage
      // For demo purposes, we'll just save metadata to the database
      await saveKnowledgeDocument({
        name: selectedFile.name,
        description: '',
        file_path: `uploads/${selectedFile.name}`, // simulated path
        file_type: selectedFile.type,
        file_size: formatFileSize(selectedFile.size),
        is_admin_document: isAdminUpload
      });
      
      toast({
        title: "Upload Successful",
        description: "Your document has been uploaded successfully."
      });
      
      // Reset form
      setSelectedFile(null);
      setFileDetails(null);
      
      // Trigger callback if provided
      if (onUploadComplete) {
        onUploadComplete();
      }
      
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-lg font-medium mb-4">
        {isAdminUpload ? "Upload Admin Document" : "Upload Document"}
      </h2>
      
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <FileCheck className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">{fileDetails.name}</p>
                <p className="text-sm text-muted-foreground">
                  {fileDetails.size} • {fileDetails.type.split('/')[1].toUpperCase()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => { setSelectedFile(null); setFileDetails(null); }}
                disabled={isUploading}
              >
                Change File
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={isUploading || !isAuthenticated}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            
            {!isAuthenticated && (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-800 p-3 rounded-md text-sm mt-4">
                <AlertCircle className="h-4 w-4" />
                <p>Please login to upload documents.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary-50 rounded-full">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">PDF, DOC, DOCX or TXT (max 10MB)</p>
              </div>
            </div>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            />
            <label htmlFor="file-upload">
              <Button 
                variant="outline" 
                className="cursor-pointer" 
                onClick={() => document.getElementById('file-upload')?.click()}
                asChild
              >
                <span>{buttonLabel}</span>
              </Button>
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export default KnowledgeUpload;
