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
        className="relative p-2 text-ink-700 hover:text-primary-500 transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCart size={22} />
        {totalItems && totalItems > 0 && (
          <span
            className="
              absolute -top-1 -right-1
              flex h-5 min-w-[20px] items-center justify-center
              rounded-full bg-primary-500 text-[10px] font-bold text-white
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
            className="text-sm font-semibold text-ink-700 hover:text-primary-500 transition-colors hidden sm:inline-block px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="
              text-sm font-semibold text-white
              bg-ink-900 hover:bg-primary-500
              px-4 py-2 rounded-md transition-colors
            "
          >
            Register
          </Link>
        </>
      ) : (
        <button
          type="button"
          onClick={handleLogout}
          className="
            p-2 text-ink-700 hover:text-red-600
            hover:bg-red-50 rounded-md transition-colors
          "
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[76px] items-center justify-between py-3">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-2xl text-ink-900 hover:text-primary-500 transition-colors"
          >
            NOVERA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ name, to }) => (
              <NavLink
                key={name}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `
                    relative min-h-11 px-4 py-2.5 text-sm font-semibold
                    transition-colors duration-150
                    ${
                      isActive
                        ? "text-ink-900"
                        : "text-ink-500 hover:text-ink-900"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{name}</span>
                    {isActive && (
                      <span
                        className="absolute bottom-1.5 left-4 right-4 h-[3px] bg-primary-500"
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
            <form onSubmit={handleSearch} className="relative mr-1">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search shoes"
                className="
                  w-44 lg:w-56 pl-4 pr-10 py-2
                  border border-ink-200 rounded-md
                  bg-sand-50 text-sm
                  transition-colors duration-150
                  placeholder-ink-300
                  focus:outline-none focus:border-primary-400 focus:bg-white
                "
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-ink-400 hover:text-primary-500 transition-colors"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            </form>

            <div className="flex items-center gap-2 pl-2 border-l border-ink-100 ml-1">
              {userSection}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <Link to="/cart" className="relative p-2 text-ink-700" aria-label="Shopping cart">
              <ShoppingCart size={22} />
              {totalItems && totalItems > 0 && <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">{totalItems}</span>}
            </Link>
            <button type="button" aria-label={searchOpen ? "Close search" : "Open search"} onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-ink-700">
              <Search size={22} />
            </button>
            {isAuthenticated ? <button type="button" onClick={handleLogout} className="p-2 text-ink-700" aria-label="Logout"><LogOut size={20} /></button> : <Link to="/login" className="text-sm font-semibold text-ink-700 px-1">Sign in</Link>}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden py-3 border-t border-ink-100 animate-fade-in">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search shoes"
                className="
                  flex-1 px-4 py-2.5
                  border border-ink-200 rounded-md
                  focus:outline-none focus:border-primary-400
                "
              />
              <button
                type="submit"
                className="px-4 text-primary-500"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-ink-100 animate-fade-in" style={{ animationDuration: "0.3s" }}>
            <nav className="flex flex-col py-2">
              {navLinks.map(({ name, to, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `
                      flex items-center gap-3 px-2 py-3 text-sm font-semibold
                      border-l-2
                      ${
                        isActive
                          ? "text-ink-900 border-primary-500 pl-3"
                          : "text-ink-500 border-transparent pl-3"
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
