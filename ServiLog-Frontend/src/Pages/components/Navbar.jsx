import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in using token in localStorage
    const token = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName") || "User";
    setIsLoggedIn(!!token);
    setUserName(storedUserName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // User avatar with first letter
  const UserAvatar = () => (
    <div className="w-9 h-9 rounded-full bg-[#D52B1E] text-white flex items-center justify-center font-semibold text-lg cursor-pointer">
      {userName.charAt(0).toUpperCase()}
    </div>
  );

  // Hamburger menu SVG
  const HamburgerIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 12H21"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6H21"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18H21"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-[#D52B1E] text-xl font-bold">
              Servi<span className="text-[#FECB00]">Log</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              // Navigation for logged-in users
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-[#D52B1E] font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="relative ml-2">
                  <div
                    onClick={toggleDropdown}
                    onKeyDown={(e) => e.key === "Enter" && toggleDropdown()}
                    tabIndex={0}
                    role="button"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <UserAvatar />
                  </div>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <div
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogout}
                        onKeyDown={(e) => e.key === "Enter" && handleLogout()}
                        tabIndex={0}
                        role="button"
                      >
                        Log Out
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Navigation for guests (not logged in)
              <>
                <Link to="/login">
                  <button className="bg-[#D52B1E] text-white px-5 py-2 rounded-md hover:bg-[#C42218] transition-colors font-medium">
                    Log In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="border-2 border-[#D52B1E] text-[#D52B1E] px-5 py-2 rounded-md hover:bg-[#D52B1E]/5 transition-colors font-medium">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-700"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md pt-2 pb-3 space-y-1">
          {isLoggedIn ? (
            // Mobile navigation for logged-in users
            <>
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-[#D52B1E] hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                to="/vehicles"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-[#D52B1E] hover:bg-gray-50"
              >
                Vehicle
              </Link>
              <Link
                to="/parts"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-[#D52B1E] hover:bg-gray-50"
              >
                Parts
              </Link>
              <Link
                to="/mileage"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-[#D52B1E] hover:bg-gray-50"
              >
                Mileage
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="px-4 py-2 flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#D52B1E] text-white flex items-center justify-center font-semibold mr-3">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800 font-medium">{userName}</span>
              </div>
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-[#D52B1E] hover:bg-gray-50"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-[#D52B1E] hover:bg-gray-50"
              >
                Settings
              </Link>
              <div
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-[#D52B1E] hover:bg-gray-50 cursor-pointer"
                onClick={handleLogout}
                onKeyDown={(e) => e.key === "Enter" && handleLogout()}
                tabIndex={0}
                role="button"
              >
                Log Out
              </div>
            </>
          ) : (
            // Mobile navigation for guests
            <div className="px-4 py-3 space-y-3">
              <Link to="/login">
                <button className="w-full bg-[#D52B1E] text-white px-4 py-2 rounded-md hover:bg-[#C42218] transition-colors font-medium">
                  Log In
                </button>
              </Link>
              <Link to="/register">
                <button className="w-full border-2 border-[#D52B1E] text-[#D52B1E] px-4 py-2 rounded-md hover:bg-[#D52B1E]/5 transition-colors font-medium">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
