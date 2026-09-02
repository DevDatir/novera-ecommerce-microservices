import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  ChevronRight,
  Zap,
  TrendingUp,
  ArrowRight,
  Star,
  Award,
} from "lucide-react";
import FeaturedProducts from "../../components/product/FeaturedProducts";
import type { Product } from "../../types/product";
import { getProducts } from "../../service/productService";
import ProductCard from "../../components/product/ProductCard";

const FEATURE_CARDS = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders above ₹999",
    delay: "0ms",
  },
  {
    icon: RotateCcw,
    title: "7-Day Returns",
    subtitle: "No questions asked",
    delay: "100ms",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    subtitle: "100% protected checkout",
    delay: "200ms",
  },
  {
    icon: BadgeCheck,
    title: "Premium Quality",
    subtitle: "Curated footwear",
    delay: "300ms",
  },
];

const CATEGORIES = [
  {
    name: "Running",
    categoryId: 1,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    description: "Engineered for speed",
  },
  {
    name: "Casual",
    categoryId: 3,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",
    description: "Everyday style",
  },
  {
    name: "Training",
    categoryId: 4,
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80",
    description: "Make an impression",
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
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div className="animate-fade-in-up text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-8">
                <Zap size={14} className="text-amber-500" />
                New Season 2026
              </span>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-gray-900 mb-6">
                Step Into{" "}
                <span className="relative inline-block">
                  <span className="gradient-text">Your</span>
                </span>
                <br />
                Perfect Pair
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
                Premium footwear crafted for every journey. Engineered for
                comfort, designed for style.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <Link
                  to="/products"
                  className="
                    w-full sm:w-auto
                    inline-flex items-center justify-center gap-2
                    bg-primary-600 text-white
                    px-8 py-4 rounded-2xl font-bold text-base
                    hover:bg-primary-700 hover:shadow-2xl hover:shadow-primary-900/25
                    transition-all duration-300 hover:-translate-y-1
                  "
                >
                  Shop Now
                  <ArrowRight size={20} />
                </Link>

                <Link
                  to="/products"
                  className="
                    w-full sm:w-auto
                    inline-flex items-center justify-center gap-2
                    bg-white text-gray-900 border-2 border-gray-900
                    px-8 py-4 rounded-2xl font-bold text-base
                    hover:bg-gray-900 hover:text-white
                    transition-all duration-300
                  "
                >
                  Explore Collection
                  <ChevronRight size={20} />
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  Secure Checkout
                </span>
                <span className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-blue-500" />
                  Easy Returns
                </span>
                <span className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  4.8 Rating
                </span>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in">
              <div
                className="
                  relative h-[420px] w-[420px] sm:h-[500px] sm:w-[500px]
                  rounded-full
                  bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100
                  flex items-center justify-center
                  shadow-2xl shadow-blue-200/40
                "
              >
                {/* Decorative rings */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-blue-200/40"
                  style={{ transform: "scale(1.15)" }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 rounded-full border border-indigo-200/30"
                  style={{ transform: "scale(1.3)" }}
                  aria-hidden="true"
                />
                <img
                  src="https://ik.imagekit.io/4dzauczkz/6-3-removebg-preview.png?updatedAt=1785964396130"
                  alt="Featured shoe"
                  className="
                    w-[340px] sm:w-[420px] object-contain
                    drop-shadow-2xl
                    -rotate-12 hover:rotate-0 transition-transform duration-700
                  "
                />
                {/* Floating badge */}
                <div
                  className="
                    absolute bottom-8 right-4 sm:bottom-12 sm:right-8
                    bg-white rounded-2xl p-4 shadow-xl
                    animate-fade-in
                  "
                  style={{ animationDelay: "600ms" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        Trending Now
                      </p>
                      <p className="text-lg font-black text-gray-900">
                        2,400+ sold
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE BANNER ── */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {FEATURE_CARDS.map(({ icon: Icon, title, subtitle, delay }) => (
              <div
                key={title}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:shadow-sm"
                style={{ animationDelay: delay }}
              >
                <div
                  className="
                    shrink-0 h-14 w-14 rounded-2xl
                    bg-gradient-to-br from-blue-50 to-indigo-50
                    flex items-center justify-center
                    text-blue-600
                  "
                >
                  <Icon size={26} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{title}</p>
                  <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">
              Browse by Style
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect shoes for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {CATEGORIES.map(({ name, categoryId, image, description }) => (
              <Link
                key={name}
                to={`/products?category=${categoryId}`}
                className="
                  group relative h-80 rounded-3xl overflow-hidden
                  shadow-lg hover:shadow-2xl
                  transition-all duration-500 hover:-translate-y-2
                "
              >
                <img
                  src={image}
                  alt={name}
                  className="
                    w-full h-full object-cover
                    group-hover:scale-110 transition-transform duration-700
                  "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-black text-white mb-2">{name}</h3>
                  <p className="text-base text-white/80 mb-4">{description}</p>
                  <span
                    className="
                      inline-flex items-center gap-2
                      text-sm font-bold text-white
                      opacity-0 group-hover:opacity-100
                      transform translate-y-2 group-hover:translate-y-0
                      transition-all duration-300
                    "
                  >
                    Shop Now <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING PRODUCTS ── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">
              Hot right now
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
              Trending Picks
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what everyone's loving this season
            </p>
          </div>

          {loadingTrending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-3xl h-96 skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/products?sort=unitsSold,desc"
              className="
                inline-flex items-center gap-2
                bg-primary-600 text-white px-8 py-4 rounded-2xl
                font-bold text-base
                hover:bg-primary-700 hover:shadow-xl
                transition-all duration-300 hover:-translate-y-0.5
              "
            >
              View All Trending <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <FeaturedProducts />

      {/* ── CTA BANNER ── */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Decorative elements */}
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"
          aria-hidden="true"
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest mb-8">
            <Award size={14} className="text-amber-400" />
            Join 10,000+ Happy Customers
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Ready to find your
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              perfect pair?
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands who trust Novera for style, comfort, and quality.
            Free shipping on orders above ₹999.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                bg-white text-gray-900
                px-10 py-5 rounded-2xl font-bold text-lg
                hover:bg-gray-100 hover:shadow-2xl
                transition-all duration-300 hover:-translate-y-1
              "
            >
              Start Shopping <ArrowRight size={20} />
            </Link>
            <Link
              to="/register"
              className="
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                bg-transparent text-white border-2 border-white/30
                px-10 py-5 rounded-2xl font-bold text-lg
                hover:bg-white/10 hover:border-white
                transition-all duration-300
              "
            >
              Create Account
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              Secure Checkout
            </span>
            <span className="flex items-center gap-2">
              <Truck size={18} className="text-blue-400" />
              Free Shipping
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw size={18} className="text-purple-400" />
              Easy Returns
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
