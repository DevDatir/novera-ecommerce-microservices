import Button from "../ui/Button";
import { ShieldCheck, Truck, RotateCcw, ArrowRight } from "lucide-react";

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
    <div className="rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm bg-white sticky top-24">
      <h2 className="text-xl font-black text-gray-900 mb-6">
        Order Summary
      </h2>

      {/* Free Shipping Progress */}
      {subtotal < 999 ? (
        <div className="mb-6 p-4 rounded-2xl bg-primary-50 border border-primary-100">
          <p className="text-xs font-semibold text-primary-800">
            Add ₹{amountToFreeShipping.toLocaleString("en-IN")} more to qualify for FREE Shipping!
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-primary-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-2">
          <Truck size={18} className="text-emerald-600 shrink-0" />
          <p className="text-xs font-bold text-emerald-700">
            You unlocked FREE Shipping!
          </p>
        </div>
      )}

      {/* Summary Items */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items ({totalItems})</span>
          <span className="font-semibold text-gray-900">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span className="font-semibold text-gray-900">
            {shippingFee === 0 ? (
              <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
            ) : (
              `₹${shippingFee}`
            )}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 mb-6">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <div className="text-right">
            <span className="text-2xl font-black text-gray-900">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
            <p className="text-[10px] text-gray-400">Inclusive of all taxes</p>
          </div>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onCheckout}
        rightIcon={<ArrowRight size={18} />}
      >
        Proceed to Checkout
      </Button>

      {/* Guarantees */}
      <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-gray-400 shrink-0" />
          <span>Secure 256-bit checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={16} className="text-gray-400 shrink-0" />
          <span>7-day easy returns</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
