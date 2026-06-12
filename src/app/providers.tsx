"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { IdleLogoutProvider } from "@/components/providers/idle-logout-provider";
import { ToastContainer } from "@/components/shared/toast-container";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (
            error &&
            typeof error === "object" &&
            "status" in error &&
            typeof (error as { status: number }).status === "number"
          ) {
            const status = (error as { status: number }).status;
            if (status >= 400 && status < 500) return false;
          }
          return failureCount < 2;
        },
      },
      mutations: { retry: false },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <IdleLogoutProvider>
          {children}
          <ToastContainer />
        </IdleLogoutProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
