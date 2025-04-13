
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, FileText, FileCog, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplianceItem {
  title: string;
  description: string;
  deadline: string;
  penalty?: string;
  icon: React.ReactNode;
  link?: string;
}

const businessTypeCompliances: Record<string, ComplianceItem[]> = {
  "sole_prop": [
    {
      title: "Tax Audit under Section 44AB",
      description: "Required if turnover exceeds ₹1 crore (₹2 crore for digital transactions)",
      deadline: "September 30 (or November 30) of the relevant assessment year",
      penalty: "0.5% of turnover or ₹1.5 lakhs, whichever is less",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.incometaxindia.gov.in/"
    },
    {
      title: "GST Registration",
      description: "Mandatory if turnover exceeds ₹40 lakhs for goods or ₹20 lakhs for services",
      deadline: "Within 30 days of becoming liable",
      penalty: "₹10,000 or tax due, whichever is higher",
      icon: <FileCog className="h-5 w-5 text-purple-600" />,
      link: "https://www.gst.gov.in/"
    },
    {
      title: "Income Tax Return",
      description: "Annual filing of income and tax paid",
      deadline: "July 31 (or October 31) of the assessment year",
      penalty: "Up to ₹10,000 for late filing",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.incometaxindiaefiling.gov.in/"
    },
    {
      title: "Shop & Establishment Registration",
      description: "Mandatory for any business premises with employees",
      deadline: "Within 30 days of establishment",
      penalty: "Varies by state (typically ₹1,000 to ₹5,000)",
      icon: <Shield className="h-5 w-5 text-green-600" />,
      link: "https://www.shramsuvidha.gov.in/"
    },
  ],
  "partnership": [
    {
      title: "Partnership Deed Registration",
      description: "Registration of partnership deed with the Registrar of Firms",
      deadline: "No specific deadline, but recommended at time of formation",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.mca.gov.in/"
    },
    {
      title: "Tax Audit under Section 44AB",
      description: "Mandatory if turnover exceeds ₹1 crore (₹2 crore for digital transactions)",
      deadline: "September 30 (or November 30) of the relevant assessment year",
      penalty: "0.5% of turnover or ₹1.5 lakhs, whichever is less",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.incometaxindia.gov.in/"
    },
    {
      title: "Income Tax Return (Form 5)",
      description: "Annual filing of partnership firm's income",
      deadline: "July 31 (or October 31) of the assessment year",
      penalty: "Up to ₹10,000 for late filing",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.incometaxindiaefiling.gov.in/"
    },
    {
      title: "GST Registration",
      description: "Mandatory irrespective of turnover",
      deadline: "Within 30 days of becoming liable",
      penalty: "₹10,000 or tax due, whichever is higher",
      icon: <FileCog className="h-5 w-5 text-purple-600" />,
      link: "https://www.gst.gov.in/"
    },
    {
      title: "GST Returns",
      description: "Monthly/quarterly filing of GST returns",
      deadline: "20th of the next month (for GSTR-3B), 11th of the next month (for GSTR-1)",
      penalty: "₹50 per day (max ₹10,000) for late filing",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.gst.gov.in/"
    },
  ],
  "llp": [
    {
      title: "Annual Return (Form 11)",
      description: "Annual filing with the Registrar of Companies",
      deadline: "Within 60 days of the financial year end",
      penalty: "₹100 per day (up to ₹5 lakhs)",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.mca.gov.in/"
    },
    {
      title: "Statement of Account & Solvency (Form 8)",
      description: "Annual financial statement filing",
      deadline: "Within 30 days of six months from the end of financial year",
      penalty: "₹100 per day (up to ₹5 lakhs)",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.mca.gov.in/"
    },
    {
      title: "Income Tax Return (Form 5)",
      description: "Annual filing of LLP's income",
      deadline: "July 31 (or October 31) of the assessment year",
      penalty: "Up to ₹10,000 for late filing",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.incometaxindiaefiling.gov.in/"
    },
    {
      title: "GST Registration",
      description: "Mandatory irrespective of turnover",
      deadline: "Within 30 days of becoming liable",
      penalty: "₹10,000 or tax due, whichever is higher",
      icon: <FileCog className="h-5 w-5 text-purple-600" />,
      link: "https://www.gst.gov.in/"
    },
    {
      title: "GST Returns",
      description: "Monthly/quarterly filing of GST returns",
      deadline: "20th of the next month (for GSTR-3B), 11th of the next month (for GSTR-1)",
      penalty: "₹50 per day (max ₹10,000) for late filing",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.gst.gov.in/"
    },
  ],
  "pvt_ltd": [
    {
      title: "Annual Return (Form MGT-7)",
      description: "Annual filing with details of shareholders, directors, etc.",
      deadline: "Within 60 days of the Annual General Meeting",
      penalty: "₹100 per day (up to ₹5 lakhs)",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.mca.gov.in/"
    },
    {
      title: "Financial Statements (Form AOC-4)",
      description: "Annual filing of financial statements with the ROC",
      deadline: "Within 30 days of the Annual General Meeting",
      penalty: "₹100 per day (up to ₹5 lakhs)",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.mca.gov.in/"
    },
    {
      title: "Director's Report",
      description: "Annual report on the company's affairs by the Board",
      deadline: "Along with financial statements",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.mca.gov.in/"
    },
    {
      title: "Income Tax Return (Form ITR-6)",
      description: "Annual filing of company's income",
      deadline: "October 31 (or November 30) of the assessment year",
      penalty: "Up to ₹10,000 for late filing",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.incometaxindiaefiling.gov.in/"
    },
    {
      title: "GST Registration",
      description: "Mandatory irrespective of turnover",
      deadline: "Within 30 days of becoming liable",
      penalty: "₹10,000 or tax due, whichever is higher",
      icon: <FileCog className="h-5 w-5 text-purple-600" />,
      link: "https://www.gst.gov.in/"
    },
    {
      title: "GST Returns",
      description: "Monthly/quarterly filing of GST returns",
      deadline: "20th of the next month (for GSTR-3B), 11th of the next month (for GSTR-1)",
      penalty: "₹50 per day (max ₹10,000) for late filing",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.gst.gov.in/"
    },
    {
      title: "TDS Returns",
      description: "Quarterly filing of TDS deducted and deposited",
      deadline: "31st of the month following the quarter",
      penalty: "₹200 per day (up to the amount of TDS)",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.tdscpc.gov.in/"
    },
    {
      title: "Board Meetings",
      description: "Minimum 4 board meetings in a year",
      deadline: "With gap not exceeding 120 days between two meetings",
      penalty: "₹25,000 for the company and ₹5,000 for every officer in default",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.mca.gov.in/"
    },
    {
      title: "Annual General Meeting",
      description: "Annual meeting of all shareholders",
      deadline: "Within 6 months from the end of financial year",
      penalty: "Up to ₹1 lakh for the company and ₹5,000 per day for officers in default",
      icon: <Calendar className="h-5 w-5 text-red-600" />,
      link: "https://www.mca.gov.in/"
    },
  ],
};

const sectorSpecificCompliances: Record<string, ComplianceItem[]> = {
  "technology": [
    {
      title: "IT Act Compliance",
      description: "Adherence to the Information Technology Act, 2000",
      deadline: "Continuous compliance",
      icon: <Shield className="h-5 w-5 text-green-600" />,
      link: "https://www.meity.gov.in/"
    },
    {
      title: "Data Protection",
      description: "Compliance with data protection and privacy regulations",
      deadline: "Continuous compliance",
      icon: <Shield className="h-5 w-5 text-green-600" />,
      link: "https://www.meity.gov.in/"
    },
  ],
  "ecommerce": [
    {
      title: "Consumer Protection (E-Commerce) Rules",
      description: "Adherence to Consumer Protection E-Commerce Rules, 2020",
      deadline: "Continuous compliance",
      penalty: "Up to ₹5 lakhs as per Consumer Protection Act",
      icon: <Shield className="h-5 w-5 text-green-600" />,
      link: "https://consumeraffairs.nic.in/"
    },
    {
      title: "FDI Compliance",
      description: "Compliance with FDI regulations for e-commerce",
      deadline: "Continuous compliance",
      icon: <Shield className="h-5 w-5 text-green-600" />,
      link: "https://dpiit.gov.in/"
    },
  ],
  "food": [
    {
      title: "FSSAI License",
      description: "License from Food Safety and Standards Authority of India",
      deadline: "Before commencing food business operations",
      penalty: "Up to ₹5 lakhs for operating without license",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.fssai.gov.in/"
    },
    {
      title: "Health Trade License",
      description: "License from local municipal corporation",
      deadline: "Before commencing operations",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://www.fssai.gov.in/"
    },
  ],
  "healthcare": [
    {
      title: "Clinical Establishments Act Registration",
      description: "Registration under Clinical Establishments Act",
      deadline: "Before commencing healthcare operations",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://clinicalestablishments.gov.in/"
    },
    {
      title: "Biomedical Waste Management",
      description: "Compliance with Biomedical Waste Management Rules",
      deadline: "Continuous compliance",
      icon: <Shield className="h-5 w-5 text-green-600" />,
      link: "https://cpcb.nic.in/"
    },
  ],
  "entertainment": [
    {
      title: "Copyright Registration",
      description: "Registration of original content under Copyright Act",
      deadline: "Optional but recommended",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://copyright.gov.in/"
    },
    {
      title: "Censor Board Certification",
      description: "Certification from Central Board of Film Certification for films",
      deadline: "Before public release",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://cbfcindia.gov.in/"
    },
  ],
  "manufacturing": [
    {
      title: "Factories Act Compliance",
      description: "Registration under Factories Act, 1948",
      deadline: "Before commencing manufacturing operations",
      penalty: "Up to ₹1 lakh and imprisonment up to 2 years",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      link: "https://labour.gov.in/"
    },
    {
      title: "Pollution Control Board Consent",
      description: "Consent to establish and operate from State Pollution Control Board",
      deadline: "Before commencing operations",
      icon: <Shield className="h-5 w-5 text-green-600" />,
      link: "https://cpcb.nic.in/"
    },
  ],
};

const ComplianceGuide = () => {
  const [businessType, setBusinessType] = useState<string>("pvt_ltd");
  const [sector, setSector] = useState<string>("technology");
  
  // Get the relevant compliances based on selections
  const businessCompliances = businessTypeCompliances[businessType] || [];
  const sectorCompliances = sectorSpecificCompliances[sector] || [];
  
  // Combine all compliances for display
  const allCompliances = [...businessCompliances, ...sectorCompliances];
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Startup Compliance Guide</CardTitle>
              <CardDescription>
                Essential legal and regulatory compliances for your startup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Select
                    value={businessType}
                    onValueChange={setBusinessType}
                  >
                    <SelectTrigger id="business-type">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sole_prop">Sole Proprietorship</SelectItem>
                      <SelectItem value="partnership">Partnership Firm</SelectItem>
                      <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                      <SelectItem value="pvt_ltd">Private Limited Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sector">Business Sector</Label>
                  <Select
                    value={sector}
                    onValueChange={setSector}
                  >
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="food">Food & Hospitality</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This compliance guide is tailored to your selected business type and sector. 
                  Always consult with legal experts for comprehensive guidance.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Compliances</h3>
                
                <div className="space-y-3">
                  {allCompliances.map((compliance, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {compliance.icon}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{compliance.title}</h4>
                          <p className="text-sm text-muted-foreground">{compliance.description}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                              Deadline: {compliance.deadline}
                            </div>
                            
                            {compliance.penalty && (
                              <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                Penalty: {compliance.penalty}
                              </div>
                            )}
                          </div>
                          
                          {compliance.link && (
                            <div className="mt-2">
                              <a 
                                href={compliance.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                Official Website
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3">
                                  <path d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3H6.5C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance Calendar</CardTitle>
              <CardDescription>
                Upcoming compliance deadlines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-red-100 rounded-full text-red-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">GSTR-3B</p>
                    <p className="text-xs text-muted-foreground">Due on 20th May, 2024</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-amber-100 rounded-full text-amber-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">TDS Return (Q1)</p>
                    <p className="text-xs text-muted-foreground">Due on 31st July, 2024</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Income Tax Return</p>
                    <p className="text-xs text-muted-foreground">Due on 31st July, 2024</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-full text-blue-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Annual Return (Form MGT-7)</p>
                    <p className="text-xs text-muted-foreground">Due on 30th October, 2024</p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compliance Tips</CardTitle>
              <CardDescription>
                Best practices for startups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Maintain organized records of all filings and payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Set up calendar reminders for all compliance deadlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Consider automating routine compliance tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Consult with legal and tax experts regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">Stay updated with regulatory changes affecting your industry</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplianceGuide;
