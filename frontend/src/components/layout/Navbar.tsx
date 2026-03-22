// src/components/layout/Navbar.tsx
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
  User,
  Settings,
  HelpCircle,
  Cloud,
  ChevronDown,
  Bell,
  Star
} from "lucide-react";
import { useAuth } from "../AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLoginClick = () => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileOpen(false);
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: "Yangi masala qo'shildi: 'Ikkilik daraxt'", time: "5 min oldin" },
    { id: 2, text: "Sizning yechimingiz qabul qilindi", time: "1 soat oldin" },
    { id: 3, text: "Yangi kurs ochildi: 'Ma'lumotlar tuzilmasi'", time: "Kecha" },
  ];

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-yellow-400 hover:text-yellow-300 transition"
        >
          <Code size={20} />
          <span>CfM</span>
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">IOI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center text-sm">
          <Link to="/" className="flex items-center gap-1 hover:text-yellow-400 transition">
            <Home size={16} /> Bosh sahifa
          </Link>
          <Link to="/problems" className="flex items-center gap-1 hover:text-yellow-400 transition">
            <Code size={16} /> Muammolar
          </Link>
          <Link to="/courses" className="flex items-center gap-1 hover:text-yellow-400 transition">
            <BookOpen size={16} /> Kurslar
          </Link>
          <Link to="/contests" className="flex items-center gap-1 hover:text-yellow-400 transition">
            <Trophy size={16} /> Olimpiadalar
          </Link>
          <Link to="/practice" className="flex items-center gap-1 hover:text-yellow-400 transition">
            <Cloud size={16} /> Amaliyot
          </Link>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-full hover:bg-gray-800 transition"
                >
                  <Bell size={18} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <p className="font-semibold">Bildirishnomalar</p>
                      <button className="text-sm text-blue-500 hover:text-blue-700">
                        Barchasini o'qilgan deb belgilash
                      </button>
                    </div>
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <p className="text-sm">{notif.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Section */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=6366f1&color=fff`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border-2 border-yellow-400"
                  />
                  <div className="text-left">
                    <span className="text-sm font-medium block">{user?.name || "Foydalanuvchi"}</span>
                    {user?.rank && (
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-yellow-400" />
                        <span className="text-xs text-gray-300">#{user.rank}</span>
                      </div>
                    )}
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="font-semibold flex items-center gap-2">
                        <img
                          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || "User"}`}
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        {user?.name || "Foydalanuvchi"}
                      </p>
                      {user?.phone && (
                        <p className="text-sm text-gray-500 mt-1">{user.phone}</p>
                      )}
                      {user?.totalScore && (
                        <div className="mt-2 flex justify-between text-sm">
                          <span>Umumiy ball:</span>
                          <span className="font-bold text-green-600">{user.totalScore}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={16} /> Mening profilim
                    </Link>
                    <Link
                      to="/my-solutions"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Code size={16} /> Mening yechimlarim
                    </Link>
                    <Link
                      to="/courses"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <BookOpen size={16} /> Kurslar
                    </Link>
                    <Link
                      to="/live"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Cloud size={16} /> Jonli darslar
                    </Link>
                    <Link
                      to="/arena"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Trophy size={16} /> Arena
                    </Link>

                    <div className="border-t border-gray-200 my-1"></div>

                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={16} /> Sozlamalar
                    </Link>
                    <Link
                      to="/help"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      <HelpCircle size={16} /> Yordam
                    </Link>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      <LogOut size={16} /> Chiqish
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-2 bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 font-medium transition"
            >
              <LogIn size={16} /> Kirish
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-1.5 rounded-lg hover:bg-gray-800 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-3 space-y-3 border-t border-gray-700 text-sm">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-700"
          >
            <Home size={16} /> Bosh sahifa
          </Link>
          <Link
            to="/problems"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-700"
          >
            <Code size={16} /> Muammolar
          </Link>
          <Link
            to="/courses"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-700"
          >
            <BookOpen size={16} /> Kurslar
          </Link>
          <Link
            to="/contests"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-700"
          >
            <Trophy size={16} /> Olimpiadalar
          </Link>
          <Link
            to="/practice"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-700"
          >
            <Cloud size={16} /> Amaliyot
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-700"
              >
                <User size={16} /> Profil
              </Link>
              <Link
                to="/my-solutions"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-700"
              >
                <Code size={16} /> Yechimlarim
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-red-500 font-medium w-full text-left transition p-2 rounded-lg hover:bg-gray-700"
              >
                <LogOut size={16} /> Chiqish
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                handleLoginClick();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 hover:text-yellow-400 font-medium w-full text-left transition p-2 rounded-lg hover:bg-gray-700"
            >
              <LogIn size={16} /> Kirish
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;