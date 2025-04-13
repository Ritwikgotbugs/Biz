
/**
 * Re-exports all report generation functions from their specialized modules
 * This maintains backward compatibility with code that imports from downloadUtils.ts
 */

export { generateComplianceReport } from './reports/complianceReport';
export { generateTaxReport } from './reports/taxReport';
export { downloadBusinessPlanTemplate } from './reports/businessPlanTemplate';
export { generateSectorComplianceChecklist } from './reports/sectorComplianceChecklist';
