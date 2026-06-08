"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useToastStore } from "@/stores/toast-store";

export function ToastContainer() {
  const message = useToastStore((state) => state.message);
  const variant = useToastStore((state) => state.variant);

  if (!message) return null;

  const isError = variant === "error";

  return (
    <div
      className={`fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg ${
        isError
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-emerald-200 bg-background"
      }`}
    >
      {isError ? (
        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
      ) : (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
      )}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
