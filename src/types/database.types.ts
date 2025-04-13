
export interface UserProfile {
  id: string;
  companyName: string;
  incorporationDate: string;
  registrationState: string;
  annualTurnover: string;
  employeeCount: string;
  sector: string;
  businessType: string;
  created_at?: string;
}

export interface ChecklistItem {
  id: string;
  user_id: string;
  item_id: string;
  title: string;
  category: string;
  description: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  created_at?: string;
  updated_at?: string;
}
