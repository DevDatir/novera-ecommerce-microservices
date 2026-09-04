import Button from "../ui/Button";
import { ShieldCheck, Truck, RotateCcw, ArrowRight } from "lucide-react";
import { formatPrice } from "../../lib/utils";

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  onCheckout: () => void;
}

const CartSummary = ({
  subtotal,
  totalItems,
  onCheckout,
}: CartSummaryProps) => {
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;
  const amountToFreeShipping = 999 - subtotal;

  return (
    <div className="border border-ink-100 p-6 sm:p-8 bg-white sticky top-24">
      <h2 className="font-display text-xl text-ink-900 mb-6">
        Order summary
      </h2>

      {/* Free Shipping Progress */}
      {subtotal < 999 ? (
        <div className="mb-6 p-4 bg-sand-50 border border-sand-200">
          <p className="text-xs font-semibold text-ink-700">
            Add {formatPrice(amountToFreeShipping)} more for free shipping
          </p>
          <div className="mt-2 h-1.5 w-full bg-sand-200 overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 bg-pine-500/10 border border-pine-500/20 flex items-center gap-2">
          <Truck size={18} className="text-pine-600 shrink-0" />
          <p className="text-xs font-bold text-pine-600">
            You unlocked free shipping
          </p>
        </div>
      )}

      {/* Summary Items */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm text-ink-500">
          <span>Items ({totalItems})</span>
          <span className="font-semibold text-ink-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm text-ink-500">
          <span>Shipping</span>
          <span className="font-semibold text-ink-900">
            {shippingFee === 0 ? (
              <span className="text-pine-600 font-bold text-xs">FREE</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-ink-100 mb-6">
        <div className="flex justify-between items-baseline">
          <span className="text-base font-semibold text-ink-900">Total</span>
          <div className="text-right">
            <span className="font-display text-2xl text-ink-900">{formatPrice(grandTotal)}</span>
            <p className="text-[10px] text-ink-400">Inclusive of all taxes</p>
          </div>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onCheckout}
        rightIcon={<ArrowRight size={18} />}
      >
        Proceed to checkout
      </Button>

      <div className="mt-6 pt-6 border-t border-ink-100 grid grid-cols-2 gap-4 text-xs text-ink-500">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-ink-300 shrink-0" />
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={16} className="text-ink-300 shrink-0" />
          <span>7-day easy returns</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
