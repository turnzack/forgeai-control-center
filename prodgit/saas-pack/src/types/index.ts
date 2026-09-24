export interface Metric {
  id: string;
  label: string;
  value: string;
  trend: number;
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  maxUsers: number;
  recommended?: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  date: string;
  customerName?: string;
  customerEmail?: string;
  planName?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Developer" | "Viewer";
  avatar: string;
  joinedAt?: string;
}
