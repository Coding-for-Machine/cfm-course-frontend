import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  Home,
  BookOpen,
  Trophy,
  Code,
  LogIn,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "../../context/AuthContex";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLoginClick = () => {
    if (isAuthenticated) navigate("/");
    else navigate("/login");
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* === Logo === */}
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Code size={20} className="text-blue-600" />
          <span className="font-bold">CfM</span>
        </Link>

        {/* === Desktop Links === */}
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-700">
          <Link to="/" className="flex items-center gap-1 hover:text-blue-600 transition">
            <Home size={16} /> Bosh sahifa
          </Link>

          <Link to="/problems" className="flex items-center gap-1 hover:text-blue-600 transition">
            <Code size={16} /> Muammolar
          </Link>

          <Link to="/courses" className="flex items-center gap-1 hover:text-blue-600 transition">
            <BookOpen size={16} /> Kurslar
          </Link>

          <Link to="/contests" className="flex items-center gap-1 hover:text-blue-600 transition">
            <Trophy size={16} /> Olimpiadalar
          </Link>

          {/* === Profile Dropdown === */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
              >
                <img
                  src={user?.avatar || "https://ui-avatars.com/api/?name=U"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
                <span>{user?.username || "User"}</span>
              </button>

              {/* === Dropdown === */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white text-gray-700 rounded-xl border shadow-md py-2">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold">{user?.username}</p>
                    <p className="text-sm text-gray-500">{user?.phone}</p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <User size={16} /> Mening profilim
                  </Link>

                  <div className="border-t my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100 transition"
                  >
                    <LogOut size={16} /> Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              <LogIn size={16} /> Kirish
            </button>
          )}
        </div>

        {/* === Mobile Menu Button === */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* === Mobile Menu === */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 py-3 space-y-3 border-t text-sm text-gray-700">
          <Link onClick={() => setMenuOpen(false)} to="/" className="flex items-center gap-2 hover:text-blue-600">
            <Home size={16} /> Bosh sahifa
          </Link>

          <Link onClick={() => setMenuOpen(false)} to="/problems" className="flex items-center gap-2 hover:text-blue-600">
            <Code size={16} /> Muammolar
          </Link>

          <Link onClick={() => setMenuOpen(false)} to="/courses" className="flex items-center gap-2 hover:text-blue-600">
            <BookOpen size={16} /> Kurslar
          </Link>

          <Link onClick={() => setMenuOpen(false)} to="/contests" className="flex items-center gap-2 hover:text-blue-600">
            <Trophy size={16} /> Olimpiadalar
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left text-red-500 hover:text-red-600"
            >
              <LogOut size={16} /> Chiqish
            </button>
          ) : (
            <button
              onClick={() => {
                handleLoginClick();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left hover:text-blue-600"
            >
              <LogIn size={16} /> Kirish
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
