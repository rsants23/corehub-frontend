export type ClinicStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "OVERDUE"
  | "SUSPENDED"
  | "CANCELED";
export type BillingCycle = "MONTHLY" | "YEARLY";
export type DiscountType = "NONE" | "PERCENTAGE" | "FIXED";
export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELED";

export interface AdminPlan {
  id: string;
  name: string;
  description: string | null;
  monthlyPrice: number;
  annualPrice: number;
  maxPatients: number | null;
  maxTherapists: number | null;
  maxUsers: number | null;
  isActive: boolean;
}

export interface AdminSubscription {
  id: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  startsAt: string;
  expiresAt: string;
  billingCycle: BillingCycle;
  basePrice: number;
  discountType: DiscountType;
  discountValue: number;
  finalPrice: number;
  daysRemaining: number;
  notes: string | null;
}

export interface AdminClinic {
  id: string;
  tenantId: string;
  legalName: string;
  tradeName: string;
  cnpj: string;
  email: string | null;
  phone?: string | null;
  responsibleName?: string | null;
  internalNotes?: string | null;
  status: ClinicStatus;
  createdAt: string;
  updatedAt: string;
  userCount: number;
  patientCount: number;
  therapistCount: number;
  lastAccessAt: string | null;
  subscription: AdminSubscription | null;
}

export interface AdminClinicUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  therapist: { id: string; name: string } | null;
  lastAccessAt: string | null;
}

export interface AdminInvoice {
  id: string;
  clinicId: string;
  subscriptionId: string | null;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt: string | null;
  paymentMethod: string | null;
  reference: string | null;
  notes: string | null;
}

export interface AdminDashboardStats {
  totalClinics: number;
  activeClinics: number;
  inactiveClinics: number;
  totalUsers: number;
  totalPatients: number;
  monthlyProjectedRevenue: number;
  paidRevenueThisMonth: number;
  pendingRevenue: number;
  overdueRevenue: number;
  overdueInvoicesCount: number;
  pendingInvoicesCount: number;
  licensesExpiringIn7Days: number;
  apiHealth: {
    status: string;
    database: string;
    timestamp: string;
  };
}

export interface CreateClinicPayload {
  tradeName: string;
  legalName: string;
  cnpj: string;
  email?: string;
  phone?: string;
  responsibleName?: string;
  status?: ClinicStatus;
  planId: string;
  licenseStartsAt: string;
  licenseExpiresAt: string;
  billingCycle?: BillingCycle;
  subscriptionStatus?: SubscriptionStatus;
  discountType?: DiscountType;
  discountValue?: number;
  internalNotes?: string;
}
