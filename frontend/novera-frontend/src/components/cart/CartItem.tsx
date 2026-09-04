import type { CartItemResponse } from "../../types/cart";
import QuantitySelector from "./QuantitySelector";
import { X } from "lucide-react";
import { formatPrice } from "../../lib/utils";

interface CartItemProps {
  item: CartItemResponse;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItem = ({ item, onIncrease, onDecrease, onRemove }: CartItemProps) => {
  const image =
    item.product.imageUrls.length > 0
      ? item.product.imageUrls[0]
      : "/placeholder.png";

  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-4 sm:gap-6 border border-ink-100 p-4 sm:p-5 bg-white">
      <img
        src={image}
        alt={item.product.name}
        className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 object-contain bg-sand-100 p-2"
      />

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-ink-900 line-clamp-2">
                {item.product.name}
              </h3>
              <p className="text-xs text-ink-400 mt-1">
                {item.product.category} · {item.product.gender}
              </p>
            </div>
            <button
              onClick={onRemove}
              className="shrink-0 p-2 text-ink-300 hover:text-red-600 transition-colors"
              aria-label="Remove item"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-ink-400 mt-2">
            {formatPrice(item.product.price)} each
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-5">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />

          <div className="text-right">
            <p className="text-xs text-ink-400">Item total</p>
            <p className="text-lg sm:text-xl font-display text-ink-900">
              {formatPrice(itemTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
