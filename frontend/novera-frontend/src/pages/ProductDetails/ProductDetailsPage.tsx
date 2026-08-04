import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import ProductImageCarousel from "../../components/product/ProductImageCarousal";
import { useEffect, useState } from "react";
import FeaturedProducts from "../../components/product/FeaturedProducts";
import Button from "../../components/ui/Button";
import { useCart } from "../../hooks/useCart";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const [quantity,setQuantity]=useState(1);
  // const [searchInput, setSearchInput] = useState("");
  // const [search, setSearch] = useState("");
  const { id } = useParams();
  const { addItemMutation } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const {
    data: product,
    isLoading,
    error,
  } = useProduct(Number(id));

  useEffect(() => {
    if (!isAdded) {
        return;
    }

    const timer = setTimeout(() => {
        setIsAdded(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAdded]);
    
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        Loading...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-red-500">
        Product not found.
      </div>
    );
  }

  const handleAddToCart = () => {
    addItemMutation.mutate(
        {
            productId: product.id,
            quantity,
        },
        {
            onSuccess: () => {
                setIsAdded(true);
            },
        }
    );
  };

  return (
    <>
    <section className="max-w-7xl mx-auto py-10 px-6">
      <button
        type="button"
        onClick={() => navigate("/products")}
        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition mb-6"
      >
        &larr; Back to Products
      </button>

      <div className="grid lg:grid-cols-2 gap-16">

        {/* Image */}

        <ProductImageCarousel
            images={product.imageUrls}
        />
        {/* Details */}

        <div>

          <h1 className="text-5xl font-bold">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-4">

            <div className="flex items-center gap-2">

                {[1,2,3,4,5].map((star)=>(
                    <span
                        key={star}
                        className="text-yellow-400 text-xl"
                    >
                        ★
                    </span>
                ))}

                <span className="text-gray-500">
                    ({product.rating})
                </span>

            </div>

            <span>{product.rating}</span>

          </div>

          <p className="text-4xl font-bold mt-6">

            ₹{product.price.toLocaleString("en-IN")}

          </p>

          <p className="text-green-600 font-semibold mt-6">

            In Stock

          </p>

          <p className="text-gray-600 leading-8 mt-8">

            {product.description}

          </p>

          <div className="mt-8">

            <p>

              <strong>Category:</strong>

              {" "}

              {product.category}

            </p>

            <p className="mt-3">

              <strong>Gender:</strong>

              {" "}

              {product.gender}

            </p>

          </div>

          <div className="flex items-center gap-5 mt-10">

                <button
                    onClick={()=>setQuantity(Math.max(1,quantity-1))}
                    className="w-10 h-10 rounded-lg bg-gray-200"
                >
                    -
                </button>

                <span className="text-xl">

                    {quantity}

                </span>

                <button
                    onClick={()=>setQuantity(quantity+1)}
                    className="w-10 h-10 rounded-lg bg-gray-200"
                >
                    +
                </button>

            </div>

        <Button
            loading={addItemMutation.isPending}
            disabled={isAdded}
            onClick={handleAddToCart}
        >
            {isAdded ? "✓ Added to Cart" : "Add to Cart"}
        </Button>

        </div>

      </div>

    </section>

    <FeaturedProducts />

    </>
    
  );
};

export default ProductDetailsPage;