import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium tracking-[-0.01em] transition-all disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-slate-900 text-on-accent hover:bg-slate-800",
        secondary: "border border-slate-200 bg-surface text-slate-900 hover:bg-slate-50",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        destructive: "bg-danger text-on-accent hover:opacity-90",
        ai: "border border-ai/30 bg-ai-bg text-ai-fg hover:bg-ai/10",
        link: "h-auto px-0 text-teal-700 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-small",
        md: "h-10 px-4 text-body",
        lg: "h-11 px-5 text-base [&_svg]:size-5",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    const cls = cn(buttonVariants({ variant, size }), className);
    if (href) {
      return (
        <Link href={href} className={cls} aria-disabled={props.disabled}>
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} className={cls} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
