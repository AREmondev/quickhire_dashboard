import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { textVariants } from "./Text";

export const buttonVariants = cva(
  "inline-flex  items-center justify-center whitespace-nowrap font-poppins text-sm font-semibold transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary !text-white h-[50px] px-6",
        transparent: "!text-primary bg-transparent text-black",
        white: "bg-white !text-primary h-[50px] px-6",
      },
    },

    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends
    ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant }),
          textVariants({
            variant: "button",
          }),
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
