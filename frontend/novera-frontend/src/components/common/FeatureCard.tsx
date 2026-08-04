import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

const FeatureCard = ({ icon, title, subtitle }: Props) => {
  return (
    <div
      className="
      flex
      items-center
      gap-4
      bg-white
      rounded-2xl
      border
      border-gray-200
      p-5
      shadow-sm
      hover:shadow-md
      transition
      "
    >
      <div className="text-blue-600">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;