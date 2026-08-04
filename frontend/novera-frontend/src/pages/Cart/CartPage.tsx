import { useNavigate } from "react-router-dom";

import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";
import Spinner from "../../components/ui/Spinner";
import { useCart } from "../../hooks/useCart";

const CartPage = () => {
  const navigate = useNavigate();

  const {
    cart,
    isLoading,
    isError,
    updateItemMutation,
    removeItemMutation,
  } = useCart();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !cart) {
    return (
      <div className="py-20 text-center">
        Failed to load cart.
      </div>
    );
  }

  if (cart.items.length === 0) {
    return <EmptyCart />;
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition mb-2"
        >
          &larr; Continue Shopping
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2 space-y-6">

          {cart.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onIncrease={() =>
                updateItemMutation.mutate({
                  productId: item.productId,
                  quantity: item.quantity + 1,
                })
              }
              onDecrease={() =>
                updateItemMutation.mutate({
                  productId: item.productId,
                  quantity: item.quantity - 1,
                })
              }
              onRemove={() =>
                removeItemMutation.mutate(item.productId)
              }
            />
          ))}

        </div>

        <CartSummary
          subtotal={subtotal}
          totalItems={totalItems}
          onCheckout={() => navigate("/checkout")}
        />

      </div>

    </div>
  );
};

export default CartPage;