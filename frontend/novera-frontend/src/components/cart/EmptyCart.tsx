import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 animate-fade-in">
      <div className="h-28 w-28 bg-sand-100 flex items-center justify-center">
        <ShoppingCart size={44} className="text-ink-300" />
      </div>

      <h2 className="mt-8 font-display text-2xl sm:text-3xl text-ink-900">
        Your cart is empty
      </h2>

      <p className="mt-3 text-ink-500 text-center max-w-sm">
        Looks like you haven't added any shoes yet. Start exploring our collection to find your perfect pair.
      </p>

      <Link
        to="/products"
        className="mt-8 inline-flex items-center gap-2 bg-ink-900 text-white px-8 py-4 rounded-md font-semibold hover:bg-primary-500 transition-colors"
      >
        Start shopping
        <ArrowRight size={18} />
      </Link>

      <p className="mt-6 text-sm text-ink-400">
        Free shipping on orders above ₹999
      </p>
    </div>
  );
};

export default EmptyCart;
