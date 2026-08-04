import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({
  label,
  error,
  className = "",
  ...props
}: Props) => {
  return (
    <div className="mb-5">

      <label className="font-medium">
        {label}
      </label>

      <input
        {...props}
        className={`
          mt-2
          w-full
          rounded-xl
          border
          border-gray-300
          p-4
          focus:outline-none
          focus:ring-2
          focus:ring-blue-600
          ${className}
        `}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}

    </div>
  );
};

export default Input;