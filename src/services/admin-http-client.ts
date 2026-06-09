import { API_BASE_URL } from "@/constants/api";
import {
  createConnectionError,
  normalizeApiError,
  type NestJsErrorBody,
} from "@/services/api-error";
import type { HttpMethod, RequestOptions } from "@/services/http-client";

const ADMIN_AUTH_STORAGE_KEY = "corehub-admin-auth";

function getAdminAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {
      state?: { token?: string | null };
    };

    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
}

let onUnauthorized: (() => void) | null = null;

export function setAdminUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

class AdminHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = "GET",
      body,
      headers = {},
      skipAuth = false,
      token: explicitToken,
    } = options;

    const authHeaders: Record<string, string> = {};
    if (!skipAuth) {
      const token = explicitToken ?? getAdminAuthToken();
      if (token) {
        authHeaders.Authorization = `Bearer ${token}`;
      }
    }

    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeaders,
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw createConnectionError();
    }

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => null)) as NestJsErrorBody | null;

      if (response.status === 401 && !skipAuth) {
        onUnauthorized?.();
      }

      throw normalizeApiError(response.status, errorData);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    return JSON.parse(text) as T;
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(
    endpoint: string,
    body: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  patch<T>(
    endpoint: string,
    body: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const adminHttpClient = new AdminHttpClient(API_BASE_URL);

export type { HttpMethod, RequestOptions };
