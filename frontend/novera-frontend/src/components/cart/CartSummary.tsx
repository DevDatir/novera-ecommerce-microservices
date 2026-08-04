import Button from "../ui/Button";

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
  return (
    <div className="rounded-2xl border p-6 shadow-sm bg-white sticky top-24">
      <h2 className="text-xl font-semibold mb-6">
        Order Summary
      </h2>

      <div className="flex justify-between mb-4">
        <span>Items</span>
        <span>{totalItems}</span>
      </div>

      <div className="flex justify-between mb-4">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <Button
        className="w-full mt-6"
        onClick={onCheckout}
    >
        Continue to Checkout
    </Button>
    </div>
  );
};

export default CartSummary;