import React from "react";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useProductStore } from "../stores/useProductStore";

export default function ProductCard({ product }) {
  const { user } = useUserStore();
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    }
  };
  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="mx-3 mt-3 relative h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt={product.name}
        />
        <div className="absolute bg-black inset-0 bg-opacity-20" />
      </div>
      {/* 'mt-4 px-5 pb-5' */}
      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-white">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 ">
          <p className="text-3xl font-bold text-emerald-400">
            ${product.price}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium"
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
}
