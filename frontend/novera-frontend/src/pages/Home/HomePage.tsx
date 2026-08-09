import {
    Truck,
    ShieldCheck,
    RotateCcw,
    BadgeCheck
} from "lucide-react";

import FeatureCard from "../../components/common/FeatureCard";
import FeaturedProducts from "../../components/product/FeaturedProducts";

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}

      <section className="bg-white">

        <div className="max-w-7xl mx-auto px-6 py-20">

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}

            <div>

              <p className="uppercase tracking-[4px] text-blue-600 font-semibold text-sm">
                Step Into Comfort
              </p>

              <h1 className="text-6xl font-black leading-tight mt-6">
                Find Your
                <br />
                Perfect Pair
                <br />
                of Shoes
              </h1>

              <p className="mt-8 text-gray-500 text-lg leading-8 max-w-lg">
                Explore our premium collection of stylish,
                comfortable and performance-driven footwear
                crafted for every journey.
              </p>

              <div className="flex gap-5 mt-10">

                <button
                  className="
                  bg-blue-600
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  hover:bg-blue-700
                  transition
                  "
                >
                  Shop Now
                </button>

                <button
                  className="
                  border
                  border-gray-300
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  hover:bg-gray-100
                  transition
                  "
                >
                  Explore Collection
                </button>

              </div>

            </div>

            {/* Right */}

            <div className="flex justify-center">

              <div
                className="
                h-[520px]
                w-[520px]
                rounded-full
                bg-blue-50
                flex
                items-center
                justify-center
                "
              >

                <img
                  src="https://ik.imagekit.io/4dzauczkz/6-3-removebg-preview.png?updatedAt=1785964396130"
                  alt="Hero Shoe"
                  className="
                  w-[430px]
                  object-contain
                  drop-shadow-2xl
                  "
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="py-10 bg-slate-50">

        <div className="max-w-7xl mx-auto px-6">

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                <FeatureCard
                    icon={<Truck size={28} />}
                    title="Free Shipping"
                    subtitle="Orders above ₹999"
                />

                <FeatureCard
                    icon={<RotateCcw size={28} />}
                    title="7-Day Returns"
                    subtitle="No questions asked"
                />

                <FeatureCard
                    icon={<ShieldCheck size={28} />}
                    title="Secure Payment"
                    subtitle="100% secure checkout"
                />

                <FeatureCard
                    icon={<BadgeCheck size={28} />}
                    title="Premium Quality"
                    subtitle="Curated footwear"
                />

            </div>

        </div>

    </section>

    <FeaturedProducts />

    </>

  );
};

export default HomePage;