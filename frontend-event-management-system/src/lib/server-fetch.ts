import { cookies } from "next/headers";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

// Server-side fetch helper for API calls
const serverFetchHelper = async (endpoint: string, options: RequestInit): Promise<Response> => {
    const { headers = {}, body, ...restOptions } = options;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";
    const refreshToken = cookieStore.get("refreshToken")?.value || "";

    // Build cookie header with both tokens
    const cookieHeader = [];
    if (accessToken) cookieHeader.push(`accessToken=${accessToken}`);
    if (refreshToken) cookieHeader.push(`refreshToken=${refreshToken}`);

    // If body is FormData, don't set Content-Type header (fetch will set it with boundary)
    const isFormData = body instanceof FormData;
    const hasContentType = headers && typeof headers === 'object' && 'Content-Type' in headers;
    const requestHeaders: HeadersInit = {
        ...(cookieHeader.length > 0 ? { Cookie: cookieHeader.join("; ") } : {}),
        // Only set Content-Type if not FormData and not already set
        ...(isFormData || hasContentType ? {} : { "Content-Type": "application/json" }),
        ...headers,
    };

    const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
        headers: requestHeaders,
        credentials: "include",
        body,
        ...restOptions,
    })

    return response;
}

export const serverFetch = {
    get: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "GET" }),

    post: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "POST" }),

    put: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
}

