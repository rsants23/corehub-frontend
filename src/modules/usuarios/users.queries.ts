"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export const usersService = {
  list: () => httpClient.get<ApiUser[]>(API_ENDPOINTS.users),
  getById: (id: string) =>
    httpClient.get<ApiUser>(`${API_ENDPOINTS.users}/${id}`),
  create: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => httpClient.post<ApiUser>(API_ENDPOINTS.users, data),
  inactivate: (id: string) =>
    httpClient.patch<ApiUser>(`${API_ENDPOINTS.users}/${id}/inactivate`, {}),
};

export function useUsersQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => usersService.list(),
  });
}
