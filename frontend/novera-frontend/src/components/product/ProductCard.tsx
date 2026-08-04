import { Link } from "react-router-dom";
import type { Product } from "../../types/product";

const ProductCard = ({
    id,
    name,
    price,
    rating,
    imageUrls
}: Product) => {

    const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-");

    return (

        <Link

            to={`/products/${id}/${slug}`}

            className="
                bg-white
                rounded-2xl
                shadow-sm
                hover:shadow-xl
                transition
                overflow-hidden
                group
                block
            "

        >

            <div
                className="
                    h-72
                    bg-slate-100
                    overflow-hidden
                "
            >

                <img

                    src={imageUrls[0]}

                    alt={name}

                    className="
                        w-full
                        h-full
                        object-contain
                        group-hover:scale-105
                        transition
                        duration-300
                    "

                />

            </div>

            <div className="p-5">

                <h2
                    className="
                        font-semibold
                        text-lg
                        line-clamp-1
                    "
                >
                    {name}
                </h2>

                <div
                    className="
                        mt-4
                        flex
                        justify-between
                        items-center
                    "
                >

                    <span
                        className="
                            text-blue-600
                            text-xl
                            font-bold
                        "
                    >
                        ₹{price}
                    </span>

                    <span
                        className="
                            text-yellow-500
                            font-semibold
                        "
                    >
                        ★ {rating}
                    </span>

                </div>

            </div>

        </Link>

    );

};

export default ProductCard;