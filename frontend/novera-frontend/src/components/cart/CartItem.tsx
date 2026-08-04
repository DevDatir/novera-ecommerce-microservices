import type { CartItemResponse } from "../../types/cart";
import QuantitySelector from "./QuantitySelector";

interface CartItemProps {
  item: CartItemResponse;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) => {
  const image =
    item.product.imageUrls.length > 0
      ? item.product.imageUrls[0]
      : "/placeholder.png";

  return (
    <div className="flex gap-6 rounded-2xl border p-5 bg-white shadow-sm">
      <img
        src={image}
        alt={item.product.name}
        className="h-32 w-32 rounded-xl object-cover"
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {item.product.name}
          </h3>

          <p className="text-gray-500 mt-1">
            ₹{item.product.price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-5">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />

          <button
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;