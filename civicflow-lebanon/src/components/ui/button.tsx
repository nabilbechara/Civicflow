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
    primary: "bg-white text-slate-950 hover:bg-slate-100",
    secondary: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
