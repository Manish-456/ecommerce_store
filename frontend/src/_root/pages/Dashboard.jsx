import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TABS } from "../../constants";
import CreateProductForm from "../../components/create-product-form";
import ProductsList from "../../components/products-list";
import { useProductStore } from "../../stores/useProductStore";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>
        <div className="flex justify-center mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "text-gray-300 bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="max-w-xl mx-auto">
          {activeTab === "create" && <CreateProductForm />}
          {activeTab === "products" && <ProductsList />}
        </div>
      </div>
    </div>
  );
}
