import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
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

  return (
    <Link to={`/products/${product.id}/${slug}`} className="group block">
      <div className="relative overflow-hidden border border-ink-100 bg-white transition-colors duration-200 hover:border-ink-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-sand-100">
          {product.stockQuantity === 0 && (
            <span className="absolute top-3 left-3 z-10 bg-ink-900 text-white text-[11px] font-bold uppercase px-2 py-1">
              Sold out
            </span>
          )}
          {product.unitsSold > 100 && product.stockQuantity > 0 && (
            <span className="absolute top-3 left-3 z-10 bg-pine-500 text-white text-[11px] font-bold uppercase px-2 py-1">
              Bestseller
            </span>
          )}

          <img
            src={product.imageUrls[0] || "/placeholder-shoe.jpg"}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Add to bag reveal */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-ink-900 py-3 text-white text-sm font-semibold translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <ShoppingBag size={14} />
            View product
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-ink-400">{product.category} · {product.gender}</p>
              <h2 className="mt-0.5 font-semibold text-ink-900 leading-snug line-clamp-1">
                {product.name}
              </h2>
            </div>
            <span className="flex items-center gap-1 shrink-0 text-xs font-semibold text-ink-600 mt-0.5">
              <Star size={12} className="text-primary-500 fill-primary-500" />
              {product.rating.toFixed(1)}
            </span>
          </div>

          <p className="mt-2 font-display text-lg text-ink-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
