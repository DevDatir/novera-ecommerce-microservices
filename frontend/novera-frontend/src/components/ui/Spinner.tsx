import { clsx } from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div
        className={clsx(
          "animate-spin rounded-full border-4 border-gray-200 border-t-primary-600",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export default Spinner;