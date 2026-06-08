"use client";

import { create } from "zustand";

export type ToastVariant = "success" | "error";

interface ToastState {
  message: string | null;
  variant: ToastVariant;
  showToast: (message: string, variant?: ToastVariant) => void;
  clearToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  variant: "success",
  showToast: (message, variant = "success") => {
    set({ message, variant });
    setTimeout(() => set({ message: null }), 3000);
  },
  clearToast: () => set({ message: null }),
}));
