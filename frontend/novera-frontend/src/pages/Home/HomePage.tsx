import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  ArrowRight,
  Star,
} from "lucide-react";
import FeaturedProducts from "../../components/product/FeaturedProducts";
import type { Product } from "../../types/product";
import { getProducts } from "../../service/productService";
import ProductCard from "../../components/product/ProductCard";

const FEATURE_CARDS = [
  { icon: Truck, title: "Free shipping", subtitle: "On orders above ₹999" },
  { icon: RotateCcw, title: "7-day returns", subtitle: "No questions asked" },
  { icon: ShieldCheck, title: "Secure payment", subtitle: "100% protected checkout" },
  { icon: BadgeCheck, title: "Premium quality", subtitle: "Curated footwear" },
];

const CATEGORIES = [
  {
    name: "Running",
    categoryId: 1,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    description: "Engineered for speed",
  },
  {
    name: "Casual",
    categoryId: 3,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80",
    description: "Everyday style",
  },
  {
    name: "Training",
    categoryId: 4,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80",
    description: "Built to move",
  },
];

const HomePage = () => {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const response = await getProducts(0, 4, "unitsSold", "desc");
        setTrendingProducts(response.content);
      } catch {
        // silently fail
      } finally {
        setLoadingTrending(false);
      }
    };
    loadTrending();
  }, []);

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="animate-fade-in-up order-2 lg:order-1">
              <h1 className="font-display text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4.5rem] text-ink-900">
                Built for
                <br />
                the next mile
              </h1>

              <p className="mt-6 text-lg text-ink-500 leading-relaxed max-w-md">
                Running, training, and everyday shoes chosen for fit and
                comfort — not just looks. Free shipping on every order above
                ₹999.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-ink-900 text-white px-7 py-4 rounded-md font-semibold hover:bg-primary-500 transition-colors"
                >
                  Shop the collection
                </Link>
                <Link
                  to="/products?sort=unitsSold,desc"
                  className="inline-flex items-center justify-center gap-2 border border-ink-200 text-ink-900 px-7 py-4 rounded-md font-semibold hover:border-ink-900 transition-colors"
                >
                  See best sellers
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-8">
                <div>
                  <p className="font-display text-2xl text-ink-900">10k+</p>
                  <p className="text-sm text-ink-400">pairs sold</p>
                </div>
                <div className="h-8 w-px bg-ink-100" aria-hidden="true" />
                <div>
                  <p className="font-display text-2xl text-ink-900 flex items-center gap-1">
                    4.8 <Star size={16} className="fill-primary-500 text-primary-500" />
                  </p>
                  <p className="text-sm text-ink-400">average rating</p>
                </div>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="relative order-1 lg:order-2 animate-fade-in">
              <div className="relative bg-sand-100 aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src="https://ik.imagekit.io/4dzauczkz/6-3-removebg-preview.png?updatedAt=1785964396130"
                  alt="Featured shoe"
                  className="w-[75%] object-contain -rotate-6"
                />
                <div className="absolute bottom-5 left-5 bg-white border border-ink-100 px-4 py-3">
                  <p className="text-xs text-ink-400">This week</p>
                  <p className="font-display text-base text-ink-900">2,400+ sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE STRIP ── */}
      <section className="bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {FEATURE_CARDS.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-center gap-3 py-6 px-4 sm:px-6">
                <Icon size={22} className="shrink-0 text-primary-400" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{title}</p>
                  <p className="text-xs text-ink-300 truncate">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl text-ink-900">
              Shop by category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {CATEGORIES.map(({ name, categoryId, image, description }) => (
              <Link
                key={name}
                to={`/products?category=${categoryId}`}
                className="group relative h-80 overflow-hidden block"
              >
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl text-white">{name}</h3>
                  <p className="text-sm text-white/75 mt-1">{description}</p>
                  <span className="mt-3 inline-block h-0.5 w-8 bg-primary-500 group-hover:w-14 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING PRODUCTS ── */}
      <section className="py-16 sm:py-20 bg-sand-50 border-y border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-3xl sm:text-4xl text-ink-900">
              Trending picks
            </h2>
            <Link
              to="/products?sort=unitsSold,desc"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 hover:text-primary-500 transition-colors"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loadingTrending ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-ink-100 aspect-[3/4] skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <FeaturedProducts />

      {/* ── CTA BANNER ── */}
      <section className="bg-ink-900 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight">
            Find your perfect pair
          </h2>

          <p className="mt-5 text-lg text-ink-300 max-w-xl mx-auto">
            Join thousands who trust Novera for style, comfort, and quality.
            Free shipping on orders above ₹999.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-md font-semibold hover:bg-primary-600 transition-colors"
            >
              Start shopping
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/25 text-white px-8 py-4 rounded-md font-semibold hover:border-white transition-colors"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
