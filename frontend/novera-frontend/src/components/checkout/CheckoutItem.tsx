import type { CartItemResponse } from "../../types/cart";
import { formatPrice } from "../../lib/utils";

interface Props {
    item: CartItemResponse;
}

const CheckoutItem = ({ item }: Props) => {
    return (
        <div className="flex gap-4 border border-ink-100 p-4 bg-white">
            <img
                src={item.product.imageUrls[0]}
                alt={item.product.name}
                className="h-24 w-24 object-contain bg-sand-100 p-2 shrink-0"
            />

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink-900 line-clamp-1">
                    {item.product.name}
                </h3>
                <p className="text-sm text-ink-400 mt-1">Qty: {item.quantity}</p>
                <p className="text-sm text-ink-400">{formatPrice(item.product.price)} each</p>
            </div>

            <div className="font-display text-lg text-ink-900 shrink-0">
                {formatPrice(item.subtotal)}
            </div>
        </div>
    );
};

export default CheckoutItem;
