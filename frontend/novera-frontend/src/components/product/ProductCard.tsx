import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "../../types/product";
import { formatPrice } from "../../lib/utils";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const slug = product.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <Link
      to={`/products/${product.id}/${slug}`}
      className="group block"
    >
      <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-2xl hover:border-gray-200 transition-all duration-300 ease-out">
        {/* Badge */}
        {product.stockQuantity === 0 && (
          <span className="absolute top-3 left-3 z-20 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            Sold Out
          </span>
        )}
        {product.unitsSold > 100 && product.stockQuantity > 0 && (
          <span className="absolute top-3 left-3 z-20 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            Bestseller
          </span>
        )}

        {/* Favorite button */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
          onClick={(e) => e.preventDefault()}
        >
          <Heart
            size={16}
            className="text-gray-600 hover:text-red-500 transition-colors"
          />
        </button>

        {/* Image */}
        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <img
            src={product.imageUrls[0] || "/placeholder-shoe.jpg"}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={`
              w-full h-full object-contain
              transition-transform duration-500 ease-out
              group-hover:scale-110
            `}
          />
          {/* Quick add to bag overlay */}
          <div
            className="
              absolute inset-x-0 bottom-0
              flex justify-center pb-4
              opacity-0 translate-y-2
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300
            "
          >
            <span
              className="
                inline-flex items-center gap-2
                bg-gray-900 text-white text-sm font-semibold
                px-4 py-2 rounded-full shadow-lg
              "
            >
              <ShoppingBag size={14} />
              Quick View
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
              {product.category}
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {product.gender}
            </span>
          </div>

          <h2 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
            {product.name}
          </h2>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Star
                size={14}
                className="text-amber-400 fill-amber-400"
              />
              <span className="text-sm font-semibold text-gray-700">
                {formatRating(product.rating)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;