import { useEffect, useState } from "react";

import ProductGrid from "../../components/product/ProductGrid";
import Pagination from "../../components/product/Pagination";
import ProductToolbar from "../../components/product/ProductToolbar";
import SearchBar from "../../components/product/SearchBar";
import Spinner from "../../components/ui/Spinner";

import {
    getProducts,
    searchProducts,
    getProductsByCategory
} from "../../service/productService";

import type { PageResponse } from "../../types/page";
import type { Product } from "../../types/product";
import { useDebounce } from "../../hooks/useDebounce";

const ProductsPage = () => {

    const [products, setProducts] =
        useState<PageResponse<Product>>();

    const [loading, setLoading] =
        useState(true);

    const [page, setPage] =
        useState(0);

    const [searchInput, setSearchInput] = useState("");

    const debouncedSearch = useDebounce(searchInput, 500);

    const [category, setCategory] =
        useState<number | null>(null);

    const [sort, setSort] =
        useState("id,asc");

    useEffect(() => {

        const loadProducts = async () => {

            setLoading(true);

            try {

                let response;

                if (debouncedSearch.trim() !== "") {

                    response =
                        await searchProducts(
                            debouncedSearch,
                            page,
                            8
                        );

                }

                else if (category !== null) {

                    response =
                        await getProductsByCategory(
                            category,
                            page,
                            8
                        );

                }

                else {

                    const [sortBy, direction] =
                        sort.split(",");

                    response =
                        await getProducts(
                            page,
                            8,
                            sortBy,
                            direction
                        );

                }

                setProducts(response);

            }

            finally {

                setLoading(false);

            }

        };

        loadProducts();

    }, [page, debouncedSearch, category, sort]);

    if (loading)
        return <Spinner />;

    return (

        <div className="max-w-7xl mx-auto px-6 py-12">

            <h1 className="text-4xl font-bold mb-8">

                All Products

            </h1>

           <SearchBar
                value={searchInput}
                onChange={(value) => {
                    setSearchInput(value);
                    setCategory(null);
                    setPage(0);
                }}
            />

            <ProductToolbar

                selectedCategory={category}

                selectedSort={sort}

                onCategoryChange={(id) => {

                    setCategory(id);

                    setSearchInput("");

                    setPage(0);

                }}

                onSortChange={(value) => {

                    setSort(value);

                    setPage(0);

                }}

            />

            <ProductGrid

                products={products?.content ?? []}

            />

            <Pagination

                currentPage={page}

                totalPages={products?.totalPages ?? 0}

                onPageChange={setPage}

            />

        </div>

    );

};

export default ProductsPage;