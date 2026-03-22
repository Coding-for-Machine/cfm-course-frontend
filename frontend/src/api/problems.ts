import { API_BASE_URL, apiRequest } from './base';
import type { 
  ProblemList, 
  ProblemDetail, 
  ProblemQueryParams, 
  Category, 
  Tag, 
  Language,
  FunctionTemplate,
  ExecutionTemplate,
  ProblemStats,
  SubmitCodeData,
  SubmitResponse,
  PaginatedResponse
} from '../types/problems';

class ProblemService {
  private baseUrl = `${API_BASE_URL}`;

  // Get problems list with filters - backend paginated response qaytaradi
 // api/problems.ts - getProblems metodiga
async getProblems(params?: ProblemQueryParams): Promise<PaginatedResponse<ProblemList>> {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `${this.baseUrl}/problems${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  // MUHIM: URL ni konsolga chiqarish
  console.log('🔗 GET PROBLEMS FULL URL:', url);
  console.log('🔗 Base URL:', this.baseUrl);
  console.log('🔗 Query params:', queryParams.toString());
  
  return apiRequest<PaginatedResponse<ProblemList>>(url, { method: 'GET' }, true);
}

  // Get single problem by slug
  async getProblemBySlug(slug: string): Promise<ProblemDetail> {
    return apiRequest<ProblemDetail>(`${this.baseUrl}/problems/${slug}`, { method: 'GET' }, true);
  }

  // Get function template for problem
  async getFunctionTemplate(problemSlug: string, languageSlug: string): Promise<FunctionTemplate> {
    return apiRequest<FunctionTemplate>(
      `${this.baseUrl}/problems/${problemSlug}/function/${languageSlug}`, 
      { method: 'GET' }, 
      true
    );
  }

  // Get execution template
  async getExecutionTemplate(problemSlug: string, languageSlug: string): Promise<ExecutionTemplate> {
    return apiRequest<ExecutionTemplate>(
      `${this.baseUrl}/problems/${problemSlug}/execution/${languageSlug}`, 
      { method: 'GET' }, 
      true
    );
  }

  // Get all categories
  async getCategories(): Promise<Category[]> {
    return apiRequest<Category[]>(`${this.baseUrl}/categories`, { method: 'GET' }, true);
  }

  // Get all tags
  async getTags(): Promise<Tag[]> {
    return apiRequest<Tag[]>(`${this.baseUrl}/tags`, { method: 'GET' }, true);
  }

  // Get all languages
  async getLanguages(): Promise<Language[]> {
    return apiRequest<Language[]>(`${this.baseUrl}/languages`, { method: 'GET' }, true);
  }

  // Get problem statistics
  async getStats(): Promise<ProblemStats> {
    return apiRequest<ProblemStats>(`${this.baseUrl}/stats`, { method: 'GET' }, false);
  }

  // Get contest problems
  async getContestProblems(contestSlug: string): Promise<ProblemList[]> {
    return apiRequest<ProblemList[]>(
      `${this.baseUrl}/contests/${contestSlug}/problems`, 
      { method: 'GET' }, 
      true
    );
  }

  // Submit code
  async submitCode(problemSlug: string, data: SubmitCodeData): Promise<SubmitResponse> {
    return apiRequest<SubmitResponse>(
      `${this.baseUrl}/${problemSlug}/submit`, 
      { 
        method: 'POST',
        body: JSON.stringify(data)
      }, 
      true
    );
  }
}

export const problemService = new ProblemService();