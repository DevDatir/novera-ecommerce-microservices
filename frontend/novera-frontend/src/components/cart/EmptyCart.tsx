import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 animate-fade-in">
      <div className="relative">
        <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
          <ShoppingCart size={48} className="text-gray-300" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-xs font-bold text-primary-600">0</span>
        </div>
      </div>

      <h2 className="mt-8 text-2xl sm:text-3xl font-bold text-gray-900">
        Your cart is empty
      </h2>

      <p className="mt-3 text-gray-500 text-center max-w-sm">
        Looks like you haven't added any shoes yet. Start exploring our collection to find your perfect pair!
      </p>

      <Link
        to="/products"
        className="
          mt-8 inline-flex items-center gap-2
          bg-gray-900 text-white
          px-8 py-4 rounded-2xl font-bold
          hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/20
          transition-all duration-300 hover:-translate-y-0.5
        "
      >
        Start Shopping
        <ArrowRight size={18} />
      </Link>

      <p className="mt-6 text-sm text-gray-400">
        Free shipping on orders above ₹999
      </p>
    </div>
  );
};

export default EmptyCart;