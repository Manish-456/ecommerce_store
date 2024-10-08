import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

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

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      // Send a post request to the /auth/login route
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      // Send a get request to the /auth/check-auth route
      const res = await axios.get("/auth/profile");
      set({ user: res.data, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
}));
