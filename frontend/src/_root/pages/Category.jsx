import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useProductStore } from "../../stores/useProductStore";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/product-card";

export default function Category() {
  const { fetchProductsByCategory, products } = useProductStore();

  const { category } = useParams();
  useEffect(() => {
    fetchProductsByCategory(category);
  }, [category, fetchProductsByCategory]);

  return (
    <>
      <div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <motion.h1
            className="text-center capitalize text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {" "}
            {category}
          </motion.h1>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {products?.length === 0 && (
              <h2 className="text-3xl text-center font-semibold text-gray-300 col-span-full">
                No products found
              </h2>
            )}

            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
