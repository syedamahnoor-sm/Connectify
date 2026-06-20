import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDashboard = () => {
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    navigate(`/profile/${userId}`);
    setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      {token ? (
        <>
          <button
            onClick={handleDashboard}
            className="flex gap-2 items-center hover:text-purple-400 transition-colors py-2 md:py-0"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              navigate("/notifications");
              setIsOpen(false);
            }}
            className="flex gap-2 items-center hover:text-purple-400 transition-colors py-2 md:py-0"
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex gap-2 items-center hover:text-red-400 transition-colors py-2 md:py-0"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            to="/login"
            className="hover:text-purple-400"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-purple-600 px-4 py-2 rounded-lg text-center"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </>
  );

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-800 fixed top-0 left-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex justify-between py-4 px-6 items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-xl font-bold">C</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">
            Connectify
          </h1>
        </Link>

        {/* Search Bar - Hidden on Mobile, Visible on MD */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people..."
              className="w-full bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none pl-10 rounded-xl py-2 text-sm transition-all"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="relative w-full mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-4">
            <NavLinks />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;