
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DocumentViewer from "@/components/knowledge-base/DocumentViewer";
import { Skeleton } from "@/components/ui/skeleton";

interface SectorDocumentsProps {
  sector?: string;
  businessType?: string;
  userProfile?: any;
}

// Sector document mapping
const sectorDocuments: Record<string, Array<{id: string, name: string, description: string, type: string, size: string}>> = {
  "technology": [
    { 
      id: "tech-1", 
      name: "technology_startup_guide.pdf", 
      description: "Complete guide for tech startups in India", 
      type: "application/pdf", 
      size: "2.4 MB" 
    },
    { 
      id: "tech-2", 
      name: "it_sector_compliances.pdf", 
      description: "IT sector regulatory compliances and forms", 
      type: "application/pdf", 
      size: "1.8 MB" 
    },
    { 
      id: "tech-3", 
      name: "software_ip_protection.pdf", 
      description: "Intellectual property protection for software", 
      type: "application/pdf", 
      size: "1.2 MB" 
    },
    { 
      id: "tech-4", 
      name: "funding_options_tech.pdf", 
      description: "Funding options for technology startups", 
      type: "application/pdf", 
      size: "0.9 MB" 
    }
  ],
  "food": [
    { 
      id: "food-1", 
      name: "fssai_licensing_guide.pdf", 
      description: "Complete guide for FSSAI licensing", 
      type: "application/pdf", 
      size: "1.7 MB" 
    },
    { 
      id: "food-2", 
      name: "food_business_compliance.pdf", 
      description: "Food industry regulatory compliances", 
      type: "application/pdf", 
      size: "2.1 MB" 
    },
    { 
      id: "food-3", 
      name: "restaurant_setup_checklist.pdf", 
      description: "Legal checklist for restaurant setup", 
      type: "application/pdf", 
      size: "1.5 MB" 
    }
  ],
  "ecommerce": [
    { 
      id: "ecom-1", 
      name: "ecommerce_regulations.pdf", 
      description: "E-commerce regulations in India", 
      type: "application/pdf", 
      size: "2.2 MB" 
    },
    { 
      id: "ecom-2", 
      name: "online_marketplace_compliance.pdf", 
      description: "Compliance guide for online marketplaces", 
      type: "application/pdf", 
      size: "1.9 MB" 
    },
    { 
      id: "ecom-3", 
      name: "payment_gateway_integration.pdf", 
      description: "Payment gateway regulatory requirements", 
      type: "application/pdf", 
      size: "1.3 MB" 
    }
  ],
  "healthcare": [
    { 
      id: "health-1", 
      name: "healthcare_startup_guide.pdf", 
      description: "Guide for healthcare startups in India", 
      type: "application/pdf", 
      size: "2.8 MB" 
    },
    { 
      id: "health-2", 
      name: "medical_establishments_regulations.pdf", 
      description: "Regulations for medical establishments", 
      type: "application/pdf", 
      size: "2.3 MB" 
    }
  ]
};

// Business type document mapping
const businessTypeDocuments: Record<string, Array<{id: string, name: string, description: string, type: string, size: string}>> = {
  "pvt_ltd": [
    { 
      id: "pvt-1", 
      name: "private_limited_guide.pdf", 
      description: "Private Limited company formation and compliance", 
      type: "application/pdf", 
      size: "1.9 MB" 
    },
    { 
      id: "pvt-2", 
      name: "annual_compliances_private_ltd.pdf", 
      description: "Annual compliance calendar for Private Ltd", 
      type: "application/pdf", 
      size: "1.4 MB" 
    }
  ],
  "llp": [
    { 
      id: "llp-1", 
      name: "llp_formation_guide.pdf", 
      description: "LLP formation and operational guide", 
      type: "application/pdf", 
      size: "1.6 MB" 
    },
    { 
      id: "llp-2", 
      name: "llp_annual_returns.pdf", 
      description: "Annual filings and returns for LLPs", 
      type: "application/pdf", 
      size: "1.2 MB" 
    }
  ],
  "sole_proprietorship": [
    { 
      id: "sole-1", 
      name: "sole_proprietorship_guide.pdf", 
      description: "Guide for sole proprietorship businesses", 
      type: "application/pdf", 
      size: "1.4 MB" 
    }
  ]
};

const SectorDocuments = ({ sector, businessType, userProfile }: SectorDocumentsProps) => {
  const [loading, setLoading] = useState(true);
  const [sectorDocs, setSectorDocs] = useState<any[]>([]);
  const [businessDocs, setBusinessDocs] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>({});
  
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

  const handleAddToKnowledgeBase = (doc: any) => {
    // In a real application, this would add the document to user's knowledge base
    // For demo, we just show a toast
    alert(`${doc.name} added to your knowledge base`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sector-Specific Documents</CardTitle>
        <CardDescription>
          Recommended documents for your business profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
          ) : sectorDocs.length > 0 ? (
            <div className="space-y-2">
              {sectorDocs.map(doc => (
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
                    
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
            <p className="text-sm text-muted-foreground">No sector-specific documents available.</p>
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
          ) : businessDocs.length > 0 ? (
            <div className="space-y-2">
              {businessDocs.map(doc => (
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
                    
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
            <p className="text-sm text-muted-foreground">No business type documents available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorDocuments;
