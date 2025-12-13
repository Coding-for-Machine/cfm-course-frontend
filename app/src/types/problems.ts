//  types/problems.tsx
import type { Question } from "./question";

export type Difficulty = 1 | 2 | 3;

/* =======================
   Problems List
======================= */

export type ProblemResult = {
  title: string;
  slug: string;
  difficulty: Difficulty;
  points?: number;
  category?: string;
  is_completed: boolean;
  tags?: string[];
};

export type ProblemResponse = {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
  results: ProblemResult[];
};

/* =======================
   Problem Detail
======================= */

export type ProblemVideo = {
  title: string;
  slug: string;
  description: string;
  hls_url: string;
  thumbnail_url: string;
  status: string;
  duration: number;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
};

export type StartFunction = {
  language_id: number;
  language_name: string;
  template: string;
};

export type ProblemChallenge = {
  id: number;
  text: string;
};

export type ProblemHint = {
  id: number;
  text: string;
};

export type ProblemExample = {
  id: number;
  input_txt: string;
  output_txt: string;
  explanation: string;
};

export type ProblemDetail = {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  points?: number;
  constraints?: string;
  category?: string;
  tags?: string[];

  start_function?: StartFunction[];
  examples?: ProblemExample[];
  hints?: ProblemHint[];
  challenges?: ProblemChallenge[];
  videos?: ProblemVideo[];
  questions?: Question[];

  is_completed: boolean;
};
