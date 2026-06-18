"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import "./menu.css";

interface DropdownProps {
  children: ReactNode;
  triggerClassName?: string;
  triggerActiveClassName?: string;
  Icon: ReactNode;
  headerTitle?: string;
  align?: "left" | "right";
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  children,
  triggerClassName = "",
  triggerActiveClassName = "",
  Icon,
  headerTitle,
  align = "left",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${triggerClassName} ${isOpen ? triggerActiveClassName : ""}`}
      >
        {Icon}
      </button>

      {isOpen && (
        <div
          className={`dropdown-menu absolute z-50 mt-2 rounded-md bg-[var(--app-overlay-secondary)] shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {headerTitle && (
            <div className="dropdown-header border-b border-[var(--app-border-primary)] px-4 py-2 text-sm font-bold">
              {headerTitle}
            </div>
          )}
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
