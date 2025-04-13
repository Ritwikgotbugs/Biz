
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getUserProfile } from '@/lib/supabase';

/**
 * Generate tax calculation report PDF
 */
export const generateTaxReport = async (taxData: any) => {
  try {
    // If no company name is provided, try to get user profile
    if (!taxData.companyName) {
      const userData = await getUserProfile();
      if (userData && userData.companyName) {
        taxData.companyName = userData.companyName;
      }
    }
    
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text("Tax Calculation Report", pageWidth / 2, 20, { align: 'center' });
    
    // Add company details
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Company: ${taxData.companyName || "Your Company"}`, 20, 40);
    doc.text(`Financial Year: ${taxData.financialYear || "2023-24"}`, 20, 45);
    
    // Add tax calculation table
    const taxDetails = [
      ["Particular", "Amount (₹)"],
      ["Revenue", taxData.revenue?.toLocaleString() || "0"],
      ["Expenses", taxData.expenses?.toLocaleString() || "0"],
      ["Profit", ((taxData.revenue || 0) - (taxData.expenses || 0)).toLocaleString()],
      ["Taxable Income", taxData.taxableIncome?.toLocaleString() || "0"],
      ["Tax Rate", taxData.taxRate || "25%"],
      ["Estimated Tax", taxData.estimatedTax?.toLocaleString() || "0"]
    ];
    
    // Use autoTable as a function
    autoTable(doc, {
      startY: 55,
      head: [taxDetails[0]],
      body: taxDetails.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });
    
    // Add tax saving suggestions
    const suggestions = [
      "Consider registering as a startup under Startup India to avail tax benefits",
      "Explore Section 80IAC for tax holiday benefits for eligible startups",
      "Utilize R&D expenditure benefits under section 35(2AB)",
      "Consider angel tax exemption under section 56(2)(viib)"
    ];
    
    // Use doc.autoTable.previous for getting the final Y position
    let suggestionY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text("Tax Saving Suggestions", 20, suggestionY);
    
    suggestionY += 10;
    doc.setFontSize(10);
    suggestions.forEach((suggestion, index) => {
      doc.text(`• ${suggestion}`, 25, suggestionY + (index * 6));
    });
    
    // Save the PDF
    doc.save(`tax-report-${taxData.companyName || "company"}-${new Date().toLocaleDateString()}.pdf`);
    
    return true;
  } catch (error) {
    console.error("Error generating tax report:", error);
    return false;
  }
};
