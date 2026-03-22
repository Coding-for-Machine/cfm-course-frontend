//base.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';


export const getToken = (): string | null => localStorage.getItem('auth_token');

export const removeTokens = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token
    ? { ...defaultHeaders, 'Authorization': `Bearer ${token}` }
    : defaultHeaders;
};

export class ApiError extends Error {
  status: number;
  data?: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const redirectToLogin = () => {
  removeTokens();
  window.location.href = '/login';
};

export const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) return response.json();
    return response.text() as unknown as T;
  }

  let errorData;
  try { errorData = await response.json(); } 
  catch { errorData = { detail: response.statusText }; }

  switch (response.status) {
    case 401: redirectToLogin(); break;
    case 403: throw new ApiError('Access denied', 403, errorData);
    case 404: throw new ApiError('Not found', 404, errorData);
    default:
      if (response.status >= 500) throw new ApiError('Server error', response.status, errorData);
      throw new ApiError(errorData.detail || errorData.message || 'Request failed', response.status, errorData);
  }
  throw new ApiError('Unauthorized', 401, errorData);
};

export const apiRequest = async <T>(url: string, options: RequestInit = {}, requiresAuth = true): Promise<T> => {
  const headers = requiresAuth ? getAuthHeaders() : defaultHeaders;
  const requestOptions: RequestInit = { ...options, headers: { ...headers, ...options.headers } };
  const response = await fetch(url, requestOptions);
  return handleResponse<T>(response);
};
