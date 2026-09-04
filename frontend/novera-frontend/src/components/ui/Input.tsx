import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({
  label,
  error,
  className = "",
  id,
  ...props
}: Props) => {
  const inputId = id ?? props.name;

  return (
    <div className="mb-5">
      <label htmlFor={inputId} className="text-sm font-semibold text-ink-800">
        {label}
      </label>

      <input
        id={inputId}
        {...props}
        className={`
          mt-2
          w-full
          rounded-md
          border
          border-ink-200
          bg-white
          px-4 py-3
          text-ink-900
          placeholder:text-ink-300
          focus:outline-none
          focus:ring-2
          focus:ring-primary-400
          focus:border-primary-400
          ${error ? "border-red-400" : ""}
          ${className}
        `}
      />

      {error && (
        <p className="text-red-600 text-sm mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
