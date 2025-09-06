// /components/common/Button.tsx
"use client";

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}

export default function Button({ children, variant = 'primary', loading = false, ...props }: ButtonProps) {
  const baseClasses = "btn";
  
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={props.disabled || loading}
    >
      {loading ? <span className="loading loading-spinner"></span> : children}
    </button>
  );
}