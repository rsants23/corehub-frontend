"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";

type BrandLogoVariant = "full" | "icon";
type BrandLogoSize = "sm" | "md" | "lg";

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  showText?: boolean;
  subtitle?: string;
  className?: string;
  priority?: boolean;
}

const sizeConfig = {
  sm: { icon: 32, fullMaxWidth: 32, fullMaxHeight: 32 },
  md: { icon: 40, fullMaxWidth: 140, fullMaxHeight: 48 },
  lg: { icon: 180, fullMaxWidth: 180, fullMaxHeight: 216 },
} as const;

export function BrandLogo({
  variant = "full",
  size = "md",
  showText = false,
  subtitle,
  className,
  priority = false,
}: BrandLogoProps) {
  const config = sizeConfig[size];

  if (variant === "icon") {
    if (showText) {
      return (
        <div className={cn("flex min-w-0 items-center gap-3", className)}>
          <Image
            src="/favicon.png"
            alt="Efata CoreHub"
            width={config.icon}
            height={config.icon}
            className="h-auto w-auto max-h-full max-w-full shrink-0 object-contain"
            priority={priority}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Efata CoreHub</p>
            {subtitle ? (
              <p className="truncate text-xs text-sidebar-foreground/70">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <Image
        src="/favicon.png"
        alt="Efata CoreHub"
        width={config.icon}
        height={config.icon}
        className={cn(
          "h-auto w-auto max-h-full max-w-full shrink-0 object-contain",
          className,
        )}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="Efata CoreHub"
      width={config.fullMaxWidth}
      height={config.fullMaxHeight}
      className={cn(
        "h-auto w-auto max-w-full object-contain",
        size === "lg" && "mx-auto",
        className,
      )}
      style={{ maxWidth: config.fullMaxWidth, maxHeight: config.fullMaxHeight }}
      priority={priority}
    />
  );
}
