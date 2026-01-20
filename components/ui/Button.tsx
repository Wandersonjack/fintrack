import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'brand';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    const variants = {
      default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90",
      destructive: "bg-red-500 text-zinc-50 hover:bg-red-500/90",
      outline: "border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900",
      secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80",
      ghost: "hover:bg-zinc-100 text-zinc-700",
      link: "text-zinc-900 underline-offset-4 hover:underline",
      brand: "bg-brand-400 text-zinc-950 hover:bg-brand-500 font-black uppercase tracking-widest shadow-lg shadow-brand-400/20",
    };

    const sizes = {
      default: "h-11 px-6 py-2",
      sm: "h-9 rounded-xl px-3 text-xs",
      lg: "h-14 rounded-2xl px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-current" />
          </div>
        )}
        <span className={cn("flex items-center justify-center gap-2", isLoading && "invisible")}>
          {children}
        </span>
      </button>
    );
  }
);
Button.displayName = "Button";