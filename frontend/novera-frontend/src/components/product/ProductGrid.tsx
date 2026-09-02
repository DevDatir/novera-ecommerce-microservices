import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
import { PackageX, Search } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  hasError?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

const ProductGrid = ({
  products,
  loading,
  hasError,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your filters or come back later for fresh drops.",
}: ProductGridProps) => {
  if (hasError) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-4">
          <PackageX className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Couldn't load products
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          We hit a snag fetching the catalog. Please refresh or try again in a moment.
        </p>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {emptyTitle}
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={idx < 4}
        />
      ))}
    </div>
  );
};

export default ProductGrid;