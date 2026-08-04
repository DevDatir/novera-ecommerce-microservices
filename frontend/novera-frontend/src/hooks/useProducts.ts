import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../service/productService";

export const useProducts = (
    page: number,
    size: number,
    sortBy: string,
    direction: string
) => {

    return useQuery({

        queryKey: [
            "products",
            page,
            size,
            sortBy,
            direction
        ],

        queryFn: () =>
            getProducts(
                page,
                size,
                sortBy,
                direction
            )

    });

};