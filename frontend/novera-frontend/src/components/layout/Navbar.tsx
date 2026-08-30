import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContexts";
import { useCart } from "../../hooks/useCart";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { logout, isAuthenticated } = useAuth();
  const { cart } = useCart(isAuthenticated);

  const totalItems = cart?.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", to: "/", icon: null },
    { name: "Shop", to: "/products", icon: null },
    { name: "Orders", to: "/orders", icon: Package },
    { name: "Addresses", to: "/addresses", icon: MapPin },
  ];

  const userSection = (
    <>
      <Link
        to="/cart"
        className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCart size={22} />
        {totalItems && totalItems > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              flex h-5 min-w-[20px] items-center justify-center
              rounded-full bg-primary-600 text-[10px] font-bold text-white
            "
          >
            {totalItems}
          </span>
        )}
      </Link>

      {!isAuthenticated ? (
        <>
          <Link
            to="/login"
            className="text-sm font-semibold text-gray-700 hover:text-primary-600 transition-colors hidden sm:inline-block px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="
              text-sm font-semibold text-white
              bg-primary-600 hover:bg-primary-700
              px-4 py-2 rounded-xl transition-colors
            "
          >
            Register
          </Link>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={handleLogout}
            className="
              p-2 text-gray-700 hover:text-red-600
              hover:bg-red-50 rounded-xl transition-colors
            "
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[84px] items-center justify-between py-3">
          {/* Logo */}
          <Link
            to="/"
            className="
              text-3xl font-black italic tracking-tight
              text-gray-900 hover:text-primary-600 transition-colors
            "
          >
            NOVERA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map(({ name, to }) => (
              <NavLink
                key={name}
                to={to}
                className={({ isActive }) =>
                  `
                    relative min-h-11 px-4 py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-200
                    ${
                      isActive
                        ? "text-primary-600 bg-primary-50"
                        : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                    }
                  `
                }
              >
                {(active) => (
                  <>
                    <span>{name}</span>
                    {active && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary-600 rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative mr-1">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search shoes..."
                className="
                  w-44 lg:w-52 px-4 py-2
                  border-2 border-gray-200 rounded-full
                  bg-gray-50 text-sm
                  transition-all duration-300
                  placeholder-gray-400
                  focus:outline-none focus:border-primary-400
                "
              />
              <button
                type="submit"
                className="
                  p-2 text-gray-500 hover:text-primary-600
                  transition-colors
                "
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 ml-1">
              {userSection}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors" aria-label="Shopping cart">
              <ShoppingCart size={22} />
              {totalItems && totalItems > 0 && <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">{totalItems}</span>}
            </Link>
            <button type="button" aria-label={searchOpen ? "Close search" : "Open search"} onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Search size={22} />
            </button>
            {isAuthenticated ? <button type="button" onClick={handleLogout} className="p-2 text-gray-700 hover:text-red-600 transition-colors" aria-label="Logout"><LogOut size={20} /></button> : <Link to="/login" className="text-sm font-semibold text-gray-700">Sign in</Link>}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                p-2 text-gray-700 hover:text-primary-600
                hover:bg-gray-50 rounded-xl transition-colors
              "
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 animate-fade-in">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search shoes..."
                className="
                  flex-1 px-4 py-2.5
                  border-2 border-gray-200 rounded-xl
                  focus:outline-none focus:border-primary-400
                "
              />
              <button
                type="submit"
                className="px-4 text-primary-600 hover:text-primary-700"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t border-gray-100 animate-fade-in"
            style={{ animationDuration: "0.3s" }}
          >
            <nav className="flex flex-col py-2 gap-1">
              {navLinks.map(({ name, to, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={to}
                  className={({ isActive }) =>
                    `
                      flex items-center gap-3 px-4 py-3 text-sm font-semibold
                      rounded-xl mx-3 my-1
                      ${
                        isActive
                          ? "text-primary-600 bg-primary-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `
                  }
                >
                  {Icon && <Icon size={18} className="shrink-0" />}
                  {name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
