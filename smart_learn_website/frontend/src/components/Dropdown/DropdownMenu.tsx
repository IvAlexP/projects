import { useState, useRef, type ReactNode, useEffect, type RefObject } from "react";
import styles from "./Dropdown.module.css";

interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
}

const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
};

export const DropdownMenu = ({ trigger, children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={styles.dropdown}>
        {trigger}
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu} onClick={() => setIsOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
};
