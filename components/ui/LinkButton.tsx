import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { textVariants } from "./Text";

const LinkButton = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href} className="text-primary flex items-center gap-4">
      <span
        className={cn(
          textVariants({
            variant: "body_md",
          }),
          "font-semibold text-primary",
        )}
      >
        {children}
      </span>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M19.75 11.7261L4.75 11.7261"
            stroke="#4640DE"
            strokeWidth="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.7002 5.70149L19.7502 11.7255L13.7002 17.7505"
            stroke="#4640DE"
            strokeWidth="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
};

export default LinkButton;
