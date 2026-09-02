import { useProducts } from "../../hooks/useProducts";
import { ProductGridSkeleton } from "../ui/Skeletons";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const { data, isLoading, isError } = useProducts(0, 8, "unitsSold", "desc");

  if (isError) {
    return (
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Failed to load featured products
          </h2>
          <p className="text-gray-500">Please refresh to try again.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">
              Best Sellers
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Customer Favorites
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Loved by thousands of customers worldwide
            </p>
          </div>
          <Link
            to="/products?sort=unitsSold,desc"
            className="
              hidden sm:inline-flex items-center gap-1.5
              text-sm font-bold text-primary-600
              hover:text-primary-700 transition-colors
            "
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.content.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={idx < 4}
              />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products"
            className="
              inline-flex items-center gap-2
              bg-primary-600 text-white px-6 py-3 rounded-2xl
              font-bold text-sm
              hover:bg-primary-700 transition-colors
            "
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
