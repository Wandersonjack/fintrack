
import React from "react";
import { cn } from "../../lib/utils";

/**
 * Fix: Explicitly adding className to the interface ensures it is recognized
 * during prop destructuring and usage in components, avoiding TS2339 errors.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "brand";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80",
    secondary: "border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80",
    destructive: "border-transparent bg-red-500 text-zinc-50 hover:bg-red-500/80",
    outline: "text-zinc-950 border-zinc-200",
    brand: "border-transparent bg-brand-400 text-zinc-950 font-black",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
