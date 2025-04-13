import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Clock, FileText, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { generateSectorComplianceChecklist } from "@/utils/downloadUtils";
import { saveChecklistItems, getChecklistItems } from "@/lib/supabase";

// Types
interface ChecklistItem {
  id: string;
  item_id?: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  priority: "high" | "medium" | "low";
  deadline?: string;
  formUrl?: string;
  resources?: { title: string; url: string }[];
  user_id?: string;
}

interface BusinessChecklistProps {
  onProgressChange?: (progress: number) => void;
}

// Compliance requirements by sector
const sectorBasedChecklists: Record<string, ChecklistItem[]> = {
  "technology": [
    {
      id: "1",
      title: "Register your company",
      description: "Complete incorporation process with MCA",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before starting business",
      formUrl: "https://www.mca.gov.in/mcafoportal/login.do",
      resources: [
        { title: "MCA Portal", url: "https://www.mca.gov.in/mcafoportal/login.do" },
        { title: "Incorporation Guide", url: "/resources/incorporation" }
      ]
    },
    {
      id: "2",
      title: "Obtain GST registration",
      description: "Apply for GST if turnover exceeds ₹20 lakhs",
      completed: false,
      category: "Tax",
      priority: "high",
      deadline: "30 days after crossing threshold",
      formUrl: "https://www.gst.gov.in/",
      resources: [
        { title: "GST Portal", url: "https://www.gst.gov.in/" },
        { title: "GST Registration Guide", url: "/resources/gst" }
      ]
    },
    {
      id: "3",
      title: "Open current account",
      description: "Open business bank account for your startup",
      completed: false,
      category: "Finance",
      priority: "high",
      deadline: "After incorporation",
      resources: [
        { title: "Bank Comparison", url: "/resources/banking" }
      ]
    },
    {
      id: "4",
      title: "Apply for MSME registration",
      description: "Register as Micro, Small, or Medium Enterprise",
      completed: false,
      category: "Legal",
      priority: "medium",
      deadline: "Optional but recommended",
      formUrl: "https://udyamregistration.gov.in/",
      resources: [
        { title: "Udyam Registration", url: "https://udyamregistration.gov.in/" }
      ]
    },
    {
      id: "5",
      title: "Prepare shareholder agreement",
      description: "Create and sign shareholder/founder agreement",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before accepting investment",
      resources: [
        { title: "Agreement Templates", url: "/resources/templates" }
      ]
    },
    {
      id: "6",
      title: "Intellectual property protection",
      description: "File for trademarks, patents, or copyrights",
      completed: false,
      category: "Legal",
      priority: "medium",
      deadline: "Before product launch",
      formUrl: "https://ipindia.gov.in/",
      resources: [
        { title: "IP Registration Portal", url: "https://ipindia.gov.in/" }
      ]
    },
    {
      id: "7",
      title: "Employment documentation",
      description: "Create employment contracts and HR policies",
      completed: false,
      category: "HR",
      priority: "medium",
      deadline: "Before first hire",
      resources: [
        { title: "HR Templates", url: "/resources/hr" }
      ]
    },
    {
      id: "8",
      title: "IT Act compliance",
      description: "Privacy policy and terms for websites/applications",
      completed: false,
      category: "Compliance",
      priority: "high",
      deadline: "Before launch",
      resources: [
        { title: "IT Act Guide", url: "/resources/it-act" }
      ]
    },
    {
      id: "9",
      title: "Set up accounting system",
      description: "Implement bookkeeping and accounting processes",
      completed: false,
      category: "Finance",
      priority: "high",
      deadline: "From day one",
      resources: [
        { title: "Accounting Software", url: "/resources/accounting" }
      ]
    },
    {
      id: "10",
      title: "Register for professional tax",
      description: "Register for professional tax in your state",
      completed: false,
      category: "Tax",
      priority: "medium",
      deadline: "State-dependent",
      resources: [
        { title: "Professional Tax Guide", url: "/resources/professional-tax" }
      ]
    }
  ],
  "food": [
    {
      id: "1",
      title: "FSSAI License",
      description: "Food Safety and Standards Authority of India license",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before starting operations",
      formUrl: "https://foscos.fssai.gov.in/",
      resources: [
        { title: "FSSAI Portal", url: "https://foscos.fssai.gov.in/" },
        { title: "FSSAI Guide", url: "/resources/fssai" }
      ]
    },
    {
      id: "2",
      title: "Health Trade License",
      description: "From local municipal corporation",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before starting operations",
      resources: [
        { title: "Municipal Websites", url: "#" }
      ]
    },
    {
      id: "3",
      title: "GST Registration",
      description: "Apply for GST if turnover exceeds ₹20 lakhs",
      completed: false,
      category: "Tax",
      priority: "high",
      deadline: "30 days after crossing threshold",
      formUrl: "https://www.gst.gov.in/",
      resources: [
        { title: "GST Portal", url: "https://www.gst.gov.in/" },
        { title: "GST Registration Guide", url: "/resources/gst" }
      ]
    },
    {
      id: "4",
      title: "Fire Safety License",
      description: "For restaurant/kitchen premises",
      completed: false,
      category: "Safety",
      priority: "high",
      deadline: "Before starting operations",
      resources: [
        { title: "Fire Safety Guidelines", url: "/resources/fire-safety" }
      ]
    },
    {
      id: "5",
      title: "Eating House License",
      description: "From police department for restaurants",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before starting operations",
      resources: [
        { title: "Police Department Website", url: "#" }
      ]
    },
    {
      id: "6", 
      title: "Weights & Measures License",
      description: "If using weighing equipment",
      completed: false,
      category: "Legal",
      priority: "medium",
      deadline: "Before starting operations",
      resources: [
        { title: "Legal Metrology", url: "#" }
      ]
    },
    {
      id: "7",
      title: "Liquor License",
      description: "If serving alcohol (varies by state)",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before serving alcohol",
      resources: [
        { title: "State Excise Department", url: "#" }
      ]
    },
    {
      id: "8",
      title: "Shop & Establishment Act",
      description: "Registration under local municipal corporation",
      completed: false,
      category: "Legal",
      priority: "medium",
      deadline: "Within 30 days of starting",
      resources: [
        { title: "Labor Department", url: "https://shramsuvidha.gov.in/" }
      ]
    },
    {
      id: "9",
      title: "Environmental Clearance",
      description: "For waste management and pollution control",
      completed: false,
      category: "Environment",
      priority: "medium",
      deadline: "Before operations start",
      resources: [
        { title: "Pollution Control Board", url: "#" }
      ]
    },
    {
      id: "10",
      title: "Professional Tax Registration",
      description: "For employees (state-specific)",
      completed: false,
      category: "Tax",
      priority: "medium",
      deadline: "State-dependent",
      resources: [
        { title: "Professional Tax Guide", url: "/resources/professional-tax" }
      ]
    }
  ],
  "ecommerce": [
    {
      id: "1",
      title: "Register your company",
      description: "Complete incorporation process with MCA",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before starting business",
      formUrl: "https://www.mca.gov.in/mcafoportal/login.do",
      resources: [
        { title: "MCA Portal", url: "https://www.mca.gov.in/mcafoportal/login.do" },
        { title: "Incorporation Guide", url: "/resources/incorporation" }
      ]
    },
    {
      id: "2",
      title: "GST Registration",
      description: "Mandatory for e-commerce businesses",
      completed: false,
      category: "Tax",
      priority: "high",
      deadline: "Before starting operations",
      formUrl: "https://www.gst.gov.in/",
      resources: [
        { title: "GST Portal", url: "https://www.gst.gov.in/" },
        { title: "GST Registration Guide", url: "/resources/gst" }
      ]
    },
    {
      id: "3",
      title: "Consumer Protection (E-commerce) Rules",
      description: "Compliance with online marketplace regulations",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before launch",
      resources: [
        { title: "E-commerce Guidelines", url: "/resources/ecommerce-rules" }
      ]
    },
    {
      id: "4",
      title: "Privacy Policy and Terms",
      description: "Website legal documentation",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before launch",
      resources: [
        { title: "Legal Templates", url: "/resources/legal-templates" }
      ]
    },
    {
      id: "5",
      title: "Trademark Registration",
      description: "Protect your brand and logo",
      completed: false,
      category: "Legal",
      priority: "medium",
      deadline: "As early as possible",
      formUrl: "https://ipindia.gov.in/",
      resources: [
        { title: "IP Registration Portal", url: "https://ipindia.gov.in/" }
      ]
    },
    {
      id: "6",
      title: "Payment Aggregator Guidelines",
      description: "RBI compliance for payment processing",
      completed: false,
      category: "Finance",
      priority: "high",
      deadline: "Before accepting payments",
      resources: [
        { title: "RBI Guidelines", url: "/resources/payment-aggregators" }
      ]
    },
    {
      id: "7",
      title: "Shop & Establishment Act",
      description: "For office premises",
      completed: false,
      category: "Legal",
      priority: "medium",
      deadline: "Within 30 days of office setup",
      resources: [
        { title: "Labor Department", url: "https://shramsuvidha.gov.in/" }
      ]
    },
    {
      id: "8",
      title: "MSME Registration",
      description: "For benefits and preference in government tenders",
      completed: false,
      category: "Legal",
      priority: "medium",
      deadline: "Optional but recommended",
      formUrl: "https://udyamregistration.gov.in/",
      resources: [
        { title: "Udyam Registration", url: "https://udyamregistration.gov.in/" }
      ]
    },
    {
      id: "9",
      title: "Packaging and Labeling Rules",
      description: "For products sold online",
      completed: false,
      category: "Compliance",
      priority: "medium",
      deadline: "Before shipping products",
      resources: [
        { title: "Packaging Guidelines", url: "/resources/packaging" }
      ]
    },
    {
      id: "10",
      title: "Returns and Refund Policy",
      description: "Mandatory for e-commerce businesses",
      completed: false,
      category: "Legal",
      priority: "high",
      deadline: "Before launch",
      resources: [
        { title: "E-commerce Policies", url: "/resources/ecommerce-policies" }
      ]
    }
  ],
  "default": [] // Empty default list
};

const BusinessChecklist = ({ onProgressChange }: BusinessChecklistProps) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadChecklistData = async () => {
      setIsLoading(true);
      try {
        const storedProfile = localStorage.getItem("userProfile");
        const userProfile = storedProfile ? JSON.parse(storedProfile) : {
          sector: "technology",
          businessType: "pvt_ltd"
        };
        
        const sectorMap: Record<string, string> = {
          "technology": "technology",
          "ecommerce": "ecommerce", 
          "food": "food",
        };
        
        const sectorKey = sectorMap[userProfile.sector?.toLowerCase()] || "technology";
        const sectorChecklistItems = sectorBasedChecklists[sectorKey] || sectorBasedChecklists["default"];
        
        const storedItems = await getChecklistItems();
        
        if (storedItems && storedItems.length > 0) {
          const mergedItems = sectorChecklistItems.map(item => {
            const storedItem = storedItems.find((stored: ChecklistItem) => 
              stored.id === item.id || stored.item_id === item.id
            );
            return storedItem ? { ...item, completed: storedItem.completed } : item;
          });
          setChecklistItems(mergedItems);
        } else {
          const itemsWithItemId = sectorChecklistItems.map(item => ({
            ...item,
            item_id: item.id
          }));
          setChecklistItems(itemsWithItemId);
        }
      } catch (error) {
        console.error("Error loading checklist data:", error);
        toast({
          title: "Error",
          description: "Failed to load checklist data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChecklistData();
  }, []);

  useEffect(() => {
    const completedCount = checklistItems.filter(item => item.completed).length;
    const totalCount = checklistItems.length;
    const progressValue = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    setProgress(progressValue);
    
    if (onProgressChange) {
      onProgressChange(progressValue);
    }
    
    localStorage.setItem("userChecklist", JSON.stringify(checklistItems));
  }, [checklistItems, onProgressChange]);

  const toggleItemCompletion = async (id: string) => {
    try {
      const updatedItems = checklistItems.map(item => 
        item.id === id 
          ? { ...item, completed: !item.completed, item_id: item.id } 
          : item
      );
      
      setChecklistItems(updatedItems);
      
      await saveChecklistItems(updatedItems);
      
      const item = checklistItems.find(item => item.id === id);
      
      if (item) {
        toast({
          title: item.completed ? "Task marked as incomplete" : "Task completed!",
          description: item.title
        });
      }
    } catch (error) {
      console.error("Error saving checklist status:", error);
      toast({
        title: "Error",
        description: "Failed to save your changes",
        variant: "destructive",
      });
    }
  };
  
  const handleDownloadChecklist = () => {
    const storedProfile = localStorage.getItem("userProfile");
    const userProfile = storedProfile ? JSON.parse(storedProfile) : {};
    
    try {
      if (generateSectorComplianceChecklist(userProfile)) {
        toast({
          title: "Success",
          description: "Checklist downloaded successfully!"
        });
      } else {
        throw new Error("Failed to generate checklist");
      }
    } catch (error) {
      console.error("Error downloading checklist:", error);
      toast({
        title: "Error",
        description: "Failed to download checklist",
        variant: "destructive",
      });
    }
  };

  const filteredItems = filterCategory === "all" 
    ? checklistItems 
    : checklistItems.filter(item => item.category.toLowerCase() === filterCategory.toLowerCase());

  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = acc[item.category] || [];
    category.push(item);
    acc[item.category] = category;
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const categories = ["all", ...new Set(checklistItems.map(item => item.category))];

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Startup Checklist</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div>Loading checklist...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2">
        <CardTitle>Startup Checklist</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm">
            <Progress value={progress} className="w-32 h-2 mr-2" />
            <span>{progress}% complete</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleDownloadChecklist}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <Button
              key={category}
              variant={filterCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterCategory(category)}
              className="text-xs h-8"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[500px] pr-4">
          {Object.keys(groupedItems).length > 0 ? (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
                <div className="space-y-2">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-start p-3 rounded-md border",
                        item.completed ? "bg-muted/50 border-muted" : "bg-white"
                      )}
                    >
                      <button
                        onClick={() => toggleItemCompletion(item.id)}
                        className="mt-1 mr-3 flex-shrink-0"
                        aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <h4 className={cn(
                            "font-medium",
                            item.completed ? "line-through text-muted-foreground" : ""
                          )}>
                            {item.title}
                          </h4>
                          <div className="flex items-center ml-2">
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              item.priority === "high" ? "bg-red-100 text-red-700" :
                              item.priority === "medium" ? "bg-amber-100 text-amber-700" :
                              "bg-green-100 text-green-700"
                            )}>
                              {item.priority}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {item.deadline && (
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{item.deadline}</span>
                          </div>
                        )}
                        <div className="flex mt-2">
                          {item.formUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs mr-2"
                              asChild
                            >
                              <a href={item.formUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Form
                              </a>
                            </Button>
                          )}
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-2 text-xs"
                                onClick={() => setSelectedItem(item)}
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{selectedItem?.title}</DialogTitle>
                                <DialogDescription>{selectedItem?.description}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Category</h4>
                                  <p className="text-sm">{selectedItem?.category}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Priority</h4>
                                  <div className={cn(
                                    "inline-block text-xs px-2 py-0.5 rounded-full",
                                    selectedItem?.priority === "high" ? "bg-red-100 text-red-700" :
                                    selectedItem?.priority === "medium" ? "bg-amber-100 text-amber-700" :
                                    "bg-green-100 text-green-700"
                                  )}>
                                    {selectedItem?.priority}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Deadline</h4>
                                  <p className="text-sm">{selectedItem?.deadline || "No deadline set"}</p>
                                </div>
                                {selectedItem?.formUrl && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Form Link</h4>
                                    <a 
                                      href={selectedItem.formUrl}
                                      target="_blank"
                                      rel="noopener noreferrer" 
                                      className="text-sm text-primary hover:underline flex items-center"
                                    >
                                      <ExternalLink className="h-3 w-3 mr-2" />
                                      Access Form
                                    </a>
                                  </div>
                                )}
                                {selectedItem?.resources && selectedItem.resources.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Resources</h4>
                                    <ul className="space-y-2">
                                      {selectedItem.resources.map((resource, index) => (
                                        <li key={index}>
                                          <a 
                                            href={resource.url} 
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline flex items-center"
                                          >
                                            <FileText className="h-3 w-3 mr-2" />
                                            {resource.title}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No items in this category</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BusinessChecklist;
