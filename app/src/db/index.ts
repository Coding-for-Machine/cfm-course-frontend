import Dexie, { type Table } from "dexie";
import type { ProblemDetail, ProblemResponse } from "../types/problems";

// ✅ Cache uchun wrapper type
export type CachedProblemResponse = {
  cacheKey: string;           // Primary key
  data: ProblemResponse;      // Actual data
  timestamp: number;          // Cache vaqti
};

export type CachedProblemDetail = {
  slug: string;               // Primary key
  data: ProblemDetail;        // Actual data
  timestamp: number;          // Cache vaqti
};

class AppDB extends Dexie {
  problems!: Table<CachedProblemResponse, string>;
  problemDetails!: Table<CachedProblemDetail, string>;

  constructor() {
    super("leetcode_clone_db");
    this.version(1).stores({
      problems: "cacheKey",        // page+filters
      problemDetails: "slug",      // problem slug
    });
  }
}

export const db = new AppDB();