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
          <h2 className="text-2xl font-bold text-ink-900 mb-4">
            Failed to load featured products
          </h2>
          <p className="text-ink-400">Please refresh to try again.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl sm:text-4xl text-ink-900">
            Customer favorites
          </h2>
          <Link
            to="/products?sort=unitsSold,desc"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 hover:text-primary-500 transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {data?.content.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 4} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-ink-900 text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-500 transition-colors"
          >
            View all products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
