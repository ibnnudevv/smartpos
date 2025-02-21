import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-600 text-green-50",
        error: "border-transparent bg-red-600 text-red-50",
        warning: "border-transparent bg-yellow-600 text-yellow-50",
        info: "border-transparent bg-blue-600 text-blue-50",
        "outline-secondary": "border-gray-700 text-gray-700 font-medium",
        "outline-success": "border-green-700 text-green-700 font-medium",
        "outline-error": "border-red-700 text-red-700 font-medium",
        "outline-warning": "border-yellow-700 text-yellow-700 font-medium",
        "outline-info": "border-blue-700 text-blue-700 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
