import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const chipVariants = cva(
  "inline-flex text-nowrap cursor-pointer border-box font-poppins uppercase  items-center justify-center h-[32px] px-[24px] rounded-full text-[14px] font-medium transition-colors",
  {
    variants: {
      variant: {
        outline: "border border-gray text-black bg-transparent",

        filled: "bg-red-500 text-white",
      },
    },

    defaultVariants: {
      variant: "outline",
    },
  },
);

export interface ChipProps
  extends ComponentPropsWithoutRef<"div">, VariantProps<typeof chipVariants> {}

export const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(chipVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

Chip.displayName = "Chip";
