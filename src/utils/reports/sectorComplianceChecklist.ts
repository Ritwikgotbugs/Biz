
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getUserProfile, getChecklistItems } from '@/lib/supabase';
import { addChecklistTables } from './commonUtils';

/**
 * Generate sector-specific compliance checklist PDF
 */
export const generateSectorComplianceChecklist = async (userData: any) => {
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
    const sector = userData.sector || "Technology";
    doc.text(`${sector} Sector Compliance Checklist`, pageWidth / 2, 20, { align: 'center' });
    
    // Add company details
    doc.setFontSize(12);
    doc.text(`Generated for: ${userData.companyName || "Your Company"}`, 20, 30);
    doc.text(`Business Type: ${userData.businessType || "Private Limited Company"}`, 20, 35);
    doc.text(`State: ${userData.registrationState || "Karnataka"}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    
    // Define sector-specific compliances
    const compliancesBySector: Record<string, Array<{name: string, description: string, deadline: string, link: string}>> = {
      "Technology": [
        {name: "GST Registration", description: "Mandatory for businesses with turnover above ₹20 lakhs", deadline: "Before starting operations", link: "https://www.gst.gov.in/"},
        {name: "Shop & Establishment Act", description: "Registration under local municipal corporation", deadline: "Within 30 days of starting business", link: "https://shramsuvidha.gov.in/"},
        {name: "Professional Tax", description: "Registration and payment for employees", deadline: "Monthly/Quarterly as applicable", link: "https://www.gst.gov.in/"},
        {name: "Trademark Registration", description: "Protection for company name and logo", deadline: "As early as possible", link: "https://ipindia.gov.in/"},
        {name: "MSME Registration", description: "Benefits for small and medium enterprises", deadline: "Optional but recommended", link: "https://udyamregistration.gov.in/"},
        {name: "IT Act Compliance", description: "Privacy policy, terms of service for websites/apps", deadline: "Before launch", link: "#"},
        {name: "Labour Laws Compliance", description: "If hiring employees (PF, ESI, etc.)", deadline: "Before hiring", link: "https://www.epfindia.gov.in/"},
      ],
      "Food": [
        {name: "FSSAI License", description: "Food Safety and Standards Authority of India license", deadline: "Before starting operations", link: "https://foscos.fssai.gov.in/"},
        {name: "GST Registration", description: "Mandatory for businesses with turnover above ₹20 lakhs", deadline: "Before starting operations", link: "https://www.gst.gov.in/"},
        {name: "Health Trade License", description: "From local municipal corporation", deadline: "Before starting operations", link: "#"},
        {name: "Fire Safety License", description: "For restaurant premises", deadline: "Before starting operations", link: "#"},
        {name: "Eating House License", description: "From police department", deadline: "Before starting operations", link: "#"},
        {name: "Weights & Measures License", description: "If using weighing equipment", deadline: "Before starting operations", link: "#"},
        {name: "Liquor License", description: "If serving alcohol", deadline: "Before serving alcohol", link: "#"},
      ],
      "E-commerce": [
        {name: "GST Registration", description: "Mandatory for e-commerce businesses", deadline: "Before starting operations", link: "https://www.gst.gov.in/"},
        {name: "Shop & Establishment Act", description: "For office premises", deadline: "Within 30 days of setup", link: "https://shramsuvidha.gov.in/"},
        {name: "Consumer Protection Rules", description: "E-commerce specific rules compliance", deadline: "Before launch", link: "#"},
        {name: "Trademark Registration", description: "Protection for brand and logo", deadline: "As early as possible", link: "https://ipindia.gov.in/"},
        {name: "Payment Aggregator Compliance", description: "For payment processing", deadline: "Before accepting payments", link: "#"},
      ],
      // Add other sectors here
    };
    
    // Map sector name to the formats used in our dictionary
    const sectorKey = sector.charAt(0).toUpperCase() + sector.slice(1).toLowerCase();
    
    // Get compliances for user's sector or default to Technology
    const compliances = compliancesBySector[sector] || compliancesBySector["Technology"];
    
    // Create compliance table
    const tableData = [["Compliance", "Description", "Deadline"]];
    compliances.forEach(item => {
      tableData.push([item.name, item.description, item.deadline]);
    });
    
    // Add table to PDF with adjusted column widths
    autoTable(doc, {
      startY: 55,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 90 },
        2: { cellWidth: 40 }
      },
      margin: { left: 15, right: 15 },
    });
    
    // Get the final Y position after the table
    let finalY = (doc as any).lastAutoTable.finalY + 20;
    
    // Filter checklist items by sector
    let sectorItems = checklistItems;
    
    // If we have sector information, filter by it
    if (sector) {
      sectorItems = checklistItems.filter(item => 
        item.category?.toLowerCase() === sector.toLowerCase() ||
        item.title?.includes(sector)
      );
      
      // If no items match the sector filter, use all items
      if (sectorItems.length === 0) {
        sectorItems = checklistItems;
      }
    }
    
    const completedItems = sectorItems.filter(item => item.completed);
    const pendingItems = sectorItems.filter(item => !item.completed);
    
    // Add Completed and Pending Items Tables
    doc.setFontSize(16);
    doc.text("Your Startup Checklist Progress", 20, finalY);
    finalY += 10;
    
    // Add Completed and Pending Items Tables using the common utility
    finalY = addChecklistTables(doc, completedItems, pendingItems, finalY);
    
    // Add links section
    doc.setFontSize(14);
    doc.text("Useful Links", 20, finalY);
    
    const linksY = finalY + 10;
    doc.setFontSize(10);
    
    compliances.forEach((compliance, index) => {
      if (index < 9) { // Limit to prevent overflow
        doc.text(`• ${compliance.name}: `, 25, linksY + (index * 7));
        doc.setTextColor(0, 0, 255);
        const textWidth = doc.getTextWidth(`• ${compliance.name}: `);
        doc.text(compliance.link, 25 + textWidth, linksY + (index * 7));
        doc.setTextColor(33, 37, 41); // Reset text color
      }
    });
    
    // Save the PDF with a meaningful filename
    const filename = `${sector.toLowerCase()}-sector-compliance-checklist.pdf`;
    doc.save(filename);
    
    return true;
  } catch (error) {
    console.error("Error generating sector checklist:", error);
    return false;
  }
};
