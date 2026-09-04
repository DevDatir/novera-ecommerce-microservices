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
    <div className="flex items-center border border-ink-200 rounded-md overflow-hidden">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="px-3 py-2 hover:bg-sand-50 disabled:opacity-40 transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>

      <span className="w-10 text-center font-semibold">{quantity}</span>

      <button
        onClick={onIncrease}
        className="px-3 py-2 hover:bg-sand-50 transition-colors"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;
