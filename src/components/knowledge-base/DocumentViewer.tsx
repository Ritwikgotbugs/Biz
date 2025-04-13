
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  dateUploaded?: string;
  category?: string;
  preview?: string;
}

interface DocumentViewerProps {
  document: Document | null;
}

const DocumentViewer = ({ document }: DocumentViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (document) {
      setLoading(true);
      
      // Simulate loading document content
      const timer = setTimeout(() => {
        if (document.name.includes("compliance")) {
          setContent(`
          # Compliance Report for Tech Startups
          
          ## Executive Summary
          This report outlines the key compliance requirements for technology startups operating in India.
          
          ## Company Registration Requirements
          - Incorporation under Companies Act, 2013
          - DPIIT Registration for Startup Recognition
          - GST Registration (mandatory for annual turnover above ₹20 lakhs)
          
          ## Tax Compliance
          - Annual Filing of Income Tax Returns
          - Quarterly GST Returns (GSTR-1, GSTR-3B)
          - TDS Compliance for services above ₹30,000
          
          ## Labour Laws
          - Provident Fund Registration (mandatory if 20+ employees)
          - ESIC Registration (for businesses with 10+ employees)
          - Professional Tax Registration
          
          ## Sector-Specific Compliances
          - ISO 27001 Certification (recommended for data security)
          - GDPR Compliance (if dealing with EU customers)
          - Data Protection Requirements under IT Act
          
          ## Pending Items for Your Business
          - GST Registration Application
          - Director KYC Completion
          - Annual Returns Filing
          `);
        } else if (document.name.includes("business")) {
          setContent(`
          # Business Plan Overview
          
          ## Company Profile
          - Founded: 2023
          - Sector: Software as a Service (SaaS)
          - Market Focus: Small to Medium Businesses
          
          ## Product Description
          Our platform provides automated compliance management solutions for startups and SMEs in India, helping them navigate regulatory requirements without the need for expensive legal consultants.
          
          ## Market Analysis
          - Total Addressable Market: ₹5000 Crores
          - Annual Growth Rate: 21%
          - Key Competitors: LegalEase, ComplianceAI, RegTech Solutions
          
          ## Financial Projections
          Year 1: ₹75 Lakhs (Revenue), ₹50 Lakhs (Expenses)
          Year 2: ₹2 Crores (Revenue), ₹1.2 Crores (Expenses)
          Year 3: ₹5 Crores (Revenue), ₹2.8 Crores (Expenses)
          
          ## Funding Requirements
          Seeking ₹3 Crores in Seed Funding to cover:
          - Product Development (₹1.2 Crores)
          - Marketing & Customer Acquisition (₹1 Crore)
          - Operations & Compliance (₹80 Lakhs)
          `);
        } else if (document.name.includes("tax")) {
          setContent(`
          # Tax Documentation
          
          ## GST Registration Details
          - GSTIN: (Pending Application)
          - Registration Type: Regular
          - Jurisdiction: Karnataka
          
          ## Income Tax
          - PAN: AABCT1234D
          - TAN: BLRT12345A
          - Assessment Year: 2023-24
          - Tax Regime: New Regime
          
          ## Tax Filing Schedule
          - ITR Filing Due: July 31, 2024
          - GSTR-1: Monthly (10th of succeeding month)
          - GSTR-3B: Monthly (20th of succeeding month)
          - TDS Returns: Quarterly
          
          ## Tax Benefits Available
          - Section 80IAC (Startup India Benefits)
          - Section 35(2AB) (R&D Expenditure)
          - Section 80JJAA (New Employment)
          
          ## Documentation Pending
          - Company PAN Card
          - Digital Signature Certificate for Directors
          - Bank Account Statement for Last 6 Months
          `);
        } else {
          setContent("No preview available for this document type.");
        }
        
        setLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [document]);

  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No document selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="animate-pulse">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <p className="mt-4 text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {content && (
        <div className="prose max-w-none">
          {content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.replace('# ', '')}</h1>;
            } else if (line.startsWith('## ')) {
              return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{line.replace('## ', '')}</h2>;
            } else if (line.startsWith('- ')) {
              return <li key={index} className="ml-6 my-1">{line.replace('- ', '')}</li>;
            } else if (line.trim() === '') {
              return <br key={index} />;
            } else {
              return <p key={index} className="my-2">{line}</p>;
            }
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
