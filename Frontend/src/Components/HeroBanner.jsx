import { useEffect, useState } from "react";
import { apiRequest, imgBaseURL } from "../Services/API";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  const [bestSeller, setBestSeller] = useState(null);
  const [randomProduct, setRandomProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        setLoading(true);

        const res = await apiRequest.get("/product/get/product");

        const products = res.data.data || res.data.products || [];


        if (products.length === 0) {
          console.log("⚠️ No products in database");
          setLoading(false);
          return;
        }

        // 1. Find Best Seller
        let best = products.find((p) => p.bestSeller === true);

        // Fallback: Use first product if no bestSeller
        if (!best) {
          best = products[0];
        }

        setBestSeller(best);

        // 2. Pick random product for right side (different from best seller)
        let filtered = products.filter((p) => p._id !== best._id);
        let random = filtered.length > 0 
          ? filtered[Math.floor(Math.random() * filtered.length)]
          : products[1] || products[0];

        setRandomProduct(random);

      } catch (err) {
        console.error("❌ Hero Banner Error:", err);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroProducts();
  }, []);

  if (loading) {
    return (
      <section className="h-[500px] md:h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading featured products...</div>
      </section>
    );
  }

  if (!bestSeller || !randomProduct) {
    return (
      <section className="h-[500px] md:h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600">No products available yet</p>
          <p className="text-gray-500 mt-2">Please add products from admin panel</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 h-[500px] md:h-[600px]">
        
        {/* LEFT - Best Seller */}
        <div className="relative bg-blue-600 overflow-hidden group">
          <img
            src={`${imgBaseURL}${bestSeller.images?.[0] || ""}`}
            alt={bestSeller.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => (e.target.src = "/placeholder-product.jpg")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          <div className="absolute inset-0 flex items-end pb-12 px-8 md:px-16 text-white">
            <div>
              <div className="inline-block bg-red-600 px-5 py-1 rounded-full text-sm font-medium mb-4">
                BEST SELLER 🔥
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                {bestSeller.name}
              </h2>
              <p className="text-2xl mt-3">NPR {bestSeller.price}</p>
              <Link
                to={`/product/${bestSeller._id}`}
                className="mt-6 inline-block bg-white text-black px-8 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT - Random Product */}
        <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden group">
          <img
            src={`${imgBaseURL}${randomProduct.images?.[0] || ""}`}
            alt={randomProduct.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => (e.target.src = "/placeholder-product.jpg")}
          />
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
            <div>
              <p className="text-amber-800 uppercase tracking-widest text-sm mb-3">NEW SEASON</p>
              <h3 className="text-4xl md:text-6xl font-bold text-gray-900">
                {randomProduct.name}
              </h3>
              <p className="text-xl text-gray-700 mt-4">NPR {randomProduct.price}</p>
              <Link
                to={`/product/${randomProduct._id}`}
                className="mt-8 inline-block bg-black text-white px-10 py-4 rounded-full font-semibold hover:bg-gray-800 transition"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;