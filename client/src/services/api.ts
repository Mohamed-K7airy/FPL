const DEFAULT_RAILWAY_API = 'https://fpl-production-fb03.up.railway.app/api';

function getApiBaseUrl(): string {
  let envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (!envUrl || envUrl.trim().length === 0) {
    if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
      envUrl = DEFAULT_RAILWAY_API;
    } else {
      envUrl = '/api';
    }
  }

  let clean = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;

  // Auto-fix if domain is missing '/api' prefix (e.g. https://fpl-production-fb03.up.railway.app -> https://fpl-production-fb03.up.railway.app/api)
  if (clean.startsWith('http') && !clean.endsWith('/api') && !clean.includes('/api/')) {
    clean += '/api';
  }

  return clean;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const url = `${baseUrl}${cleanEndpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    throw new Error('Invalid response received from API server.');
  }

  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || 'An API error occurred.');
  }

  return data as T;
}
