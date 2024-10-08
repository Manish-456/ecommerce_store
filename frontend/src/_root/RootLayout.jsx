import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useUserStore } from "../stores/useUserStore";

import Navbar from "../components/shared/navbar";
import LoadingSpinner from "../components/shared/loading-spinner";

export default function RootLayout() {
  const { user, checkingAuth, checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="relative pt-20 z-50">
      <Navbar />
      <Outlet />
    </div>
  );
}
