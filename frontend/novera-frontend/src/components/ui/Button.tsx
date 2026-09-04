import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-700",
  danger:
    "bg-red-600 text-white hover:bg-red-700",
  ghost:
    "bg-transparent text-ink-700 hover:bg-ink-50",
  outline:
    "bg-transparent border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-sm",
  md: "px-4 py-2.5 text-sm rounded-md",
  lg: "px-6 py-3.5 text-base rounded-md",
  xl: "px-8 py-4 text-lg rounded-md",
};

const Button = ({
  children,
  loading,
  loadingText = "Please wait…",
  className = "",
  variant = "primary",
  size = "lg",
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold tracking-tight transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {loading ? loadingText : children}
      {!loading && rightIcon && rightIcon}
    </button>
  );
};

export default Button;
