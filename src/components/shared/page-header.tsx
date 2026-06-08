"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

interface PageHeaderProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  onAction,
  actionDisabled,
  children,
}: PageHeaderProps) {
  const hasTitle = Boolean(title || description);
  const hasAction = Boolean(actionLabel || children);

  if (!hasTitle && !hasAction) {
    return null;
  }

  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center",
        hasTitle ? "sm:justify-between" : "sm:justify-end",
      )}
    >
      {hasTitle && (
        <div>
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
      {actionLabel && (
        <Button onClick={onAction} disabled={actionDisabled}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
