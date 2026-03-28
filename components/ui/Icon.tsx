import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface IconProps {
  icon: IconDefinition;
  className?: string;
  size?: "xs" | "sm" | "lg" | "xl" | "2xl";
}

export const Icon = ({ icon, className = "w-5 h-5", size }: IconProps) => {
  return <FontAwesomeIcon icon={icon} className={className} size={size} />;
};
