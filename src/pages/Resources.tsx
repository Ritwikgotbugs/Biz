import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { downloadBusinessPlanTemplate } from "@/utils/downloadUtils";
import { 
  Calculator, 
  FileText, 
  BookOpen, 
  Download, 
  ExternalLink, 
  CheckCircle2,
  ListChecks,
  Calendar,
  TrendingUp,
  BadgeIndianRupee,
  LibraryBig,
  ClipboardList
} from "lucide-react";

import TaxCalculator from "@/components/resources/TaxCalculator";
import ComplianceGuide from "@/components/resources/ComplianceGuide";
import BlogArticles from "@/components/resources/BlogArticles";

// Create a Button component wrapper that requires authentication
const AuthButton = ({ 
  onClick, 
  children, 
  className = "" 
}: { 
  onClick: () => void; 
  children: React.ReactNode; 
  className?: string;
}) => {
  const { isAuthenticated } = useAuth();
  
  const handleClick = () => {
    if (isAuthenticated) {
      onClick();
    } else {
      toast({
        title: "Authentication Required",
        description: "Please login to access this feature.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 ${className}`}
    >
      {children}
    </button>
  );
};

const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState("tax-calculator");
  const { isAuthenticated } = useAuth();
  
  const handleTemplateDownload = () => {
    if (downloadBusinessPlanTemplate()) {
      toast({
        title: "Download Started",
        description: "Your business plan template is downloading.",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50">
        <div className="bg-primary text-white py-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Startup Resources</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Access essential tools, guides, and information to help your startup succeed
            </p>
          </div>
        </div>
        
        <div className="container mx-auto max-w-6xl px-4 py-12 space-y-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="bg-white rounded-lg p-1 border shadow-sm">
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full h-auto">
                <TabsTrigger 
                  value="tax-calculator" 
                  className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Calculator className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">Tax Calculator</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="compliance-guide" 
                  className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <ListChecks className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">Compliance Guide</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="articles" 
                  className="flex items-center justify-center gap-2 py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <BookOpen className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">Articles & Blog</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="tax-calculator" className="mt-8">
              <TaxCalculator />
            </TabsContent>
            
            <TabsContent value="compliance-guide" className="mt-8">
              <ComplianceGuide />
            </TabsContent>
            
            <TabsContent value="articles" className="mt-8">
              <BlogArticles />
            </TabsContent>
          </Tabs>

          {/* Download Resources Section */}
          <section className="space-y-8">
            <div className="bg-white rounded-lg border shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-8">Download Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Business Plan Template</h3>
                      <p className="text-sm text-muted-foreground">Comprehensive template for your startup</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    A detailed business plan template tailored for Indian startups with sections for market analysis, financials, and compliance.
                  </p>
                  <AuthButton onClick={handleTemplateDownload} className="w-full">
                    <Download className="h-4 w-4 mr-2" /> Download Template
                  </AuthButton>
                </div>
                
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600">
                      <ClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Compliance Checklist</h3>
                      <p className="text-sm text-muted-foreground">Sector-specific requirements</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Detailed compliance checklists for different business sectors with regulatory requirements and deadlines.
                  </p>
                  <AuthButton onClick={() => {
                    toast({
                      title: "Feature Coming Soon",
                      description: "This feature will be available soon.",
                    });
                  }} className="w-full">
                    <Download className="h-4 w-4 mr-2" /> Download Checklist
                  </AuthButton>
                </div>
                
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Market Analysis Reports</h3>
                      <p className="text-sm text-muted-foreground">Industry insights and trends</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Detailed market analysis reports for major industry sectors in India including growth projections.
                  </p>
                  <AuthButton onClick={() => {
                    toast({
                      title: "Feature Coming Soon",
                      description: "This feature will be available soon.",
                    });
                  }} className="w-full">
                    <Download className="h-4 w-4 mr-2" /> Download Reports
                  </AuthButton>
                </div>
              </div>
            </div>
          </section>
          
          {/* External Resources Section */}
          <section className="space-y-8">
            <div className="bg-white rounded-lg border shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-8">External Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
                      <BadgeIndianRupee className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Startup India</h3>
                      <p className="text-sm text-muted-foreground">Government Initiative</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Access benefits, incentives and resources from the Startup India government initiative.
                  </p>
                  <a 
                    href="https://www.startupindia.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-red-100 rounded-lg text-red-600">
                      <LibraryBig className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Ministry of Corporate Affairs</h3>
                      <p className="text-sm text-muted-foreground">Government Portal</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Official resource for company registration, filing returns and regulatory compliance.
                  </p>
                  <a 
                    href="https://www.mca.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-teal-100 rounded-lg text-teal-600">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">DPIIT</h3>
                      <p className="text-sm text-muted-foreground">Department for Promotion of Industry and Internal Trade</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Get information about policies, funding opportunities and startup recognition.
                  </p>
                  <a 
                    href="https://dpiit.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;
