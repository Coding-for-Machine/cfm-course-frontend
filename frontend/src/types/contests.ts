// src/types/contests.ts
export interface Contest {
  id: number;
  title: string;
  description: string;
  type: 'ochiq' | 'yopiq';
  status: 'kutilmoqda' | 'davom etmoqda' | 'yakunlangan';
  startTime: string;
  endTime: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  difficulty: 'oson' | 'o\'rtacha' | 'qiyin';
  prizes: string[];
  registered: boolean;
  accessKey?: string;
  currentRank?: number;
  solvedProblems?: number;
  totalProblems?: number;
  userRank?: number;
  userScore?: number;
  maxScore?: number;
  category?: string[];
  featured?: boolean;
}

export interface FilterState {
  status: string;
  type: string;
  difficulty: string;
  search: string;
}