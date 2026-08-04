import Button from "../ui/Button";

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

        <div className="rounded-2xl border p-6 h-fit sticky top-24">

            <h2 className="text-2xl font-bold mb-6">
                Order Summary
            </h2>

            <div className="space-y-4">

                <div className="flex justify-between">

                    <span>

                        Items ({totalItems})

                    </span>

                    <span>

                        ₹{subtotal}

                    </span>

                </div>

                <div className="flex justify-between">

                    <span>

                        Shipping

                    </span>

                    <span className="text-green-600">

                        FREE

                    </span>

                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold">

                    <span>

                        Total

                    </span>

                    <span>

                        ₹{subtotal}

                    </span>

                </div>

            </div>

            <Button
                className="w-full mt-8"
                disabled={loading}
                onClick={onCheckout}
            >
                Place Order
            </Button>

        </div>

    );
};

export default CheckoutSummary;