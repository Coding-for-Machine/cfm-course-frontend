import { type Contest } from "../types/contests";

const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Token olish
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Agar token yo'q bo'lsa login page ga yuborish
const redirectToLogin = () => {
  localStorage.removeItem('auth_token');
  window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
};

// Faqat tanlovlarni olish
export const fetch_contests = async (): Promise<Contest[]> => {
  const token = getToken();
  
  // Agar token yo'q bo'lsa login page ga
  if (!token) {
    redirectToLogin();
    throw new Error('Authentication required');
  }
  
  try {
    const response = await fetch(`${API_URL}/contests`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    // Agar 401 xatosi (unauthorized) kelsa, login page ga yuborish
    if (response.status === 401) {
      redirectToLogin();
      throw new Error('Session expired. Please login again.');
    }
    
    // Boshqa xatolar uchun
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Contest[];
    
  } catch (error) {
    console.error("Error fetching contests:", error);
    throw error;
  }
};