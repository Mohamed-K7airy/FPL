const DEFAULT_RAILWAY_API = 'https://fpl-production-fb03.up.railway.app/api';

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl;
  }
  
  // If running on Vercel production domain, automatically fallback to Railway API
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return DEFAULT_RAILWAY_API;
  }

  return '/api';
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
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const url = `${cleanBase}${cleanEndpoint}`;

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
