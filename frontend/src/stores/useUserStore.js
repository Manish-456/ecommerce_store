import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  /**
   * Signup a new user
   * @param {string} name The new user's name
   * @param {string} email The new user's email
   * @param {string} password The new user's password
   * @param {string} confirmPassword The new user's password confirmation
   * @returns {Promise<void>} Resolves if signup is successful, rejects if signup fails
   */
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    // Check if passwords match
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      // Send a post request to the /auth/signup route
      const res = await axios.post("/auth/signup", { name, email, password });

      // Set the user state to the new user
      set({ user: res.data, loading: false });
    } catch (error) {
      // If there's an error, set loading to false and toast the error
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
}));
