import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// User interface
export interface User {
  user_id: string;
  user: string;
  phone: string;
  full_name: string;
  last_login_time: Date;
}

// Constantlar
const LOGIN_REDIRECT_URL = "/";
const LOGOUT_REDIRECT_URL = "/login";
const LOGIN_REQUIRED_URL = "/login";

const LOCAL_USER_KEY = "user";
const LOCAL_STORAGE_KEY = "token";

// Context yaratamiz
const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // App ishga tushganda token va userni localStorage dan o‘qiymiz
  useEffect(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (token) setIsAuthenticated(true);

    const savedUser = localStorage.getItem(LOCAL_USER_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // LOGIN funksiyasi
  const login = (token: string, user: User) => {
    // 1) Tokenni saqlaymiz
    localStorage.setItem(LOCAL_STORAGE_KEY, token);
    setIsAuthenticated(true);

    // 2) User obyektini JSON qilib saqlaymiz
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    setUser(user);

    // next paramni tekshiramiz
    const next = searchParams.get("next");
    const invalid = ["/login", "/logout"];
    const nextValid =
      next && next.startsWith("/") && !invalid.includes(next);

    navigate(nextValid ? next : LOGIN_REDIRECT_URL, { replace: true });
  };

  // LOGOUT funksiyasi
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);

    navigate(LOGOUT_REDIRECT_URL, { replace: true });
  };

  // Protected page → login ga qaytarish
  const loginRequiredRedirect = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);

    const currentPath = location.pathname;
    const nextUrl =
      currentPath === LOGIN_REQUIRED_URL
        ? LOGIN_REQUIRED_URL
        : `${LOGIN_REQUIRED_URL}?next=${currentPath}`;

    navigate(nextUrl, { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loginRequiredRedirect, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
