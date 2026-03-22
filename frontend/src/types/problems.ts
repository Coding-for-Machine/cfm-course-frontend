// -------------------- Category --------------------
export interface Category {
  name: string;
  slug: string;
}

// -------------------- Tag --------------------
export interface Tag {
  id: number;
  name: string;
}

// -------------------- Language --------------------
export interface Language {
  name: string;
  slug: string | null;
}

// -------------------- Example --------------------
export interface Example {
  id: number;
  input_txt: string;
  output_txt: string;
  explanation?: string | null;
}

// -------------------- Hint --------------------
export interface Hint {
  id: number;
  text: string;
}

// -------------------- Challenge --------------------
export interface Challenge {
  id: number;
  text: string;
}

// -------------------- Function Template --------------------
export interface FunctionTemplate {
  function: string;
}

// -------------------- Execution Template --------------------
export interface ExecutionTemplate {
  top_code: string | null;
  bottom_code: string;
}

// -------------------- Test Result --------------------
export interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  execution_time?: number | null;
  memory_used?: number | null;
}

export type SubmissionStatus = 'accepted' | 'wrong_answer' | 'time_limit' | 'memory_limit' | 'runtime_error';

// -------------------- Submit Response --------------------
export interface SubmitResponse {
  success: boolean;
  results: TestResult[];
  message: string;
  total_tests: number;
  passed_tests: number;
  execution_time?: number | null;
  memory_used?: number | null;
  status: SubmissionStatus;
}

// -------------------- Submit Code Data --------------------
export interface SubmitCodeData {
  code: string;
  language_id: number;
}

// -------------------- Difficulty --------------------
export type Difficulty = 'easy' | 'medium' | 'hard';

// -------------------- Problem Type --------------------
export type ProblemType = 'darslik' | 'test' | 'probelm';

// -------------------- Pagination --------------------
export interface PaginatedResponse<T> {
  items: T[];
  count: number;
}

// -------------------- Query Params --------------------
export interface ProblemQueryParams {
  difficulty?: Difficulty;
  category_id?: number;  // backend category_id qabul qiladi
  tag_id?: number;
  search?: string;
  problem_type?: ProblemType;
  contest_id?: number;
  limit?: number;
  offset?: number;
}

// -------------------- Problem List --------------------
export interface ProblemList {
  title: string;
  slug: string;
  difficulty: Difficulty;
  points: number;
  problem_type: ProblemType;
  category: {
    name: string;
    slug: string;
  } | null;
  tags: Tag[];
  solved_count?: number;
  is_solved?: boolean;
}

// -------------------- Problem Detail --------------------
export interface ProblemDetail {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  problem_type: ProblemType;
  constraints: string;
  
  // Foreign Keys
  category: Category | null;
  tags: Tag[];
  languages: Language[];
  
  // Related data
  examples: Example[];
  hints: Hint[];
  challenges: Challenge[];
  
  // Settings
  time_limit: number;
  memory_limit: number;
  
  // Metadata
  created_at: string | null;
  updated_at: string | null;
  is_solved?: boolean;
}

// -------------------- Stats --------------------
export interface ProblemStats {
  total_problems: number;
  total_categories: number;
  total_tags: number;
  total_languages: number;
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  problem_type_distribution: {
    darslik: number;
    test: number;
    problem: number;
  };
}