
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderComponent from "@/components/layout/Header";
import FooterComponent from "@/components/layout/Footer";
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
  LibraryBig
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
      <HeaderComponent />
      
      <main className="flex-1 bg-gray-50">
        <div className="bg-primary text-white py-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Startup Resources</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Access essential tools, guides, and information to help your startup succeed
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="bg-white rounded-lg p-1 border shadow-sm">
              <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
                <TabsTrigger value="tax-calculator" className="flex gap-2 py-3">
                  <Calculator className="h-5 w-5" />
                  <span>Tax Calculator</span>
                </TabsTrigger>
                <TabsTrigger value="compliance-guide" className="flex gap-2 py-3">
                  <ListChecks className="h-5 w-5" />
                  <span>Compliance Guide</span>
                </TabsTrigger>
                <TabsTrigger value="articles" className="flex gap-2 py-3">
                  <BookOpen className="h-5 w-5" />
                  <span>Articles & Blog</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="tax-calculator">
              <TaxCalculator />
            </TabsContent>
            
            <TabsContent value="compliance-guide">
              <ComplianceGuide />
            </TabsContent>
            
            <TabsContent value="articles">
              <BlogArticles />
            </TabsContent>
          </Tabs>

          {/* Download Resources Section */}
          <section className="mt-12">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Download Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-md text-blue-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Business Plan Template</h3>
                      <p className="text-sm text-muted-foreground">Comprehensive template for your startup</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    A detailed business plan template tailored for Indian startups with sections for market analysis, financials, and compliance.
                  </p>
                  <AuthButton onClick={handleTemplateDownload}>
                    <Download className="h-4 w-4" /> Download Template
                  </AuthButton>
                </div>
                
                <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-md text-green-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Compliance Calendar</h3>
                      <p className="text-sm text-muted-foreground">Annual filing dates and deadlines</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    Keep track of important compliance deadlines like GST filing, income tax, and annual returns.
                  </p>
                  <AuthButton onClick={() => {
                    // In a real app, this would download a calendar file
                    toast({
                      title: "Feature Coming Soon",
                      description: "This feature will be available soon.",
                    });
                  }}>
                    <Download className="h-4 w-4" /> Download Calendar
                  </AuthButton>
                </div>
                
                <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-md text-purple-600">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Market Analysis Reports</h3>
                      <p className="text-sm text-muted-foreground">Industry insights and trends</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    Detailed market analysis reports for major industry sectors in India including growth projections.
                  </p>
                  <AuthButton onClick={() => {
                    // In a real app, this would download a report
                    toast({
                      title: "Feature Coming Soon",
                      description: "This feature will be available soon.",
                    });
                  }}>
                    <Download className="h-4 w-4" /> Download Reports
                  </AuthButton>
                </div>
              </div>
            </div>
          </section>
          
          {/* External Resources Section */}
          <section className="mt-12 mb-12">
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">External Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-amber-100 rounded-md text-amber-600">
                      <BadgeIndianRupee className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Startup India</h3>
                      <p className="text-sm text-muted-foreground">Government Initiative</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    Access benefits, incentives and resources from the Startup India government initiative.
                  </p>
                  <a 
                    href="https://www.startupindia.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-red-100 rounded-md text-red-600">
                      <LibraryBig className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Ministry of Corporate Affairs</h3>
                      <p className="text-sm text-muted-foreground">Government Portal</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    Official resource for company registration, filing returns and regulatory compliance.
                  </p>
                  <a 
                    href="https://www.mca.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-teal-100 rounded-md text-teal-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">DPIIT</h3>
                      <p className="text-sm text-muted-foreground">Department for Promotion of Industry and Internal Trade</p>
                    </div>
                  </div>
                  <p className="text-sm mb-4">
                    Get information about policies, funding opportunities and startup recognition.
                  </p>
                  <a 
                    href="https://dpiit.gov.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    Visit Website <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <FooterComponent />
    </div>
  );
};

export default ResourcesPage;
