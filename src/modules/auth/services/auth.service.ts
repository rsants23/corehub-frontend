import { httpClient } from "@/services/http-client";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const USE_MOCK = true;

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    if (USE_MOCK) {
      return {
        token: "mock-token",
        user: {
          id: "1",
          name: "Coordenação Clínica",
          email,
        },
      };
    }
    return httpClient.post<LoginResponse>("/auth/login", { email, password });
  },
};
