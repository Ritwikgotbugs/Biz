
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getUserProfile, getChecklistItems } from '@/lib/supabase';

/**
 * Common utility functions for PDF report generation
 */

/**
 * Get customized recommendations based on user profile
 */
export const getRecommendations = (userData: any) => {
  const recommendations = [
    "Complete all pending compliance registrations",
    "Set up regular reminders for filing deadlines",
    "Consult with a CA for tax optimization strategies",
    "Maintain proper documentation for all registrations"
  ];
  
  // Add sector-specific recommendations
  if (userData.sector === "Technology") {
    recommendations.push("Consider trademark and patent protection for your tech innovations");
    recommendations.push("Ensure compliance with IT Act and data protection regulations");
  } else if (userData.sector === "E-commerce") {
    recommendations.push("Register under the Consumer Protection (E-commerce) Rules, 2020");
    recommendations.push("Ensure proper return and refund policies are in place");
  } else if (userData.sector === "Food") {
    recommendations.push("Obtain FSSAI license before commencing operations");
    recommendations.push("Ensure regular health and hygiene audits for your premises");
  }
  
  // Add business-type specific recommendations
  if (userData.businessType === "Private Limited Company") {
    recommendations.push("Schedule mandatory board meetings (minimum 4 per year)");
    recommendations.push("Plan for your Annual General Meeting within 6 months of financial year end");
  } else if (userData.businessType === "LLP") {
    recommendations.push("Prepare for filing Form 8 and Form 11 annual returns");
  }
  
  return recommendations;
};

/**
 * Format checklist items into table data for completed items
 */
export const formatCompletedItems = (completedItems: any[]) => {
  if (completedItems.length === 0) {
    return [];
  }
  
  const completedData = [
    ["Item", "Category", "Priority"]
  ];
  
  completedItems.forEach(item => {
    completedData.push([
      item.title,
      item.category || "General",
      item.priority || "Medium"
    ]);
  });
  
  return completedData;
};

/**
 * Format checklist items into table data for pending items
 */
export const formatPendingItems = (pendingItems: any[]) => {
  if (pendingItems.length === 0) {
    return [];
  }
  
  const pendingData = [
    ["Item", "Category", "Priority"]
  ];
  
  pendingItems.forEach(item => {
    pendingData.push([
      item.title,
      item.category || "General",
      item.priority || "Medium"
    ]);
  });
  
  return pendingData;
};

/**
 * Add completed and pending items tables to the PDF
 */
export const addChecklistTables = (doc: jsPDF, completedItems: any[], pendingItems: any[], finalY: number) => {
  let currentY = finalY;
  
  // Add Completed Items Table
  doc.setFontSize(14);
  doc.text("Completed Compliance Items", 20, currentY);
  
  if (completedItems.length > 0) {
    const completedData = formatCompletedItems(completedItems);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [completedData[0]],
      body: completedData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 255, 240] },
      margin: { left: 20, right: 20 },
      tableWidth: 'auto'
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.text("No completed compliance items found.", 25, currentY + 10);
    currentY += 20;
  }
  
  // Add Pending Items Table
  doc.setFontSize(14);
  doc.text("Pending Compliance Items", 20, currentY);
  
  if (pendingItems.length > 0) {
    const pendingData = formatPendingItems(pendingItems);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [pendingData[0]],
      body: pendingData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [211, 47, 47], textColor: 255 },
      alternateRowStyles: { fillColor: [255, 240, 240] },
      margin: { left: 20, right: 20 },
      tableWidth: 'auto'
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.text("No pending compliance items found.", 25, currentY + 10);
    currentY += 20;
  }
  
  return currentY;
};
