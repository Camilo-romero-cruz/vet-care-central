
import { badgeVariants } from '@/components/ui/badge';
import { cva } from 'class-variance-authority';

export const extendedBadgeVariants = cva(
  badgeVariants().base,
  {
    variants: {
      variant: {
        ...badgeVariants().variants.variant,
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ExtendedBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}
