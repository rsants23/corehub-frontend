import { API_BASE_URL } from "@/constants/api";
import {
  createConnectionError,
  normalizeApiError,
  type NestJsErrorBody,
} from "@/services/api-error";
import { triggerUnauthorized } from "@/services/auth-interceptor";

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** Quando true, não envia cookie de sessão (ex.: login) */
  skipAuth?: boolean;
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {}, skipAuth = false } = options;

    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        credentials: skipAuth ? "same-origin" : "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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
        triggerUnauthorized();
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

  put<T>(
    endpoint: string,
    body: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
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

export const httpClient = new HttpClient(API_BASE_URL);

/** @deprecated Importe ApiError de @/services/api-error */
export { ApiError as HttpError } from "@/services/api-error";
