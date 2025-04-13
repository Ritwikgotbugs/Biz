
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { generateSectorComplianceChecklist } from "@/utils/downloadUtils";
import { toast } from "@/hooks/use-toast";
import { getUserProfile } from "@/lib/supabase";
import { FileText, Download, LucideIcon, Search, CodeIcon, Briefcase, Building2, Utensils, Stethoscope, Film, Factory } from "lucide-react";

interface SectorContent {
  id: string;
  label: string;
  icon: LucideIcon;
  resources: {
    title: string;
    description: string;
    type: string;
  }[];
}

const sectorContent: SectorContent[] = [
  {
    id: "technology",
    label: "Technology",
    icon: CodeIcon,
    resources: [
      {
        title: "IT Act Compliance Guide",
        description: "Essential compliance requirements for tech startups under the Information Technology Act",
        type: "guide"
      },
      {
        title: "Data Protection Framework",
        description: "Guidelines for implementing data protection measures in accordance with upcoming legislation",
        type: "checklist"
      },
      {
        title: "Software Patent Filing Process",
        description: "Step-by-step process for filing software patents in India",
        type: "guide"
      },
      {
        title: "Tech Startup Tax Benefits",
        description: "Overview of tax incentives and benefits available to technology startups",
        type: "report"
      }
    ]
  },
  {
    id: "business",
    label: "Business Services",
    icon: Briefcase,
    resources: [
      {
        title: "Professional Services Compliance",
        description: "Compliance requirements for consulting and professional service businesses",
        type: "guide"
      },
      {
        title: "Service Contracts Template Kit",
        description: "Templates for service agreements, SOWs, and client contracts",
        type: "template"
      },
      {
        title: "Freelancer to Agency Transition",
        description: "Legal and financial considerations when scaling from freelancer to agency",
        type: "guide"
      },
      {
        title: "B2B Invoice Requirements",
        description: "GST and legal requirements for B2B invoicing",
        type: "checklist"
      }
    ]
  },
  {
    id: "real-estate",
    label: "Real Estate",
    icon: Building2,
    resources: [
      {
        title: "RERA Compliance Checklist",
        description: "Essential compliance requirements under the Real Estate Regulation Act",
        type: "checklist"
      },
      {
        title: "Property Development Approvals",
        description: "Guide to obtaining necessary approvals for property development projects",
        type: "guide"
      },
      {
        title: "Real Estate Investment Trust Framework",
        description: "Legal framework and compliance requirements for REITs",
        type: "report"
      },
      {
        title: "Rental Agreement Templates",
        description: "Standard templates for residential and commercial lease agreements",
        type: "template"
      }
    ]
  },
  {
    id: "food",
    label: "Food & Hospitality",
    icon: Utensils,
    resources: [
      {
        title: "FSSAI Licensing Guide",
        description: "Comprehensive guide to obtaining FSSAI licenses for food businesses",
        type: "guide"
      },
      {
        title: "Restaurant Compliance Checklist",
        description: "Essential licenses and permits for restaurants and food service establishments",
        type: "checklist"
      },
      {
        title: "Food Safety Management System",
        description: "Implementation guide for HACCP-based food safety management systems",
        type: "guide"
      },
      {
        title: "Cloud Kitchen Setup Guide",
        description: "Legal and compliance requirements for setting up cloud kitchens",
        type: "guide"
      }
    ]
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: Stethoscope,
    resources: [
      {
        title: "Clinical Establishment Registration",
        description: "Guide to registering under the Clinical Establishments Act",
        type: "guide"
      },
      {
        title: "Digital Health Compliance",
        description: "Regulatory framework for telemedicine and digital health platforms",
        type: "report"
      },
      {
        title: "Medical Device Registration",
        description: "Process for registering medical devices with CDSCO",
        type: "guide"
      },
      {
        title: "Healthcare Data Privacy Framework",
        description: "Guidelines for handling patient data in compliance with regulations",
        type: "checklist"
      }
    ]
  },
  {
    id: "entertainment",
    label: "Entertainment & Media",
    icon: Film,
    resources: [
      {
        title: "Content Licensing Framework",
        description: "Legal guidelines for content licensing across different platforms",
        type: "guide"
      },
      {
        title: "Media Production Compliance",
        description: "Compliance requirements for media production companies",
        type: "checklist"
      },
      {
        title: "Digital Content Regulations",
        description: "Overview of OTT platform regulations and content guidelines",
        type: "report"
      },
      {
        title: "Copyright Registration Process",
        description: "Step-by-step guide to registering copyrights for creative works",
        type: "guide"
      }
    ]
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: Factory,
    resources: [
      {
        title: "Factory License Guide",
        description: "Process for obtaining factory license under the Factories Act",
        type: "guide"
      },
      {
        title: "Manufacturing Compliance Checklist",
        description: "Essential compliances for manufacturing businesses",
        type: "checklist"
      },
      {
        title: "Pollution Control Guidelines",
        description: "Guidelines for obtaining PCB consent for manufacturing units",
        type: "guide"
      },
      {
        title: "Import-Export Documentation",
        description: "Documentation requirements for import and export of goods",
        type: "template"
      }
    ]
  }
];

const SectorKnowledgeBase: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState("technology");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  
  const sector = sectorContent.find(s => s.id === selectedSector);
  
  const handleDownload = async (resourceTitle: string) => {
    setIsDownloading(true);
    
    try {
      const userProfile = await getUserProfile();
      
      // Set the sector in the user profile for appropriate checklist generation
      const profileWithSector = {
        ...userProfile,
        sector: selectedSector.charAt(0).toUpperCase() + selectedSector.slice(1)
      };
      
      if (await generateSectorComplianceChecklist(profileWithSector)) {
        toast({
          title: "Download Successful",
          description: `${resourceTitle} has been downloaded.`
        });
      } else {
        throw new Error("Failed to generate checklist");
      }
    } catch (error) {
      console.error("Error downloading resource:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the resource.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Filter resources based on search query
  const filteredResources = sector?.resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Sector-Specific Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Tabs value={selectedSector} onValueChange={setSelectedSector}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4">
                {sectorContent.map(sector => (
                  <TabsTrigger key={sector.id} value={sector.id} className="flex flex-col gap-1 py-2">
                    <sector.icon className="h-5 w-5" />
                    <span className="text-xs">{sector.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full rounded-md border border-input pl-10 py-2 bg-background"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              
              {sectorContent.map(sector => (
                <TabsContent key={sector.id} value={sector.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResources && filteredResources.length > 0 ? (
                      filteredResources.map((resource, index) => (
                        <div key={index} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-md ${
                              resource.type === 'guide' ? 'bg-blue-100 text-blue-600' :
                              resource.type === 'checklist' ? 'bg-green-100 text-green-600' :
                              resource.type === 'template' ? 'bg-purple-100 text-purple-600' :
                              'bg-amber-100 text-amber-600'
                            }`}>
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{resource.title}</h3>
                              <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                            </div>
                          </div>
                          <p className="text-sm mb-4">
                            {resource.description}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleDownload(resource.title)}
                            disabled={isDownloading}
                          >
                            <Download className="h-4 w-4" /> 
                            {isDownloading ? "Downloading..." : "Download"}
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-10 border rounded-lg bg-slate-50">
                        <p className="text-muted-foreground">No resources found matching your search.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SectorKnowledgeBase;
