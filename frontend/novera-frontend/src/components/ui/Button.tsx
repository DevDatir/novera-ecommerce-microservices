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
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md",
  secondary:
    "bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow-md",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100",
  outline:
    "bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-xl",
  xl: "px-8 py-4 text-lg rounded-2xl",
};

const Button = ({
  children,
  loading,
  loadingText = "Please wait...",
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
        font-semibold transition-all duration-200
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