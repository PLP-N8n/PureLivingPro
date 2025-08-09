import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

type ApiRequestOptions = {
  method?: string;
  data?: unknown;
  params?: Record<string, any>;
};

export async function apiRequest(
  urlOrMethod: string,
  maybeUrlOrOptions?: string | ApiRequestOptions,
  maybeData?: unknown
): Promise<Response> {
  let method = 'GET';
  let url = '';
  let data: unknown | undefined;
  let params: Record<string, any> | undefined;

  if (typeof maybeUrlOrOptions === 'string') {
    method = urlOrMethod.toUpperCase();
    url = maybeUrlOrOptions;
    data = maybeData;
  } else {
    url = urlOrMethod;
    const options = (maybeUrlOrOptions || {}) as ApiRequestOptions;
    method = (options.method || 'GET').toUpperCase();
    data = options.data;
    params = options.params;
  }

  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) qs.set(k, String(v));
    }
    url += (url.includes('?') ? '&' : '?') + qs.toString();
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Enhanced Query Client with better error handling and caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000, // 30 seconds stale time for better UX
      gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 429 (rate limit)
        if (error?.message?.includes('4') && !error?.message?.includes('429')) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: 1,
      onError: (error: any) => {
        console.error('Mutation error:', error);
        // Global error handling can be added here
      },
    },
  },
});
export async function apiRequestJson<T = any>(
  urlOrMethod: string,
  maybeUrlOrOptions?: string | {
    method?: string;
    data?: unknown;
    params?: Record<string, any>;
  },
  maybeData?: unknown
): Promise<T> {
  const res = await apiRequest(urlOrMethod, maybeUrlOrOptions as any, maybeData);
  return res.json() as Promise<T>;
}
