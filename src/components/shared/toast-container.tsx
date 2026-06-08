"use client";

import { CheckCircle2 } from "lucide-react";
import { useToastStore } from "@/stores/toast-store";

export function ToastContainer() {
  const message = useToastStore((state) => state.message);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-lg border bg-background px-4 py-3 shadow-lg">
      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
