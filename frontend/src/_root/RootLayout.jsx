import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/navbar";

export default function RootLayout() {
  return (
    <div className="relative pt-20 z-50">
      <Navbar />
      <Outlet />
    </div>
  );
}
