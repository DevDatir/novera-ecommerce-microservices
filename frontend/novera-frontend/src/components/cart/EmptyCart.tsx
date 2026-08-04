import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <ShoppingCart
        size={72}
        className="text-gray-300"
      />

      <h2 className="mt-6 text-2xl font-bold">
        Your cart is empty
      </h2>

      <p className="mt-2 text-gray-500">
        Looks like you haven't added any products yet.
      </p>

      <Link
        to="/products"
        className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;