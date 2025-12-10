import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContex";

const AUTH_API = import.meta.env.VITE_AUTH_API_URL;

async function LoginApi(code: string) {
  try {
    const response = await fetch(`${AUTH_API}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp_code: code }),
    });

    if (!response.ok) {
      throw new Error("Login API Error!");
    }

    const data = await response.json();
    return data; // { token, user }

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export default function Login() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const { login } = useAuth(); // AuthContext login()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();

      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length < 6) {
      alert("6 xonani to‘liq to‘ldiring!");
      return;
    }

    try {
      const result = await LoginApi(code);
      // backenddan kelgan response:
      // { token: "...", user: {...} }

      login(result.token, result.user);  // AuthContext orqali login qilish

    } catch (error) {
      alert("Kod noto‘g‘ri yoki API ishlamadi!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <p className="mb-6">6 xonali kodni kiriting</p>

        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center border rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
