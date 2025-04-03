
import * as React from "react";
import { cn } from "@/lib/utils";
import { extendedBadgeVariants, ExtendedBadgeProps } from "./badge-variants";

function ExtendedBadge({ className, variant, ...props }: ExtendedBadgeProps) {
  return (
    <div className={cn(extendedBadgeVariants({ variant }), className)} {...props} />
  );
}

export { ExtendedBadge, extendedBadgeVariants };
