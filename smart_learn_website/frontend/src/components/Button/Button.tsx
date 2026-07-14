import { Link } from "react-router-dom";
import styles from "./button.module.css";

interface ButtonProps {
  text: string;
  variant?: "primary" | "light" | "danger" | "lightDanger";
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  to?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button = ({
  text,
  variant = "primary", // default to primary
  onClick,
  to,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) => {
  const variantMap: Record<string, string> = {
    light: styles.light,
    danger: styles.danger,
    lightDanger: styles.lightDanger,
  };

  const variantClass = variantMap[variant] || styles.primary;
  const name = `${styles.base} ${variantClass} ${className}`;

  if (to && !disabled) {
    return (
      <Link to={to} className={name} onClick={(e) => onClick?.(e)}>
        {text}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={name}
      onClick={(e) => onClick?.(e)}
    >
      {text}
    </button>
  );
};
