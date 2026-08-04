import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";

interface Props {
    products: Product[];
}

const ProductGrid = ({ products }: Props) => {

    return (

        <div
            className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-8
            "
        >

            {

                products.map(product => (

                    <ProductCard

                        key={product.id}

                        {...product}

                    />

                ))

            }

        </div>

    );

};

export default ProductGrid;