"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-gradient-to-r from-gold to-gold-light text-background hover:from-gold-light hover:to-gold":
              variant === "primary",
            "bg-secondary-light text-white hover:bg-secondary border border-white/10":
              variant === "secondary",
            "bg-transparent border-2 border-gold text-gold hover:bg-gold/10":
              variant === "outline",
            "bg-transparent text-white hover:text-gold hover:bg-white/5":
              variant === "ghost",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-2.5 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          glow && variant === "primary" && "animate-pulse-glow shadow-glow hover:shadow-glow-lg",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
