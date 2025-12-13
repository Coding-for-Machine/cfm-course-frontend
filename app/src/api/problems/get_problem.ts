import { db } from "../../db/index";
import type { ProblemResponse } from "../../types/problems";

const API_URL = import.meta.env.VITE_BASE_API_URL;
const CACHE_TIME = 5 * 60 * 1000; // 5 daqiqa

export async function get_problem_list(
  page = 1, 
  page_size = 20
): Promise<ProblemResponse | null> {
  const cacheKey = `problems-page-${page}-size-${page_size}`;
  
  try {
    // 1. Dexie dan tekshirish
    const cached = await db.problems.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
      console.log(`✅ Cache HIT: ${cacheKey}`);
      return cached.data;
    }
    
    // 2. API dan olish
    console.log(`🌐 API Request: ${cacheKey}`);
    const response = await fetch(
      `${API_URL}/api/problems/?page=${page}&page_size=${page_size}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ProblemResponse = await response.json();

    // 3. Dexie ga saqlash
    await db.problems.put({
      cacheKey,
      data,
      timestamp: Date.now(),
    });
    
    console.log(`💾 Cache SAVED: ${cacheKey}`);

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}