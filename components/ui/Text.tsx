import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ElementType, forwardRef } from "react";
import { cva, VariantProps } from "class-variance-authority";

/* Default semantic tags */

const defaultTagMap = {
  h1: "h1",
  h2: "h2",
  title_lg: "h3",

  body_xl: "p",
  body_lg: "p",
  body_md: "p",
  body_sm: "h6",

  button: "span",
} as const;

export const textVariants = cva("text-neutral-80", {
  variants: {
    variant: {
      /* Headings */

      h1: "text-[72px] leading-[79px] font-semibold",

      h2: "text-[48px] leading-[53px] font-semibold",

      title_lg: "text-[24px] leading-[29px] font-semibold",

      /* Body */

      body_xl: "text-[20px] leading-[32px] font-normal",

      body_lg: "text-[18px] leading-[29px] font-normal",

      body_md: "text-[16px] leading-[26px] font-medium",

      body_sm: "text-[16px] leading-[26px] font-normal",

      /* Button */

      button: "text-[16px] leading-[26px] font-bold",
    },

    fontFamily: {
      clash: "font-clash",
      epilogue: "font-epilogue",
      inter: "font-inter",
    },

    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },

  defaultVariants: {
    variant: "body_md",
    fontFamily: "epilogue",
    align: "left",
  },
});

export interface TextProps
  extends ComponentPropsWithoutRef<"p">, VariantProps<typeof textVariants> {
  as?: ElementType;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    { className, variant = "body_md", fontFamily, align, as, ...props },
    ref,
  ) => {
    const Component =
      as ||
      (defaultTagMap[variant as keyof typeof defaultTagMap] as ElementType) ||
      "p";

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant, fontFamily, align }), className)}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";
