
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Calculator, Download } from "lucide-react";
import { generateTaxReport } from "@/utils/downloadUtils";
import { useAuth } from "@/lib/auth";

const TaxCalculator = () => {
  const { isAuthenticated } = useAuth();
  const [calculatorTab, setCalculatorTab] = useState("individual");
  
  // Form states
  const [individualForm, setIndividualForm] = useState({
    financialYear: "2023-24",
    income: "",
    deductions: "",
    regime: "old"
  });
  
  const [businessForm, setBusinessForm] = useState({
    financialYear: "2023-24",
    revenue: "",
    expenses: "",
    businessType: "sole_prop",
    hasTurnoverLessThan2Cr: true
  });
  
  // Results states
  const [individualResults, setIndividualResults] = useState<any>(null);
  const [businessResults, setBusinessResults] = useState<any>(null);
  
  // Calculate individual tax
  const calculateIndividualTax = () => {
    const income = parseFloat(individualForm.income) || 0;
    const deductions = parseFloat(individualForm.deductions) || 0;
    const taxableIncome = Math.max(0, income - deductions);
    let tax = 0;
    
    if (individualForm.regime === "old") {
      // Old tax regime calculation
      if (taxableIncome <= 250000) {
        tax = 0;
      } else if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax = 12500 + (taxableIncome - 500000) * 0.2;
      } else {
        tax = 112500 + (taxableIncome - 1000000) * 0.3;
      }
      
      // Education cess
      tax = tax * 1.04; // 4% cess
    } else {
      // New tax regime calculation
      if (taxableIncome <= 300000) {
        tax = 0;
      } else if (taxableIncome <= 600000) {
        tax = (taxableIncome - 300000) * 0.05;
      } else if (taxableIncome <= 900000) {
        tax = 15000 + (taxableIncome - 600000) * 0.1;
      } else if (taxableIncome <= 1200000) {
        tax = 45000 + (taxableIncome - 900000) * 0.15;
      } else if (taxableIncome <= 1500000) {
        tax = 90000 + (taxableIncome - 1200000) * 0.2;
      } else {
        tax = 150000 + (taxableIncome - 1500000) * 0.3;
      }
      
      // Education cess
      tax = tax * 1.04; // 4% cess
    }
    
    setIndividualResults({
      taxableIncome,
      tax: Math.round(tax),
      effectiveRate: taxableIncome > 0 ? ((tax / taxableIncome) * 100).toFixed(2) : '0.00',
      takeHome: income - tax,
      regime: individualForm.regime === "old" ? "Old Tax Regime" : "New Tax Regime",
      deductions,
    });
    
    toast({
      title: "Tax Calculation Complete",
      description: "Your tax estimate has been calculated. See results below.",
    });
  };
  
  // Calculate business tax
  const calculateBusinessTax = () => {
    const revenue = parseFloat(businessForm.revenue) || 0;
    const expenses = parseFloat(businessForm.expenses) || 0;
    const profit = Math.max(0, revenue - expenses);
    let tax = 0;
    let taxRate = 0;
    
    // Determine tax rate based on business type
    switch (businessForm.businessType) {
      case "sole_prop": // Sole Proprietorship (taxed like individual)
        if (businessForm.hasTurnoverLessThan2Cr && revenue <= 20000000) {
          // Presumptive taxation scheme
          const deemedProfit = revenue * 0.06; // 6% for digital transactions
          taxRate = 0.3; // 30% for highest slab
          tax = deemedProfit * taxRate;
        } else {
          taxRate = 0.3; // 30% for highest slab
          tax = profit * taxRate;
        }
        break;
        
      case "partnership": // Partnership Firm
        taxRate = 0.3; // Flat 30%
        tax = profit * taxRate;
        break;
        
      case "llp": // Limited Liability Partnership
        taxRate = 0.3; // Flat 30%
        tax = profit * taxRate;
        break;
        
      case "pvt_ltd": // Private Limited Company
        if (revenue <= 4000000) { // 40 lakhs
          taxRate = 0.25; // 25% for small companies
        } else {
          taxRate = 0.30; // 30% for other companies
        }
        tax = profit * taxRate;
        break;
        
      default:
        taxRate = 0.3;
        tax = profit * taxRate;
        break;
    }
    
    // Add surcharge and cess if applicable
    let surcharge = 0;
    if (businessForm.businessType === "pvt_ltd" && profit > 10000000) { // 1 crore
      surcharge = tax * 0.07; // 7% surcharge for income > 1 crore
    }
    
    const cess = (tax + surcharge) * 0.04; // 4% education cess
    const totalTax = tax + surcharge + cess;
    
    setBusinessResults({
      revenue,
      expenses,
      profit,
      basicTax: Math.round(tax),
      surcharge: Math.round(surcharge),
      cess: Math.round(cess),
      totalTax: Math.round(totalTax),
      effectiveRate: profit > 0 ? ((totalTax / profit) * 100).toFixed(2) : '0.00',
      netProfit: profit - totalTax,
      businessType: businessForm.businessType,
      taxRate: (taxRate * 100).toFixed(0) + "%"
    });
    
    toast({
      title: "Business Tax Calculation Complete",
      description: "Your business tax estimate has been calculated. See results below.",
    });
  };
  
  const handleDownloadReport = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to download tax reports.",
        variant: "destructive",
      });
      return;
    }
    
    const reportData = calculatorTab === "individual" 
      ? { ...individualForm, ...individualResults }
      : { ...businessForm, ...businessResults };
    
    if (generateTaxReport(reportData)) {
      toast({
        title: "Report Downloaded",
        description: "Your tax calculation report has been downloaded.",
      });
    }
  };
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    <span>Tax Calculator for Indian Startups</span>
                  </CardTitle>
                  <CardDescription>
                    Estimate your tax liability based on income and deductions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={calculatorTab} onValueChange={setCalculatorTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="individual">Founder / Individual</TabsTrigger>
                  <TabsTrigger value="business">Business Entity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="individual" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="financial-year">Financial Year</Label>
                      <Select
                        value={individualForm.financialYear}
                        onValueChange={(value) => setIndividualForm({...individualForm, financialYear: value})}
                      >
                        <SelectTrigger id="financial-year">
                          <SelectValue placeholder="Select financial year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-24">2023-24</SelectItem>
                          <SelectItem value="2024-25">2024-25</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tax-regime">Tax Regime</Label>
                      <Select
                        value={individualForm.regime}
                        onValueChange={(value) => setIndividualForm({...individualForm, regime: value})}
                      >
                        <SelectTrigger id="tax-regime">
                          <SelectValue placeholder="Select tax regime" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="old">Old Regime (with deductions)</SelectItem>
                          <SelectItem value="new">New Regime (lower rates)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="income">Annual Income (₹)</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="Enter your annual income"
                      value={individualForm.income}
                      onChange={(e) => setIndividualForm({...individualForm, income: e.target.value})}
                    />
                  </div>
                  
                  {individualForm.regime === "old" && (
                    <div className="space-y-2">
                      <Label htmlFor="deductions">Total Deductions (₹)</Label>
                      <Input
                        id="deductions"
                        type="number"
                        placeholder="Enter your total deductions (80C, 80D, etc.)"
                        value={individualForm.deductions}
                        onChange={(e) => setIndividualForm({...individualForm, deductions: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">
                        Include all eligible deductions under sections 80C, 80D, etc.
                      </p>
                    </div>
                  )}
                  
                  <Button onClick={calculateIndividualTax} className="w-full mt-4">
                    Calculate Tax
                  </Button>
                  
                  {individualResults && (
                    <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-2">Tax Calculation Results</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">Taxable Income:</div>
                        <div className="text-sm font-medium">₹{individualResults.taxableIncome.toLocaleString()}</div>
                        
                        <div className="text-sm">Total Tax:</div>
                        <div className="text-sm font-medium">₹{individualResults.tax.toLocaleString()}</div>
                        
                        <div className="text-sm">Effective Tax Rate:</div>
                        <div className="text-sm font-medium">{individualResults.effectiveRate}%</div>
                        
                        <div className="text-sm">Take Home Income:</div>
                        <div className="text-sm font-medium">₹{individualResults.takeHome.toLocaleString()}</div>
                        
                        <div className="text-sm">Tax Regime:</div>
                        <div className="text-sm font-medium">{individualResults.regime}</div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={handleDownloadReport}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download Detailed Report
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="business" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-type">Business Type</Label>
                      <Select
                        value={businessForm.businessType}
                        onValueChange={(value) => setBusinessForm({...businessForm, businessType: value})}
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
                      <Label htmlFor="financial-year-business">Financial Year</Label>
                      <Select
                        value={businessForm.financialYear}
                        onValueChange={(value) => setBusinessForm({...businessForm, financialYear: value})}
                      >
                        <SelectTrigger id="financial-year-business">
                          <SelectValue placeholder="Select financial year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-24">2023-24</SelectItem>
                          <SelectItem value="2024-25">2024-25</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Annual Revenue (₹)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="Enter your annual revenue"
                      value={businessForm.revenue}
                      onChange={(e) => setBusinessForm({...businessForm, revenue: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Annual Expenses (₹)</Label>
                    <Input
                      id="expenses"
                      type="number"
                      placeholder="Enter your annual expenses"
                      value={businessForm.expenses}
                      onChange={(e) => setBusinessForm({...businessForm, expenses: e.target.value})}
                    />
                  </div>
                  
                  <Button onClick={calculateBusinessTax} className="w-full mt-4">
                    Calculate Business Tax
                  </Button>
                  
                  {businessResults && (
                    <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-2">Business Tax Calculation Results</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm">Total Revenue:</div>
                        <div className="text-sm font-medium">₹{businessResults.revenue.toLocaleString()}</div>
                        
                        <div className="text-sm">Total Expenses:</div>
                        <div className="text-sm font-medium">₹{businessResults.expenses.toLocaleString()}</div>
                        
                        <div className="text-sm">Profit Before Tax:</div>
                        <div className="text-sm font-medium">₹{businessResults.profit.toLocaleString()}</div>
                        
                        <div className="text-sm">Basic Tax ({businessResults.taxRate}):</div>
                        <div className="text-sm font-medium">₹{businessResults.basicTax.toLocaleString()}</div>
                        
                        {businessResults.surcharge > 0 && (
                          <>
                            <div className="text-sm">Surcharge:</div>
                            <div className="text-sm font-medium">₹{businessResults.surcharge.toLocaleString()}</div>
                          </>
                        )}
                        
                        <div className="text-sm">Education Cess:</div>
                        <div className="text-sm font-medium">₹{businessResults.cess.toLocaleString()}</div>
                        
                        <div className="text-sm">Total Tax:</div>
                        <div className="text-sm font-medium">₹{businessResults.totalTax.toLocaleString()}</div>
                        
                        <div className="text-sm">Effective Tax Rate:</div>
                        <div className="text-sm font-medium">{businessResults.effectiveRate}%</div>
                        
                        <div className="text-sm">Net Profit After Tax:</div>
                        <div className="text-sm font-medium">₹{businessResults.netProfit.toLocaleString()}</div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={handleDownloadReport}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download Detailed Report
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                <span>For estimation purposes only. Consult a tax professional for advice.</span>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tax Benefits for Startups</CardTitle>
              <CardDescription>
                Tax advantages available for Indian startups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Section 80IAC Tax Holiday</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Eligible startups registered under Startup India can claim 100% tax exemption on profits for 3 consecutive years out of the first 10 years of operation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Angel Tax Exemption</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Startups recognized by DPIIT can get exemption from angel tax under section 56(2)(viib) up to an investment of ₹25 crores.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Carry Forward of Losses</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Eligible startups can carry forward and set off losses even with change in shareholding pattern if all original shareholders continue in the company.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Section 80D Deduction</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Founders can claim deduction for health insurance premiums paid for self and family members up to ₹25,000 (₹50,000 for senior citizens).
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Patent Fee Deduction</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      100% deduction of expenditure incurred on developing patents, copyrights, trademarks, etc. under section 35A.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>R&D Expenditure</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Weighted deduction of 150% on expenditure incurred on scientific research and development for approved projects.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
