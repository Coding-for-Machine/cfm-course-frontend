// src/api/problems/get_problem_detail.ts
import { db } from "../../db";
import type { ProblemDetail } from "../../types/problems";

const API_URL = import.meta.env.VITE_BASE_API_URL;
const CACHE_TIME = 5 * 60 * 1000; // 5 daqiqa

export async function get_problem_detail(
  slug: string
): Promise<ProblemDetail | null> {
  try {
    // 1️⃣ Tokenni chaqirish (funksiya ichida bo‘lsin)
    const token = localStorage.getItem("token");

    // 2️⃣ IndexedDB cache tekshirish
    const cached = await db.problemDetails.get(slug);

    if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
      console.log(`✅ Cache HIT: problem/${slug}`);
      return cached.data;
    }

    // 3️⃣ API request
    console.log(`🌐 API Request: problem/${slug}`);

    const response = await fetch(
      `${API_URL}/api/problems/${slug}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ProblemDetail = await response.json();

    // 4️⃣ IndexedDB ga saqlash
    await db.problemDetails.put({
      slug,
      data,
      timestamp: Date.now(),
    });

    console.log(`💾 Cache SAVED: problem/${slug}`);

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
