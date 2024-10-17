import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  createProduct: async (product) => {
    set({ loading: true });
    console.log(product);
    try {
      // Send a post request to the /products/create route
      const res = await axios.post("/products", product);

      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      // If there's an error, set loading to false and toast the error
      set({ loading: false });
      toast.error(error.response.data.error || "An error occurred");
    }
  },
}));
