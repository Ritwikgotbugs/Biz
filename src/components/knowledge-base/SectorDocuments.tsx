import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DocumentViewer from "@/components/knowledge-base/DocumentViewer";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SectorDocumentsProps {
  sector?: string;
  businessType?: string;
  userProfile?: any;
}

// Sector document mapping
const sectorDocuments: Record<string, Array<{id: string, name: string, description: string, type: string, size: string, category: string, url?: string}>> = {
  "technology": [
    { 
      id: "tech-1", 
      name: "technology_startup_guide.pdf", 
      description: "Complete guide for tech startups in India", 
      type: "application/pdf", 
      size: "2.4 MB",
      category: "guide",
      url: "/documents/sector/technology/guide/technology-startup-guide.pdf"
    },
    { 
      id: "tech-2", 
      name: "it_sector_compliances.pdf", 
      description: "IT sector regulatory compliances and forms", 
      type: "application/pdf", 
      size: "1.8 MB",
      category: "compliance",
      url: "/documents/sector/technology/compliance/it-sector-compliances.pdf"
    },
    { 
      id: "tech-3", 
      name: "software_ip_protection.pdf", 
      description: "Intellectual property protection for software", 
      type: "application/pdf", 
      size: "1.2 MB",
      category: "legal",
      url: "/documents/sector/technology/legal/software-ip-protection.pdf"
    },
    { 
      id: "tech-4", 
      name: "funding_options_tech.pdf", 
      description: "Funding options for technology startups", 
      type: "application/pdf", 
      size: "0.9 MB",
      category: "finance",
      url: "/documents/sector/technology/finance/funding-options-tech.pdf"
    }
  ],
  "food": [
    {
      id: 'food-1',
      name: 'FSSAI Licensing & Registration Guide',
      description: 'Complete guide for obtaining FSSAI license and registration for food businesses',
      type: 'PDF',
      size: '1.2 MB',
      category: 'licensing',
      url: '/documents/sector/food/licensing/fssai-licensing-guide.pdf'
    },
    {
      id: 'food-2',
      name: 'Food Safety Standards Regulations',
      description: 'Comprehensive food safety standards and requirements for food businesses',
      type: 'PDF',
      size: '11 MB',
      category: 'standards',
      url: '/documents/sector/food/standards/food-safety-standards.pdf'
    },
    {
      id: 'food-3',
      name: 'Hygiene and Sanitary Guidelines',
      description: 'Guidelines for maintaining hygiene and sanitary conditions in food establishments',
      type: 'PDF',
      size: '2.5 MB',
      category: 'hygiene',
      url: '/documents/sector/food/hygiene/hygiene-guidelines.pdf'
    },
    {
      id: 'food-4',
      name: 'Packaging and Labelling Regulations',
      description: 'Regulations for food packaging and labeling requirements',
      type: 'PDF',
      size: '83 KB',
      category: 'packaging',
      url: '/documents/sector/food/packaging/packaging-regulations.pdf'
    },
    {
      id: 'food-5',
      name: 'Food Import Regulations',
      description: 'Guidelines and regulations for importing food products',
      type: 'PDF',
      size: '1.3 MB',
      category: 'import',
      url: '/documents/sector/food/import/import-regulations.pdf'
    }
  ],
  "ecommerce": [
    { 
      id: "ecom-1", 
      name: "ecommerce_regulations.pdf", 
      description: "E-commerce regulations in India", 
      type: "application/pdf", 
      size: "2.2 MB",
      category: "compliance",
      url: "/documents/sector/ecommerce/compliance/ecommerce-regulations.pdf"
    },
    { 
      id: "ecom-2", 
      name: "online_marketplace_compliance.pdf", 
      description: "Compliance guide for online marketplaces", 
      type: "application/pdf", 
      size: "1.9 MB",
      category: "compliance",
      url: "/documents/sector/ecommerce/compliance/online-marketplace-compliance.pdf"
    },
    { 
      id: "ecom-3", 
      name: "payment_gateway_integration.pdf", 
      description: "Payment gateway regulatory requirements", 
      type: "application/pdf", 
      size: "1.3 MB",
      category: "finance",
      url: "/documents/sector/ecommerce/finance/payment-gateway-integration.pdf"
    }
  ],
  "healthcare": [
    { 
      id: "health-1", 
      name: "healthcare_startup_guide.pdf", 
      description: "Guide for healthcare startups in India", 
      type: "application/pdf", 
      size: "2.8 MB",
      category: "guide",
      url: "/documents/sector/healthcare/guide/healthcare-startup-guide.pdf"
    },
    { 
      id: "health-2", 
      name: "medical_establishments_regulations.pdf", 
      description: "Regulations for medical establishments", 
      type: "application/pdf", 
      size: "2.3 MB",
      category: "compliance",
      url: "/documents/sector/healthcare/compliance/medical-establishments-regulations.pdf"
    }
  ]
};

// Business type document mapping
const businessTypeDocuments: Record<string, Array<{id: string, name: string, description: string, type: string, size: string, category: string}>> = {
  "pvt_ltd": [
    { 
      id: "pvt-1", 
      name: "private_limited_guide.pdf", 
      description: "Private Limited company formation and compliance", 
      type: "application/pdf", 
      size: "1.9 MB",
      category: "guide"
    },
    { 
      id: "pvt-2", 
      name: "annual_compliances_private_ltd.pdf", 
      description: "Annual compliance calendar for Private Ltd", 
      type: "application/pdf", 
      size: "1.4 MB",
      category: "compliance"
    }
  ],
  "llp": [
    { 
      id: "llp-1", 
      name: "llp_formation_guide.pdf", 
      description: "LLP formation and operational guide", 
      type: "application/pdf", 
      size: "1.6 MB",
      category: "guide"
    },
    { 
      id: "llp-2", 
      name: "llp_annual_returns.pdf", 
      description: "Annual filings and returns for LLPs", 
      type: "application/pdf", 
      size: "1.2 MB",
      category: "compliance"
    }
  ],
  "sole_proprietorship": [
    { 
      id: "sole-1", 
      name: "sole_proprietorship_guide.pdf", 
      description: "Guide for sole proprietorship businesses", 
      type: "application/pdf", 
      size: "1.4 MB",
      category: "guide"
    }
  ]
};

const SectorDocuments = ({ sector, businessType, userProfile }: SectorDocumentsProps) => {
  const [loading, setLoading] = useState(true);
  const [sectorDocs, setSectorDocs] = useState<any[]>([]);
  const [businessDocs, setBusinessDocs] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    // Load user profile from localStorage if not provided
    const loadedProfile = userProfile || (() => {
      const storedProfile = localStorage.getItem("userProfile");
      return storedProfile ? JSON.parse(storedProfile) : {
        sector: "technology",
        businessType: "pvt_ltd"
      };
    })();
    
    setCurrentProfile(loadedProfile);
    
    // Get appropriate documents by user sector
    const userSector = loadedProfile.sector?.toLowerCase() || "technology";
    const userBusinessType = loadedProfile.businessType?.toLowerCase() || "pvt_ltd";
    
    // Load documents (simulating API call)
    setTimeout(() => {
      const sectorDocList = sectorDocuments[userSector] || [];
      const businessDocList = businessTypeDocuments[userBusinessType] || [];
      
      setSectorDocs(sectorDocList);
      setBusinessDocs(businessDocList);
      setLoading(false);
    }, 500);
  }, [sector, businessType, userProfile]);

  const handleOpenDocument = (doc: any) => {
    setSelectedDocument(doc);
  };

  const handleDownload = (doc: any) => {
    if (doc.url) {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAddToKnowledgeBase = (doc: any) => {
    // In a real application, this would add the document to user's knowledge base
    // For demo, we just show a toast
    alert(`${doc.name} added to your knowledge base`);
  };

  // Filter documents based on selected category
  const filteredSectorDocs = selectedCategory === "all" 
    ? sectorDocs 
    : sectorDocs.filter(doc => doc.category === selectedCategory);
    
  const filteredBusinessDocs = selectedCategory === "all" 
    ? businessDocs 
    : businessDocs.filter(doc => doc.category === selectedCategory);

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Sector-Specific Documents</CardTitle>
            <CardDescription>
              Recommended documents for your business profile
            </CardDescription>
          </div>
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Filter Documents</h4>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] h-8 text-[10px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="guide">Guides</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sector Documents */}
          <div>
            <h3 className="text-sm font-medium mb-3">{currentProfile.sector?.charAt(0).toUpperCase() + currentProfile.sector?.slice(1) || 'Technology'} Sector Documents</h3>
            
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton className="h-8 w-8" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredSectorDocs.length > 0 ? (
              <div className="space-y-2">
                {filteredSectorDocs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleOpenDocument(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{selectedDocument?.name}</DialogTitle>
                            <DialogDescription>{selectedDocument?.description}</DialogDescription>
                          </DialogHeader>
                          <div className="min-h-[70vh]">
                            <DocumentViewer document={selectedDocument} />
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleAddToKnowledgeBase(doc)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No sector-specific documents available for this category.</p>
            )}
          </div>
          
          {/* Business Type Documents */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              {currentProfile.businessType === "pvt_ltd" ? "Private Limited" : 
               currentProfile.businessType === "llp" ? "LLP" :
               currentProfile.businessType === "sole_proprietorship" ? "Sole Proprietorship" :
               currentProfile.businessType?.charAt(0).toUpperCase() + currentProfile.businessType?.slice(1) || 'Business'} Documents
            </h3>
            
            {loading ? (
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton className="h-8 w-8" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBusinessDocs.length > 0 ? (
              <div className="space-y-2">
                {filteredBusinessDocs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2 rounded border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleOpenDocument(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{selectedDocument?.name}</DialogTitle>
                            <DialogDescription>{selectedDocument?.description}</DialogDescription>
                          </DialogHeader>
                          <div className="min-h-[70vh]">
                            <DocumentViewer document={selectedDocument} />
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleAddToKnowledgeBase(doc)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No business type documents available for this category.</p>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default SectorDocuments;
