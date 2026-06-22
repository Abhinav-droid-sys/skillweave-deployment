"use client";

import React from "react";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Chip({ children, className = "", ...props }: ChipProps) {
  return (
    <button 
      className={`px-4 py-1.5 rounded-pill border border-border bg-surface text-sm font-medium text-text-muted hover:text-primary hover:border-primary-soft hover:shadow-sm transition-all hover:-translate-y-[1px] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
