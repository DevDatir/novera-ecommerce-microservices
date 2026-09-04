import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useCart } from "../../hooks/useCart";
import ProductImageCarousel from "../../components/product/ProductImageCarousal";
import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { ArrowLeft, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContexts";
import { ProductDetailsSkeleton } from "../../components/ui/Skeletons";
import { formatPrice } from "../../lib/utils";

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
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-red-600">
        Product not found.
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate("/products")}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900 transition mb-6"
      >
        <ArrowLeft size={18} /> Back to shop
      </button>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductImageCarousel images={product.imageUrls} />

        {/* Details */}
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-primary-500">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl leading-tight text-ink-900">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} className="fill-primary-500 text-primary-500" aria-hidden="true" />
              ))}
            </div>
            <span className="text-sm text-ink-400">{product.rating.toFixed(1)}</span>
          </div>

          <p className="font-display text-3xl mt-6 text-ink-900">
            {formatPrice(product.price)}
          </p>

          <p className="mt-4">
            <span className={product.stockQuantity > 0 ? "text-pine-600 font-semibold text-sm" : "text-red-600 font-semibold text-sm"}>
              {product.stockQuantity > 0 ? "In stock" : "Out of stock"}
            </span>
          </p>

          <p className="mt-6 text-ink-500 leading-7">
            {product.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm border-t border-ink-100 pt-6">
            <div>
              <p className="text-ink-400">Category</p>
              <p className="font-semibold text-ink-800">{product.category}</p>
            </div>
            <div>
              <p className="text-ink-400">Gender</p>
              <p className="font-semibold text-ink-800">{product.gender}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-5">
            <div className="flex items-center border border-ink-200 rounded-md">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center hover:bg-sand-50 transition-colors"
              >
                <Minus size={16} />
              </button>

              <span className="w-10 text-center font-semibold">{quantity}</span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center hover:bg-sand-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            loading={addItemMutation.isPending}
            disabled={isAdded || product.stockQuantity === 0}
            onClick={handleAddToCart}
          >
            {isAdded ? "Added to cart" : product.stockQuantity === 0 ? "Out of stock" : "Add to cart"}
          </Button>

          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-ink-100 pt-6 text-sm text-ink-500">
            <span className="flex items-center gap-2"><Truck size={18} className="text-primary-500" /> Free delivery above ₹999</span>
            <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-primary-500" /> Secure checkout</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
