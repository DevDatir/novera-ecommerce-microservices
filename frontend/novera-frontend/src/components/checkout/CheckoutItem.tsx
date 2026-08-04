import type { CartItemResponse } from "../../types/cart";

interface Props {
    item: CartItemResponse;
}

const CheckoutItem = ({ item }: Props) => {

    return (

        <div className="flex gap-4 rounded-xl border p-4">

            <img
                src={item.product.imageUrls[0]}
                className="h-28 w-28 rounded-lg object-cover"
            />

            <div className="flex-1">

                <h3 className="font-semibold text-lg">
                    {item.product.name}
                </h3>

                <p>
                    Qty : {item.quantity}
                </p>

                <p>
                    ₹{item.product.price}
                </p>

            </div>

            <div className="font-bold text-lg">

                ₹{item.subtotal}

            </div>

        </div>

    );
};

export default CheckoutItem;