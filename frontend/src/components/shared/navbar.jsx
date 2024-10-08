import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
export default function Navbar() {
  const { user, logout } = useUserStore();
  const isAdmin = user.role === "admin";
  const cart = [1, 2, 3];
  return (
    <header className="fixed z-40 top-0 px-4 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <Link
            to={"/"}
            className="text-2xl font-bold text-emerald-400 items-center space-x-2 flex"
          >
            E-Store
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="relative group mr-4 text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-emerald-400"
                  size={20}
                />
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 left-3 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user && (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3
						rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
