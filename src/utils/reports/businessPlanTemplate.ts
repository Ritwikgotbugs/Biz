
import jsPDF from 'jspdf';
import { getUserProfile } from '@/lib/supabase';

/**
 * Generate business plan template
 */
export const downloadBusinessPlanTemplate = async () => {
  try {
    // Get user profile for company name
    const userProfile = await getUserProfile();
    
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text("Business Plan Template", pageWidth / 2, 20, { align: 'center' });
    
    // Add company name if available
    if (userProfile && userProfile.companyName) {
      doc.setFontSize(16);
      doc.text(`For: ${userProfile.companyName}`, pageWidth / 2, 30, { align: 'center' });
    }
    
    // Add generated date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 38, { align: 'center' });
    
    // Add sections
    const sections = [
      { title: "1. Executive Summary", content: [
        "Business Name:",
        "Business Location:",
        "Business Model:",
        "Vision & Mission:",
        "Products/Services:",
        "Target Market:",
        "USP (Unique Selling Proposition):",
        "Funding Requirements:"
      ]},
      { title: "2. Company Description", content: [
        "Company Background:",
        "Legal Structure:",
        "Industry Analysis:",
        "Growth Opportunities:",
        "Business Goals:"
      ]},
      { title: "3. Market Analysis", content: [
        "Target Market Demographics:",
        "Market Size:",
        "Market Trends:",
        "Competitor Analysis:",
        "SWOT Analysis:"
      ]},
      { title: "4. Organization & Management", content: [
        "Organizational Structure:",
        "Management Team:",
        "Board of Directors/Advisors:",
        "Legal & Accounting Support:"
      ]},
      { title: "5. Products or Services", content: [
        "Description:",
        "Life Cycle:",
        "Intellectual Property:",
        "R&D Activities:"
      ]},
      { title: "6. Marketing & Sales Strategy", content: [
        "Marketing Channels:",
        "Pricing Strategy:",
        "Sales Strategy:",
        "Growth Strategy:"
      ]},
      { title: "7. Financial Projections", content: [
        "Income Statement:",
        "Balance Sheet:",
        "Cash Flow Statement:",
        "Break-even Analysis:",
        "Funding Requirements:",
        "Use of Funds:"
      ]},
      { title: "8. Compliance & Regulatory Requirements", content: [
        "Licenses Required:",
        "Permits Required:",
        "Tax Obligations:",
        "Labor Law Compliance:",
        "Industry-specific Regulations:"
      ]},
      { title: "9. Risk Assessment", content: [
        "Internal Risks:",
        "External Risks:",
        "Mitigation Strategies:"
      ]},
      { title: "10. Implementation Timeline", content: [
        "Key Milestones:",
        "Launch Plan:",
        "Scaling Strategy:"
      ]}
    ];
    
    let yPosition = 30;
    
    sections.forEach(section => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(section.title, 20, yPosition);
      doc.setFont(undefined, 'normal');
      
      yPosition += 10;
      doc.setFontSize(10);
      
      section.content.forEach(item => {
        doc.text(`• ${item}`, 25, yPosition);
        yPosition += 7;
      });
      
      yPosition += 10;
    });
    
    // Save the PDF with company name if available
    const companyName = userProfile?.companyName ? 
      `-${userProfile.companyName.replace(/\s+/g, '-').toLowerCase()}` : '';
    const filename = `business-plan-template${companyName}-${new Date().toLocaleDateString()}.pdf`;
    doc.save(filename);
    
    return true;
  } catch (error) {
    console.error("Error generating business plan template:", error);
    return false;
  }
};
