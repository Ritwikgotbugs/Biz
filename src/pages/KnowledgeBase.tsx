import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import KnowledgeUpload from "@/components/knowledge-base/KnowledgeUpload";
import SectorKnowledgeBase from "@/components/knowledge-base/SectorKnowledgeBase";
import HeaderComponent from "@/components/layout/Header";
import FooterComponent from "@/components/layout/Footer";
import { 
  Lightbulb, 
  BookOpenCheck, 
  FileQuestion, 
  Settings, 
  Users, 
  Lock, 
  Unlock, 
  FileText,
  BookOpen,
  Trash
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getKnowledgeDocuments } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState("my-documents");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: ""
  });
  
  // Use React Query for fetching documents
  const { 
    data: documentData, 
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: ['documents', isAdmin],
    queryFn: async () => {
      // Get user documents
      const userDocs = await getKnowledgeDocuments(false);
      let adminDocs = [];
      
      // If admin, also get admin documents
      if (isAdmin) {
        const { data: adminData, error } = await supabase
          .from('knowledge_documents')
          .select('*')
          .eq('is_admin_document', true)
          .order('created_at', { ascending: false });
          
        if (!error && adminData) {
          adminDocs = adminData;
        }
      }
      
      return { 
        userDocuments: userDocs,
        adminDocuments: adminDocs
      };
    },
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple admin credentials check
    if (adminCredentials.username === "admin" && adminCredentials.password === "admin123") {
      setIsAdmin(true);
      setLoginDialogOpen(false);
      toast({
        title: "Admin Login Successful",
        description: "You now have access to all knowledge base documents."
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: "You are now viewing the user knowledge base."
    });
  };
  
  const handleDeleteDocument = async (id: string, isAdminDoc = false) => {
    try {
      const { error } = await supabase
        .from('knowledge_documents')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Document Deleted",
        description: "The document was successfully deleted."
      });
      
      // Refresh document list
      refetchDocuments();
      
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the document.",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleAdminStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('knowledge_documents')
        .update({ is_admin_document: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Document is now ${!currentStatus ? 'an admin' : 'a regular'} document.`
      });
      
      // Refresh document list
      refetchDocuments();
      
    } catch (error) {
      console.error("Error updating document status:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the document status.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
            <p className="text-muted-foreground max-w-3xl">
              Access comprehensive information and upload your business documents to enhance your AI chatbot experience with personalized assistance.
            </p>
          </div>
          
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <Unlock className="h-3 w-3 mr-1" />
                Admin Mode
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          ) : (
            <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Admin Login</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Admin Login</DialogTitle>
                  <DialogDescription>
                    Enter your credentials to access admin features.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={adminCredentials.username}
                      onChange={e => setAdminCredentials({...adminCredentials, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={adminCredentials.password}
                      onChange={e => setAdminCredentials({...adminCredentials, password: e.target.value})}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Login</Button>
                  </DialogFooter>
                  <div className="text-xs text-muted-foreground mt-2">
                    <p>For demo purposes: Username: admin, Password: admin123</p>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="my-documents" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>My Documents</span>
            </TabsTrigger>
            <TabsTrigger value="sector-knowledge" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Sector Knowledge</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin-documents" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Admin Documents</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="my-documents">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <KnowledgeUpload onUploadComplete={refetchDocuments} />
                
                {/* User Documents List */}
                {isLoadingDocuments ? (
                  <div className="mt-6 text-center py-10">Loading your documents...</div>
                ) : (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Your Documents</h3>
                    {documentData?.userDocuments && documentData.userDocuments.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {documentData.userDocuments.map((doc: any) => (
                          <div key={doc.id} className="bg-white p-4 rounded-lg border">
                            <div className="flex justify-between items-start">
                              <div className="flex gap-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                                <div>
                                  <h3 className="font-medium mb-1">{doc.name}</h3>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {doc.file_size || "Unknown size"} • {doc.file_type?.split('/')[1]?.toUpperCase() || "FILE"}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button variant="outline" size="sm">View</Button>
                              {isAdmin && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleToggleAdminStatus(doc.id, !!doc.is_admin_document)}
                                >
                                  {doc.is_admin_document ? "Remove Admin" : "Make Admin"}
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteDocument(doc.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 border rounded-lg bg-slate-50">
                        <p className="text-muted-foreground">You haven't uploaded any documents yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* How It Works */}
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <h3 className="font-semibold">How It Works</h3>
                  </div>
                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full h-5 w-5 text-xs text-primary font-medium mt-0.5">1</span>
                      <span>Upload your business documents to your knowledge base</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full h-5 w-5 text-xs text-primary font-medium mt-0.5">2</span>
                      <span>Add documents to your AI knowledge base using the "Add to KB" button</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full h-5 w-5 text-xs text-primary font-medium mt-0.5">3</span>
                      <span>Chat with our AI assistant to get personalized guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full h-5 w-5 text-xs text-primary font-medium mt-0.5">4</span>
                      <span>Receive tailored answers based on your specific documents and situation</span>
                    </li>
                  </ol>
                </div>
                
                {/* Tips */}
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpenCheck className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Recommended Documents</h3>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Company Incorporation Certificate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Business Plan & Financial Projections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Tax Registration Documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Compliance Reports & Legal Agreements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>Licenses & Permits</span>
                    </li>
                  </ul>
                </div>
                
                {/* FAQ */}
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <FileQuestion className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">FAQ</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium mb-1">What file types are supported?</p>
                      <p className="text-muted-foreground">PDF, DOC, DOCX, and TXT files up to 10MB.</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Is my data secure?</p>
                      <p className="text-muted-foreground">Yes, all documents are encrypted and only accessible to you.</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Can I delete documents later?</p>
                      <p className="text-muted-foreground">Yes, you can remove documents from your knowledge base at any time.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sector-knowledge">
            <SectorKnowledgeBase />
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="admin-documents">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3 items-start">
                  <Users className="h-5 w-5 text-amber-500 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Admin Document Management</h3>
                    <p className="text-sm text-muted-foreground">
                      These documents are accessible only to administrators and provide the AI chatbot with general knowledge about startups, regulations, and industry information.
                    </p>
                  </div>
                </div>
              </div>
              
              {isLoadingDocuments ? (
                <div className="text-center py-10">Loading admin documents...</div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {documentData?.adminDocuments && documentData.adminDocuments.length > 0 ? (
                    documentData.adminDocuments.map((doc: any) => (
                      <div key={doc.id} className="bg-white p-4 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <FileText className="h-6 w-6 text-blue-600" />
                            <div>
                              <h3 className="font-medium mb-1">{doc.name}</h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                {doc.file_size || "Unknown size"} • {doc.file_type?.split('/')[1]?.toUpperCase() || "FILE"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">View</Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleAdminStatus(doc.id, true)}
                          >
                            Remove Admin
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteDocument(doc.id, true)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 border rounded-lg bg-slate-50 col-span-3">
                      <p className="text-muted-foreground">No admin documents available.</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6">
                <KnowledgeUpload 
                  isAdminUpload={true} 
                  onUploadComplete={refetchDocuments}
                  buttonLabel="Upload New Admin Document"
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default KnowledgeBase;
