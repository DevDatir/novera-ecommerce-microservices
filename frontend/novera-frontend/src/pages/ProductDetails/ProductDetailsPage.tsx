import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useCart } from "../../hooks/useCart";
import ProductImageCarousel from "../../components/product/ProductImageCarousal";
import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { ArrowLeft, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContexts";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addItemMutation } = useCart(isAuthenticated);
  const { data: product, isLoading, error } = useProduct(Number(id));

  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => {
        setIsAdded(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAdded]);

  const handleAddToCart = () => {
    if (quantity < 1) return;
    if (!isAuthenticated) {
      toast("Sign in to add items to your cart.");
      navigate("/login");
      return;
    }

    addItemMutation.mutate(
      {
        productId: product?.id || 0,
        quantity,
      },
      {
        onSuccess: () => {
          setIsAdded(true);
        },
        onError: () => {
          toast.error("Sign in to add items to your cart.");
          navigate("/login");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <div className="text-3xl font-bold">Loading...</div>
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

  return (
    <section className="max-w-7xl mx-auto py-10 px-6">
      <button
        type="button"
        onClick={() => navigate("/products")}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition mb-6"
      >
        <ArrowLeft size={18} /> Back to shop
      </button>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Image */}
        <ProductImageCarousel images={product.imageUrls} />

        {/* Details */}
        <div className="max-w-xl">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-600">{product.category}</p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold leading-none">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
                <span className="text-gray-500">
                  {product.rating}
                </span>
              </div>
            </div>

            <p className="text-3xl font-bold mt-6 text-gray-900">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="mt-6 text-gray-600">
              <span className={product.stockQuantity > 0 ? "text-emerald-700 font-semibold" : "text-red-600 font-semibold"}>{product.stockQuantity > 0 ? "In stock" : "Out of stock"}</span>
            </p>

            <p className="mt-6 text-gray-600 leading-8">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="text-gray-700">
                <strong>Category:</strong> {product.category}
              </p>
              <p className="mt-2 text-gray-700">
                <strong>Gender:</strong> {product.gender}
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-5">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="
                w-11 h-11 rounded-full bg-primary-100 hover:bg-primary-200
                transition-all duration-200
              "
            >
              <Minus size={18} className="mx-auto" />
            </button>

            <span className="text-xl font-semibold text-center">
              {quantity}
            </span>

            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity(quantity + 1)}
              className="
                w-11 h-11 rounded-full bg-primary-100 hover:bg-primary-200
                transition-all duration-200
              "
            >
              <Plus size={18} className="mx-auto" />
            </button>
          </div>

          <Button
            className="mt-6 w-full"
            loading={addItemMutation.isPending}
            disabled={isAdded || product.stockQuantity === 0}
            onClick={handleAddToCart}
          >
            {isAdded ? "Added to cart" : product.stockQuantity === 0 ? "Out of stock" : "Add to cart"}
          </Button>
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-gray-200 pt-6 text-sm text-gray-600">
            <span className="flex items-center gap-2"><Truck size={18} className="text-primary-600" /> Free delivery above ₹999</span>
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-primary-600" /> Secure checkout</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
