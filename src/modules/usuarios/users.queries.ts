"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS, API_ENDPOINTS } from "@/constants/api";
import { httpClient } from "@/services/http-client";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  therapist?: { id: string; name: string } | null;
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
    therapistId?: string;
  }) => httpClient.post<ApiUser>(API_ENDPOINTS.users, data),
  inactivate: (id: string) =>
    httpClient.delete<ApiUser>(`${API_ENDPOINTS.users}/${id}`),
};

export function useUsersQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: () => usersService.list(),
  });
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });

  const inactivate = useMutation({
    mutationFn: usersService.inactivate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });

  return { create, inactivate };
}
