// src/pages/Login.tsx
import React, { useState, useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Key, 
  Shield, 
  RefreshCw, 
  Bot,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useAuth } from "../components/AuthContext";

const API_URL = `${import.meta.env.VITE_AUTH_URL}/login` || "http://localhost:8080/api/login";

interface LoginResponse {
  token: string;
  user: {
    user_id: string;
    username: string;
    phone: string;
    full_name: string;
    last_login: string;
  };
}

interface ErrorResponse {
  error: string;
}

const Login: React.FC = () => {
  const { login } = useAuth(); // Endi login(userData, token) qabul qiladi
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ 
    text: string; 
    type: 'success' | 'error' | 'info' 
  }>({ 
    text: "", 
    type: "info" 
  });
  
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const otpRefs = useRef<HTMLInputElement[]>([]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && otpSent) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, otpSent]);

  const focusInput = (index: number) => {
    if (otpRefs.current[index]) {
      otpRefs.current[index].focus();
    }
  };

  const getOTP = (): string => {
    return otpRefs.current.map((input) => input?.value || "").join("");
  };

  const clearInputs = () => {
    otpRefs.current.forEach((input) => {
      if (input) {
        input.value = "";
        input.classList.remove("filled");
      }
    });
    focusInput(0);
  };

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    
    if (type === 'success') {
      setTimeout(() => {
        setMessage(prev => prev.text === text ? { text: "", type: "info" } : prev);
      }, 3000);
    }
  };

  const openTelegramBot = () => {
    const botUrl = "https://t.me/cfm_login_bot";
    window.open(botUrl, "_blank");
    
    showMessage("Telegram bot ochildi! Kodni oling va kiriting", "info");
    setOtpSent(true);
    setTimeLeft(60);
    focusInput(0);
  };

  const submitOTP = async () => {
    const otpCode = getOTP();
    
    if (otpCode.length !== 6) {
      showMessage("Iltimos, 6 ta raqam kiriting", "error");
      return;
    }

    if (!/^\d{6}$/.test(otpCode)) {
      showMessage("Faqat raqamlar kiritilishi kerak", "error");
      return;
    }

    setLoading(true);
    showMessage("", "info");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          otp_code: otpCode 
        }),
      });

      const data: LoginResponse | ErrorResponse = await response.json();

      if (response.ok && 'token' in data) {
        showMessage("✅ Muvaffaqiyatli! Kirilmoqda...", "success");
        
        // User ma'lumotlarini tayyorlash
        const userData = {
          id: data.user.user_id,
          name: data.user.full_name || data.user.username,
          phone: data.user.phone || "",
          email: data.user.username,
          avatar: `https://ui-avatars.com/api/?name=${data.user.full_name || data.user.username}&background=6366f1&color=fff`,
          role: "student" as const,
          rank: 0,
          solvedProblems: 0,
          totalScore: 0
        };

        // AuthContext ga login qilish - IKKITA PARAMETR BILAN
        login(userData, data.token); // ⬅️ TOKEN HAM QO'SHILDI
        
        // Next URL mavjud bo'lsa, o'sha sahifaga yo'naltirish
        const params = new URLSearchParams(location.search);
        const nextUrl = params.get("next");
        
        setTimeout(() => {
          if (nextUrl) {
            navigate(decodeURIComponent(nextUrl), { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 1500);
        
      } else {
        const errorMsg = 'error' in data ? data.error : "Xatolik yuz berdi";
        showMessage(`❌ ${errorMsg}`, "error");
        clearInputs();
      }
    } catch (err: any) {
      console.error("Login error:", err);
      showMessage("🌐 Server bilan aloqa xatosi", "error");
      clearInputs();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      const prevInput = otpRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
        prevInput.value = "";
        prevInput.classList.remove("filled");
      }
    }
    
    if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }
    
    if (e.key === "ArrowRight" && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/, "");
    e.target.value = value;

    if (value) {
      e.target.classList.add("filled");
    } else {
      e.target.classList.remove("filled");
    }

    if (value && index < 5) {
      focusInput(index + 1);
    }
    
    if (index === 5 && value) {
      submitOTP();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    
    pasted.split("").forEach((char, i) => {
      const input = otpRefs.current[i];
      if (input) {
        input.value = char;
        input.classList.add("filled");
      }
    });
    
    if (pasted.length === 6) {
      submitOTP();
    } else {
      focusInput(Math.min(pasted.length, 5));
    }
  };

  const handleResendOTP = () => {
    if (timeLeft > 0) return;
    
    clearInputs();
    setTimeLeft(60);
    openTelegramBot();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            CfM IOI Platform
          </h1>
          <p className="text-gray-400 text-sm">
            OTP orqali tizimga kirish
          </p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === "error" 
              ? "bg-red-500/10 border-red-500/30" 
              : message.type === "success"
              ? "bg-green-500/10 border-green-500/30"
              : "bg-blue-500/10 border-blue-500/30"
          }`}>
            <div className="flex items-center gap-3">
              {message.type === "error" ? (
                <AlertCircle size={20} className="text-red-400" />
              ) : message.type === "success" ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <Clock size={20} className="text-blue-400" />
              )}
              <span className={`text-sm font-medium ${
                message.type === "error" ? "text-red-300" :
                message.type === "success" ? "text-green-300" : "text-blue-300"
              }`}>
                {message.text}
              </span>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-blue-500/30 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Bot size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">@cfm_login_bot</h3>
              <p className="text-sm text-gray-400">
                Telegram bot orqali kirish kodingizni oling
              </p>
            </div>
            <button
              onClick={openTelegramBot}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg flex items-center gap-1 transition"
            >
              O'tish <ExternalLink size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Botga murojaat qiling va 6 xonali OTP kodni oling
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm font-medium text-gray-300">
              6 xonali OTP kod
            </label>
            {timeLeft > 0 && (
              <div className="text-sm text-gray-400 flex items-center gap-1">
                <Clock size={14} />
                {timeLeft}s
              </div>
            )}
          </div>
          
          <div 
            className="flex justify-center gap-3"
            onPaste={handlePaste}
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  if (el) otpRefs.current[idx] = el;
                }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                autoComplete="off"
                disabled={loading}
                className={`w-14 h-16 text-2xl font-bold text-center ${
                  loading ? 'bg-gray-800/30' : 'bg-gray-800/50'
                } border-2 ${
                  otpRefs.current[idx]?.value 
                    ? "border-blue-500 bg-blue-500/10" 
                    : "border-gray-700 hover:border-gray-600"
                } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-50`}
                onChange={(e) => handleInput(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
        </div>

        {otpSent && (
          <div className="text-center mb-6">
            {timeLeft > 0 ? (
              <div className="text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  Kod muddati: {timeLeft} soniya
                </div>
              </div>
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} />
                Yangi kod so'rash
              </button>
            )}
          </div>
        )}

        <button
          onClick={submitOTP}
          disabled={loading || getOTP().length !== 6}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Tekshirilmoqda...
            </>
          ) : (
            <>
              <Key size={18} />
              Kirish
            </>
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <div className="text-center text-sm text-gray-500 mb-3">
            Botdan kod ololmadingizmi?
            <button
              onClick={openTelegramBot}
              className="text-blue-400 hover:text-blue-300 font-medium ml-2"
            >
              Botni ochish
            </button>
          </div>
          
          <div className="text-center">
            <a
              href="https://42.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-400 transition flex items-center justify-center gap-1"
            >
              <Shield size={12} />
              CfM Education Platform
            </a>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">
                OTP kod faqat 60 soniya amal qiladi. Har bir kod faqat bir marta ishlatilishi mumkin.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Bir necha marta noto'g'ri urinishlar blokirovkaga olib kelishi mumkin.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Login;