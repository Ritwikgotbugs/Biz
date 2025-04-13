
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getUserProfile, getChecklistItems } from '@/lib/supabase';
import { getRecommendations, addChecklistTables } from './commonUtils';

/**
 * Generate compliance report PDF
 */
export const generateComplianceReport = async (userData: any) => {
  try {
    // If userData is not provided, try to get it
    if (!userData || Object.keys(userData).length === 0) {
      userData = await getUserProfile();
    }
    
    if (!userData) {
      throw new Error('No user profile data available');
    }
    
    // Get checklist items to show completion status
    const checklistItems = await getChecklistItems();
    
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text("Compliance Status Report", pageWidth / 2, 20, { align: 'center' });
    
    // Add company details
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Company: ${userData.companyName || "Your Company"}`, 20, 40);
    doc.text(`Sector: ${userData.sector || "Technology"}`, 20, 45);
    doc.text(`Business Type: ${userData.businessType || "Private Limited Company"}`, 20, 50);
    doc.text(`State of Registration: ${userData.registrationState || "Karnataka"}`, 20, 55);
    doc.text(`Annual Turnover: ${userData.annualTurnover || "Under ₹40 lakhs"}`, 20, 60);
    doc.text(`Incorporation Date: ${userData.incorporationDate || "Not specified"}`, 20, 65);
    
    // Add compliance requirements table
    doc.setFontSize(14);
    doc.text("Required Compliances", 20, 75);
    
    const complianceData = [
      ["Compliance Requirement", "Status", "Deadline"],
      ["GST Registration", userData.hasGstRegistration ? "Completed" : "Pending", "N/A"],
      ["Income Tax Filing", userData.hasTaxFiling ? "Completed" : "Pending", "July 31, 2024"],
      ["Trademark Registration", userData.hasTrademark ? "Completed" : "Pending", "N/A"],
      ["Labour Compliances", userData.hasLabourCompliances ? "Completed" : "Pending", "Monthly"],
      ["Shop & Establishment Registration", userData.hasShopEstablishment ? "Completed" : "Pending", "Before business commencement"]
    ];
    
    // Use autoTable as a function
    autoTable(doc, {
      startY: 80,
      head: [complianceData[0]],
      body: complianceData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 20, right: 20 },
      tableWidth: 'auto'
    });
    
    // Separate completed and pending items from checklist
    const completedItems = checklistItems.filter(item => item.completed);
    const pendingItems = checklistItems.filter(item => !item.completed);
    
    // Get the final Y position after the table
    let finalY = (doc as any).lastAutoTable.finalY + 20;
    
    // Add Completed and Pending Items Tables
    finalY = addChecklistTables(doc, completedItems, pendingItems, finalY);
    
    // Add recommendations
    const recommendations = getRecommendations(userData);
    
    doc.setFontSize(14);
    doc.text("Recommendations", 20, finalY);
    
    const recommendationY = finalY + 10;
    doc.setFontSize(10);
    recommendations.forEach((recommendation, index) => {
      doc.text(`• ${recommendation}`, 25, recommendationY + (index * 6));
    });
    
    // Save the PDF with a meaningful filename
    const filename = `compliance-report-${userData.companyName ? userData.companyName.replace(/\s+/g, '-').toLowerCase() : "company"}-${new Date().toLocaleDateString()}.pdf`;
    doc.save(filename);
    
    return true;
  } catch (error) {
    console.error("Error generating compliance report:", error);
    return false;
  }
};
