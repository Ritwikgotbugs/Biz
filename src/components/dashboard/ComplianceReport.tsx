import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateComplianceReport } from "@/utils/downloadUtils";
import { getUserProfile, getChecklistItems } from "@/lib/supabase";

interface SectorComplianceMap {
  [key: string]: string[];
}

// Pre-defined compliance requirements by sector
const sectorCompliance: SectorComplianceMap = {
  "Technology": ["GST Registration", "Shop & Establishment Act", "Professional Tax", "MSME Registration", "Trademark Registration", "Patents (if applicable)", "Data Protection Compliance"],
  "Food": ["FSSAI License", "GST Registration", "Health Trade License", "Fire Safety License", "Weights & Measures License", "Eating House License", "MSME Registration"],
  "E-commerce": ["GST Registration", "Shop & Establishment Act", "Professional Tax", "MSME Registration", "Consumer Protection (E-commerce) Rules", "FDI Compliance", "Payment Aggregator Guidelines"],
  "Healthcare": ["Clinical Establishment License", "GST Registration", "Biomedical Waste Management", "Drugs License (if applicable)", "PNDT Registration (if applicable)", "Fire Safety License", "Pharmacy Council Registration"],
  "Entertainment": ["GST Registration", "Shop & Establishment Act", "Local Municipal Permissions", "Copyright Registration", "Censor Board Certification (for films)", "Performance License", "Event Permissions"],
  "Manufacturing": ["Factory License", "GST Registration", "Pollution Control Board Consent", "Fire Safety License", "MSME Registration", "Industrial Entrepreneur Memorandum", "Electricity and Water Connection Approvals"],
};

// Pre-defined business type compliance requirements
const businessTypeCompliance: SectorComplianceMap = {
  "Sole Proprietorship": ["PAN Card", "GST Registration (if applicable)", "Shop & Establishment Act", "Business License", "Municipal Trade License"],
  "Partnership": ["Partnership Deed Registration", "PAN Card", "GST Registration", "Shop & Establishment Act", "Professional Tax"],
  "LLP": ["LLP Registration", "PAN & TAN", "GST Registration", "Shop & Establishment Act", "Annual Filing (Form 8 & 11)"],
  "Private Limited Company": ["Certificate of Incorporation", "PAN & TAN", "GST Registration", "MSME Registration", "ESI & PF Registration", "Annual Filing (MGT-7, AOC-4)"],
  "Public Limited Company": ["Certificate of Incorporation", "PAN & TAN", "GST Registration", "SEBI Compliance", "Annual Filing (MGT-7, AOC-4)", "Stock Exchange Compliances"],
  "One Person Company": ["Certificate of Incorporation", "PAN & TAN", "GST Registration", "MSME Registration", "Annual Filing (MGT-7, AOC-4)"]
};

// Map from form values to display values
const sectorMapping: {[key: string]: string} = {
  "technology": "Technology",
  "food": "Food",
  "ecommerce": "E-commerce",
  "healthcare": "Healthcare",
  "entertainment": "Entertainment",
  "manufacturing": "Manufacturing"
};

const businessTypeMapping: {[key: string]: string} = {
  "sole_proprietorship": "Sole Proprietorship",
  "partnership": "Partnership",
  "llp": "LLP",
  "pvt_ltd": "Private Limited Company",
  "public_ltd": "Public Limited Company",
  "one_person": "One Person Company"
};

interface ComplianceReportProps {
  sectorType?: string;
  businessType?: string;
  userProfile?: any;
}

const ComplianceReport: React.FC<ComplianceReportProps> = ({ 
  sectorType,
  businessType,
  userProfile: propUserProfile
}) => {
  const [downloading, setDownloading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>({});
  const [userChecklist, setUserChecklist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile from Supabase or localStorage
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (propUserProfile && Object.keys(propUserProfile).length > 0) {
          setUserProfile(propUserProfile);
        } else {
          // Try to get user profile from Supabase
          const profile = await getUserProfile();
          
          if (profile) {
            setUserProfile(profile);
          } else {
            // Fall back to default profile
            setUserProfile({
              companyName: "Your Company",
              sector: "technology",
              businessType: "pvt_ltd",
              registrationState: "Karnataka",
              annualTurnover: "under_40l",
              incorporationDate: "2023-06-15"
            });
          }
        }
        
        // Load checklist items
        const checklist = await getChecklistItems();
        setUserChecklist(checklist || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [propUserProfile]);

  // Get the appropriate compliance requirements
  const mappedSector = userProfile.sector ? 
    sectorMapping[userProfile.sector.toLowerCase()] || userProfile.sector : 
    "Technology";
    
  const mappedBusinessType = userProfile.businessType ? 
    businessTypeMapping[userProfile.businessType.toLowerCase()] || userProfile.businessType : 
    "Private Limited Company";
  
  const sectorRequirements = sectorCompliance[mappedSector] || sectorCompliance["Technology"];
  const businessRequirements = businessTypeCompliance[mappedBusinessType] || businessTypeCompliance["Private Limited Company"];
  
  // All combined compliance requirements
  const allRequirements = [...businessRequirements, ...sectorRequirements];
  
  // Handle report download
  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      // Prepare enriched profile with compliance status flags
      let complianceFlags: {[key: string]: boolean} = {};
      
      if (userChecklist && userChecklist.length > 0) {
        // Extract status flags from checklist
        userChecklist.forEach((item: any) => {
          if (item.title === "GST Registration") complianceFlags.hasGstRegistration = item.completed;
          if (item.title.includes("Tax")) complianceFlags.hasTaxFiling = item.completed;
          if (item.title.includes("Trademark")) complianceFlags.hasTrademark = item.completed;
          if (item.title.includes("Employment") || item.title.includes("Labour")) complianceFlags.hasLabourCompliances = item.completed;
          if (item.title.includes("Shop & Establishment")) complianceFlags.hasShopEstablishment = item.completed;
        });
      } else {
        // Random flags for demonstration if no checklist is available
        complianceFlags = {
          hasGstRegistration: Math.random() > 0.5,
          hasTaxFiling: Math.random() > 0.5,
          hasTrademark: Math.random() > 0.5,
          hasLabourCompliances: Math.random() > 0.5,
          hasShopEstablishment: Math.random() > 0.5,
        };
      }
      
      // Format turnover for display
      const turnoverFormatMap: {[key: string]: string} = {
        "under_40l": "Under ₹40 lakhs",
        "40l_to_1cr": "₹40 lakhs to ₹1 crore",
        "1cr_to_5cr": "₹1 crore to ₹5 crore",
        "above_5cr": "Above ₹5 crore"
      };
      
      // Create display-ready profile
      const formattedProfile = {
        ...userProfile,
        sector: mappedSector,
        businessType: mappedBusinessType,
        annualTurnover: turnoverFormatMap[userProfile.annualTurnover] || userProfile.annualTurnover,
        ...complianceFlags
      };
      
      if (await generateComplianceReport(formattedProfile)) {
        toast({
          title: "Report Downloaded",
          description: "Your compliance report has been downloaded successfully.",
        });
      } else {
        toast({
          title: "Download Error",
          description: "There was an error downloading the report.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Download Error",
        description: "There was an unexpected error generating your report.",
        variant: "destructive",
      });
      console.error("Report generation error:", error);
    } finally {
      setDownloading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Report</CardTitle>
          <CardDescription>Loading your compliance data...</CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex justify-center items-center">
          <div>Loading...</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Report</CardTitle>
        <CardDescription>
          Required compliances for your {mappedBusinessType} in the {mappedSector} sector
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Required Registrations & Licenses</h4>
            <ul className="text-sm space-y-1 pl-5 list-disc">
              {allRequirements.slice(0, 8).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
              {allRequirements.length > 8 && (
                <li className="text-muted-foreground">+{allRequirements.length - 8} more</li>
              )}
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
            <div className="text-muted-foreground">Business Type:</div>
            <div className="font-medium">{mappedBusinessType}</div>
            
            <div className="text-muted-foreground">Sector:</div>
            <div className="font-medium">{mappedSector}</div>
            
            <div className="text-muted-foreground">Location:</div>
            <div className="font-medium">{userProfile.registrationState || "Karnataka"}</div>
            
            <div className="text-muted-foreground">Turnover Range:</div>
            <div className="font-medium">
              {userProfile.annualTurnover === "under_40l" ? "Under ₹40 lakhs" :
               userProfile.annualTurnover === "40l_to_1cr" ? "₹40 lakhs to ₹1 crore" :
               userProfile.annualTurnover === "1cr_to_5cr" ? "₹1 crore to ₹5 crore" :
               userProfile.annualTurnover === "above_5cr" ? "Above ₹5 crore" :
               userProfile.annualTurnover || "Under ₹40 lakhs"}
            </div>
            
            <div className="text-muted-foreground">Incorporation Date:</div>
            <div className="font-medium">{userProfile.incorporationDate || "Not specified"}</div>
            
            <div className="text-muted-foreground">Company Name:</div>
            <div className="font-medium">{userProfile.companyName || "Your Company"}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Downloading..." : "Download Detailed Report"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComplianceReport;
