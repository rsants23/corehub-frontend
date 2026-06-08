"use client";

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

export function triggerUnauthorized() {
  onUnauthorized?.();
}
