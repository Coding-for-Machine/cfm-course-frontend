// src/services/authService.ts

import type { User } from "../components/AuthContext";

const API_BASE_URL = import.meta.env.VITE_AUTH_URL ||"http://localhost:8080/api";

export interface LoginResponse {
  token: string;
  user: {
    user_id: string;
    username: string;
    phone: string;
    full_name: string;
    last_login: string;
  };
}

export interface ErrorResponse {
  error: string;
}

export class AuthService {
  static async login(otpCode: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ otp_code: otpCode }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    return await response.json();
  }

  static async getUserInfo(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const data = await response.json();
    
    return {
      id: data.user.user_id,
      name: data.user.full_name || data.user.username,
      phone: data.user.phone || "",
      email: data.user.username,
      avatar: `https://ui-avatars.com/api/?name=${data.user.full_name || data.user.username}&background=6366f1&color=fff`,
      role: "student",
      rank: 0,
      solvedProblems: 0,
      totalScore: 0
    };
  }

  static async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  }
}

export default AuthService;