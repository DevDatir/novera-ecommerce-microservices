import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Search,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContexts";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          className="text-3xl font-black italic tracking-wide"
        >
          NOVERA
        </Link>

        {/* Navigation */}

        <nav className="hidden md:flex gap-8 font-medium">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600 transition"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-semibold"
                : "text-gray-700 hover:text-blue-600 transition"
            }
          >
            Products
          </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-semibold"
              : "text-gray-700 hover:text-blue-600 transition"
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/addresses"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-semibold"
              : "text-gray-700 hover:text-blue-600 transition"
          }
        >
          Addresses
        </NavLink>

        </nav>

        {/* Search */}

        <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 w-80">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search shoes..."
            className="ml-2 bg-transparent outline-none w-full"
          />

        </div>

        {/* Right Section */}

        <div className="flex items-center gap-6">

          <button className="hover:text-blue-600 transition">
            <Heart size={22} />
          </button>

          <Link
            to="/cart"
            className="hover:text-blue-600 transition"
          >
            <ShoppingCart size={22} />
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  bg-blue-600
                  text-white
                  px-5
                  py-2
                  rounded-lg
                  hover:bg-blue-700
                  transition
                "
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">

                <User size={18} />

                <span className="font-medium">
                  {user?.email}
                </span>

              </div>

              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;