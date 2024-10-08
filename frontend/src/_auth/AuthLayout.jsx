import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "../components/shared/loading-spinner";

export default function AuthLayout() {
  const { user, checkingAuth, checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </>
  );
}
