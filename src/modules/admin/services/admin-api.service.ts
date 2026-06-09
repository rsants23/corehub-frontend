import { API_ENDPOINTS } from "@/constants/api";
import { adminHttpClient } from "@/services/admin-http-client";
import type {
  AdminClinic,
  AdminClinicUser,
  AdminDashboardStats,
  AdminInvoice,
  AdminPlan,
  AdminSubscription,
  BillingCycle,
  ClinicStatus,
  CreateClinicPayload,
  DiscountType,
  SubscriptionStatus,
} from "@/types/admin";

export const adminApiService = {
  getDashboardStats() {
    return adminHttpClient.get<AdminDashboardStats>(
      API_ENDPOINTS.admin.dashboardStats,
    );
  },

  listPlans() {
    return adminHttpClient.get<AdminPlan[]>(API_ENDPOINTS.admin.plans);
  },

  createPlan(payload: Partial<AdminPlan>) {
    return adminHttpClient.post<AdminPlan>(
      API_ENDPOINTS.admin.plans,
      payload,
    );
  },

  updatePlan(id: string, payload: Partial<AdminPlan>) {
    return adminHttpClient.patch<AdminPlan>(
      API_ENDPOINTS.admin.planById(id),
      payload,
    );
  },

  deactivatePlan(id: string) {
    return adminHttpClient.delete<void>(API_ENDPOINTS.admin.planById(id));
  },

  listClinics() {
    return adminHttpClient.get<AdminClinic[]>(API_ENDPOINTS.admin.clinics);
  },

  getClinic(id: string) {
    return adminHttpClient.get<AdminClinic>(API_ENDPOINTS.admin.clinicById(id));
  },

  createClinic(payload: CreateClinicPayload) {
    return adminHttpClient.post<AdminClinic>(
      API_ENDPOINTS.admin.clinics,
      payload,
    );
  },

  updateClinic(id: string, payload: Partial<AdminClinic>) {
    return adminHttpClient.patch<AdminClinic>(
      API_ENDPOINTS.admin.clinicById(id),
      payload,
    );
  },

  updateClinicStatus(id: string, status: ClinicStatus) {
    return adminHttpClient.patch<{ id: string; status: ClinicStatus }>(
      API_ENDPOINTS.admin.clinicStatus(id),
      { status },
    );
  },

  getSubscription(clinicId: string) {
    return adminHttpClient.get<AdminSubscription | null>(
      API_ENDPOINTS.admin.clinicSubscription(clinicId),
    );
  },

  updateSubscription(
    clinicId: string,
    payload: {
      planId?: string;
      status?: SubscriptionStatus;
      startsAt?: string;
      expiresAt?: string;
      billingCycle?: BillingCycle;
      basePrice?: number;
      discountType?: DiscountType;
      discountValue?: number;
      notes?: string;
    },
  ) {
    return adminHttpClient.patch<AdminSubscription>(
      API_ENDPOINTS.admin.clinicSubscription(clinicId),
      payload,
    );
  },

  renewSubscription(
    clinicId: string,
    payload?: {
      expiresAt?: string;
      billingCycle?: BillingCycle;
      status?: SubscriptionStatus;
    },
  ) {
    return adminHttpClient.post<AdminSubscription>(
      API_ENDPOINTS.admin.clinicSubscriptionRenew(clinicId),
      payload ?? {},
    );
  },

  listInvoices(clinicId: string) {
    return adminHttpClient.get<AdminInvoice[]>(
      API_ENDPOINTS.admin.clinicInvoices(clinicId),
    );
  },

  createInvoice(
    clinicId: string,
    payload: {
      subscriptionId?: string;
      amount: number;
      discountAmount?: number;
      dueDate: string;
      paymentMethod?: string;
      reference?: string;
      notes?: string;
    },
  ) {
    return adminHttpClient.post<AdminInvoice>(
      API_ENDPOINTS.admin.clinicInvoices(clinicId),
      payload,
    );
  },

  markInvoicePaid(
    invoiceId: string,
    payload?: { paymentMethod?: string; reference?: string; notes?: string },
  ) {
    return adminHttpClient.post<AdminInvoice>(
      API_ENDPOINTS.admin.invoiceMarkPaid(invoiceId),
      payload ?? {},
    );
  },

  cancelInvoice(invoiceId: string) {
    return adminHttpClient.post<AdminInvoice>(
      API_ENDPOINTS.admin.invoiceCancel(invoiceId),
      {},
    );
  },

  listClinicUsers(clinicId: string) {
    return adminHttpClient.get<AdminClinicUser[]>(
      API_ENDPOINTS.admin.clinicUsers(clinicId),
    );
  },
};
