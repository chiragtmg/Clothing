import React, { useEffect, useState } from "react";
import { apiRequest } from "../Services/API";
import ProductCard from "../components/ProductCard";

const Search = () => {

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiRequest.get("/product/get/product");
        const data = res.data.data || res.data || [];
        const productArray = Array.isArray(data) ? data : [];

        setProducts(productArray);

        // random products for initial page
        const shuffled = [...productArray].sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, 8));

      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  // filter products
  const displayProducts =
    search.trim() === ""
      ? randomProducts
      : products.filter((item) =>
          item?.name?.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-10 flex justify-center">
        <input
          type="text"
          placeholder="Enter a search term"
          className="w-full max-w-xl border px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2 className="text-3xl font-serif mb-8">
        Search results: <span className="text-gray-500">"{search}"</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No products found
          </p>
        )}

      </div>

    </div>
  );
};

export default Search;