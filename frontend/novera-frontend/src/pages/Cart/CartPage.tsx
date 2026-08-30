import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import EmptyCart from "../../components/cart/EmptyCart";
import CartSummary from "../../components/cart/CartSummary";
import CartItem from "../../components/cart/CartItem";
import { Search } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    isLoading,
    isError,
    removeItemMutation,
    updateItemMutation
  } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-4">
          <Search className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Failed to load cart
        </h1>
        <p className="text-sm text-gray-500 mt-4">
          We encountered an error loading your cart. Please refresh or try again.
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <button
        type="button"
        onClick={() => navigate("/products")}
        className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition mb-2"
      >
        &larr; Continue Shopping
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          Your Cart
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onIncrease={() => {
                  updateItemMutation.mutate({
                    productId: item.productId,
                    quantity: item.quantity + 1,
                  });
                }}
                onDecrease={() => {
                  if (item.quantity > 1) {
                    updateItemMutation.mutate({
                      productId: item.productId,
                      quantity: item.quantity - 1,
                    });
                  }
                }}
                onRemove={() => {
                  removeItemMutation.mutate(item.productId);
                }}
              />
            ))}
          </div>

          {/* Mobile Summary */}
          <div className="mt-8 lg:hidden">
            <CartSummary
              subtotal={subtotal}
              totalItems={totalItems}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>

        {/* Order Summary - Desktop */}
        <div className="hidden lg:block">
          <CartSummary
            subtotal={subtotal}
            totalItems={totalItems}
            onCheckout={() => navigate("/checkout")}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;