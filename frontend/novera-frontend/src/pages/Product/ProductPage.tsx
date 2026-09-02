import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/product/ProductGrid";
import Pagination from "../../components/product/Pagination";
import ProductToolbar from "../../components/product/ProductToolbar";
import { ProductGridSkeleton } from "../../components/ui/Skeletons";
import { Search, X } from "lucide-react";
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getProductsByGender,
} from "../../service/productService";
import type { PageResponse } from "../../types/page";
import type { Product } from "../../types/product";
import { useDebounce } from "../../hooks/useDebounce";

const ProductsPage = () => {
  const [products, setProducts] = useState<PageResponse<Product>>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const [category, setCategory] = useState<number | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [sort, setSort] = useState("id,desc");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const requestedGender = searchParams.get("gender");
    const requestedCategory = Number(searchParams.get("category"));
    setSearchInput(searchParams.get("search") || "");
    setGender(["MALE", "FEMALE", "UNISEX"].includes(requestedGender || "") ? requestedGender : null);
    setCategory(Number.isInteger(requestedCategory) && requestedCategory > 0 ? requestedCategory : null);
    setSort(searchParams.get("sort") || "id,desc");
    setPage(0);
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      try {
        let response;

        if (debouncedSearch.trim() !== "") {
          response = await searchProducts(debouncedSearch, page, 12);
        } else if (category !== null) {
          response = await getProductsByCategory(category, page, 12);
        } else if (gender !== null) {
          response = await getProductsByGender(
            gender as "MALE" | "FEMALE" | "UNISEX",
            page,
            12
          );
        } else {
          const [sortBy, direction] = sort.split(",");
          response = await getProducts(page, 12, sortBy, direction);
        }

        setProducts(response);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, debouncedSearch, category, gender, sort]);

  const handleClearFilters = () => {
    setSearchInput("");
    setCategory(null);
    setGender(null);
    setPage(0);
  };

  const hasActiveFilters =
    searchInput !== "" || category !== null || gender !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-500">
            {products?.totalElements || 0} shoes available
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCategory(null);
                setGender(null);
                setPage(0);
              }}
              placeholder="Search for shoes..."
              className="
                w-full pl-12 pr-12 py-3.5
                bg-white border-2 border-gray-200
                rounded-2xl text-sm
                focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100
                transition-all duration-200
              "
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setPage(0);
                }}
                className="
                  absolute right-4 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-gray-600
                "
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filters & Sort */}
        <ProductToolbar
          selectedCategory={category}
          selectedSort={sort}
          selectedGender={gender}
          onCategoryChange={(id) => {
            setCategory(id);
            setGender(null);
            setSearchInput("");
            setPage(0);
          }}
          onSortChange={(value) => {
            setSort(value);
            setPage(0);
          }}
          onGenderChange={(value) => {
            setGender(value);
            setCategory(null);
            setSearchInput("");
            setPage(0);
          }}
        />

        {/* Active Filters Badge */}
        {hasActiveFilters && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchInput && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg">
                Search: "{searchInput}"
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg">
                Category filter
              </span>
            )}
            {gender && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg">
                Gender: {gender}
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : (
          <ProductGrid
            products={products?.content ?? []}
            hasError={false}
            emptyTitle={
              searchInput
                ? `No results for "${searchInput}"`
                : "No products found"
            }
            emptyDescription={
              searchInput
                ? "Try adjusting your search or browse all products."
                : "Check back soon for new arrivals."
            }
          />
        )}

        {/* Pagination */}
        {products && products.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={products.totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
