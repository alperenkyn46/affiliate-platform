"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "success" | "danger" | "outline";
  size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-semibold rounded-full",
          {
            "bg-secondary-light text-white": variant === "default",
            "bg-gradient-to-r from-gold to-gold-light text-background": variant === "gold",
            "bg-accent-green/20 text-accent-green": variant === "success",
            "bg-accent-red/20 text-accent-red": variant === "danger",
            "border border-gold/50 text-gold bg-transparent": variant === "outline",
          },
          {
            "px-2 py-0.5 text-xs": size === "sm",
            "px-3 py-1 text-sm": size === "md",
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
