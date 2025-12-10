const AUTH_API = import.meta.env.VITE_AUTH_API_URL;

export const authService = {
  sendOtp: async (phone: string) => {
    const res = await fetch(`${AUTH_API}/api/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    return res.json();
  },

  verifyOtp: async (otp_code: string) => {
    const res = await fetch(`${AUTH_API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp_code })
    });

    if (!res.ok) throw new Error("OTP noto‘g‘ri!");

    return res.json(); // { token, user }
  },
};
