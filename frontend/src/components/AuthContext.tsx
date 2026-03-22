// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// User ma'lumotlari uchun interfeys
export interface User {
  id: string;
  name: string;
  phone?: string;
  avatar?: string;
  email?: string;
  role?: 'student' | 'teacher' | 'admin';
  rank?: number;
  solvedProblems?: number;
  totalScore?: number;
}

// AuthContext uchun interfeys
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null; // Token qo'shildi
  login: (userData: User, authToken: string) => void; // 2 parametr
  logout: () => void;
  loginRequiredRedirect: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// AuthProvider uchun props interfeysi
interface AuthProviderProps {
  children: ReactNode;
}

// LocalStorage kalitlari
const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

// Context yaratish
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider komponenti
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // LocalStorage'dan ma'lumotlarni yuklash
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_DATA_KEY);

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Ma'lumotlarni parse qilishda xato:", error);
        clearAuthData();
      }
    }
  }, []);

  // Auth ma'lumotlarini tozalash
  const clearAuthData = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Foydalanuvchini yangilash
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    }
  };

  // Login funksiyasi - 2 PARAMETR
  // AuthContext.tsx - login muvaffaqiyatli bo'lganda
const login = (userData: User, authToken: string): void => {
  console.log('Login called with token:', authToken);
  console.log('Token length:', authToken.length);
  
  setUser(userData);
  setToken(authToken);
  setIsAuthenticated(true);
  
  localStorage.setItem(AUTH_TOKEN_KEY, authToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  
  // Saqlanganini tekshirish
  console.log('Saved token:', localStorage.getItem(AUTH_TOKEN_KEY));
  console.log('All localStorage keys:', Object.keys(localStorage));
};

  // Logout funksiyasi
  const logout = (): void => {
    clearAuthData();
    navigate("/login", { replace: true });
  };

  // Login talab qiladigan sahifaga yo'naltirish
  const loginRequiredRedirect = (): void => {
    const currentPath = location.pathname + location.search;
    const encodedPath = encodeURIComponent(currentPath);
    navigate(`/login?next=${encodedPath}`, { replace: true });
  };

  // Context qiymatini yaratish
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    loginRequiredRedirect,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};