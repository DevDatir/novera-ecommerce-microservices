import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center border rounded-xl overflow-hidden">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
      >
        <Minus size={16} />
      </button>

      <span className="w-12 text-center font-semibold">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        className="px-3 py-2 hover:bg-gray-100"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;