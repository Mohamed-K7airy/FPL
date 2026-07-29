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

  // Auto-fix if domain is missing '/api' prefix
  if (clean.startsWith('http') && !clean.endsWith('/api') && !clean.includes('/api/')) {
    clean += '/api';
  }

  return clean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data?.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry: boolean = false
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
    credentials: 'include',
    headers,
  });

  // Handle Token Expiry (HTTP 401 or 403 on JWT expired) automatically
  if ((res.status === 401 || res.status === 403) && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;

      if (newToken) {
        onRefreshed(newToken);
        return apiFetch<T>(endpoint, options, true);
      } else {
        localStorage.removeItem('accessToken');
      }
    } else {
      return new Promise<T>((resolve, reject) => {
        refreshSubscribers.push((newToken: string) => {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          };
          apiFetch<T>(endpoint, options, true).then(resolve).catch(reject);
        });
      });
    }
  }

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
    const errorDetails =
      data?.error?.message ||
      data?.message ||
      (Array.isArray(data?.error?.messages) ? data.error.messages.join(' | ') : null) ||
      (data?.error?.details ? JSON.stringify(data.error.details) : null) ||
      'An API error occurred.';
    throw new Error(errorDetails);
  }

  return data as T;
}
