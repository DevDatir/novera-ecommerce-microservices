import { useProducts } from "../../hooks/useProducts";
import Spinner from "../ui/Spinner";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";

const FeaturedProducts = () => {

    const {
        data,
        isLoading,
        isError
    } = useProducts(
        0,
        4,
        "unitsSold",
        "desc"
    );

    if (isLoading)
        return <Spinner />;

    if (isError)
        return (
            <h2 className="text-center py-20">
                Failed to load products.
            </h2>
        );

    return (

        <section className="max-w-7xl mx-auto px-6 py-20">

            <SectionTitle
                title="Featured Products"
                subtitle="Our best selling shoes."
            />

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-8
                "
            >

                {data?.content.map(product => (

                    <ProductCard
                        key={product.id}
                        {...product}
                    />

                ))}

            </div>

        </section>

    );

};

export default FeaturedProducts;