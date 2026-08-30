import type { CartItemResponse } from "../../types/cart";
import QuantitySelector from "./QuantitySelector";
import { X } from "lucide-react";

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
    <div className="group flex gap-4 sm:gap-6 rounded-2xl border border-gray-100 p-4 sm:p-5 bg-white shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300">
      {/* Image */}
      <div className="relative shrink-0">
        <img
          src={image}
          alt={item.product.name}
          className="h-28 w-28 sm:h-32 sm:w-32 rounded-xl object-cover bg-gray-50"
        />
        {/* Quick actions overlay */}
        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-700 transition-colors">
                {item.product.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                {item.product.category} • {item.product.gender}
              </p>
            </div>
            <button
              onClick={onRemove}
              className="shrink-0 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              aria-label="Remove item"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            ₹{item.product.price.toLocaleString("en-IN")} each
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 sm:mt-5">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />

          <div className="text-right">
            <p className="text-xs text-gray-400">Item total</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              ₹{itemTotal.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;