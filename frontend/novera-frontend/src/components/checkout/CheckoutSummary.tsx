import Button from "../ui/Button";
import { formatPrice } from "../../lib/utils";

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  loading: boolean;
  onCheckout: () => void;
}

const CheckoutSummary = ({
  subtotal,
  totalItems,
  loading,
  onCheckout,
}: CartSummaryProps) => {
    return (
        <div className="border border-ink-100 bg-white p-6 h-fit sticky top-24">
            <h2 className="font-display text-xl text-ink-900 mb-6">
                Order summary
            </h2>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between text-ink-500">
                    <span>Items ({totalItems})</span>
                    <span className="font-semibold text-ink-900">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-ink-500">
                    <span>Shipping</span>
                    <span className="text-pine-600 font-bold text-xs">FREE</span>
                </div>

                <div className="flex justify-between text-lg font-display text-ink-900 pt-3 border-t border-ink-100">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
            </div>

            <Button
                className="w-full mt-8"
                disabled={loading}
                loading={loading}
                onClick={onCheckout}
            >
                Place order
            </Button>
        </div>
    );
};

export default CheckoutSummary;
