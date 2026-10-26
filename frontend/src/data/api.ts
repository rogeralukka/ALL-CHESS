export class ApiError extends Error {
  public status: number;
  public error: string;
  public detail: unknown;

  constructor(status: number, error: string, detail: unknown) {
    super(typeof detail === 'string' ? detail : error || 'API Error');
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.detail = detail;
  }
}

const BASE_URL = '/api/v1';

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let url = endpoint.startsWith('http') || endpoint.startsWith('/api')
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Ensure url is parseable in Node/jsdom test environments where relative fetch throws
  if (!url.startsWith('http')) {
    const origin =
      typeof window !== 'undefined' &&
      window.location?.origin &&
      window.location.origin !== 'null' &&
      !window.location.origin.startsWith('about:')
        ? window.location.origin
        : 'http://127.0.0.1:8000';
    url = `${origin}${url.startsWith('/') ? url : `/${url}`}`;
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-required'));
    }
  }

  let data: unknown = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const obj = typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : null;
    const errorStr = (obj && typeof obj.error === 'string')
      ? obj.error
      : response.statusText || 'Error';
    const detail = (obj && 'detail' in obj)
      ? obj.detail
      : data || response.statusText;
    throw new ApiError(response.status, errorStr, detail);
  }

  return data as T;
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    }),
  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    }),
  del: <T = unknown>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
