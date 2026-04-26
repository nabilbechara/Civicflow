import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--primary-cta)] text-white shadow-sm hover:scale-[1.03] hover:bg-[var(--primary-cta-hover)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-[0.98]",
    secondary:
      "border border-[var(--primary-cta)] bg-white text-[var(--primary-cta)] hover:bg-blue-50",
    ghost: "text-[var(--text-muted)] hover:bg-blue-50 hover:text-[var(--primary)]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
