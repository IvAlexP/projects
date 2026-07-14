import type { ReactNode } from "react";
import styles from "./cardWrapper.module.css";

interface CardWrapperProps {
  children: ReactNode; // allows strings, numbers, JSX etc.
  className?: string;
  onClick?: () => void;
}

export const CardWrapper = ({
  children,
  className = "",
  onClick,
}: CardWrapperProps) => {
  return (
    <div className={`${styles.baseCard} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
