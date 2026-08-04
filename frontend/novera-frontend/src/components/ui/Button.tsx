import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({
  children,
  loading,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        w-full
        py-4
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        disabled:bg-blue-400
        disabled:cursor-not-allowed
        text-white
        font-semibold
        transition
        ${className}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;