import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to={"/"} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      )}
    </>
  );
}
