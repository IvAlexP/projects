import { Link } from "react-router-dom";
import styles from "./Dropdown.module.css";
import type { ReactNode } from "react";

interface ItemProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
}

export const DropdownItem = ({ children, to, onClick }: ItemProps) => {
  if (to) {
    return (
      <Link to={to} className={styles.dropdownItem}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={styles.dropdownItem}>
      {children}
    </button>
  );
};
