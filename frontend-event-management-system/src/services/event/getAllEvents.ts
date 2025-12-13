"use server";

// Public fetch for endpoints that don't require authentication
const publicFetch = async (endpoint: string, options: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {}): Promise<Response> => {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";
    const { headers = {}, next, ...restOptions } = options;

    const requestHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...headers,
    };

    // Use Next.js fetch with caching options if provided
    return fetch(`${BACKEND_API_URL}${endpoint}`, {
        headers: requestHeaders,
        ...(next ? { next } : {}),
        ...restOptions,
    });
};

export interface PublicEvent {
    id: string;
    name: string;
    description: string | null;
    date: string;
    location: string;
    image: string | null;
    status: string;
    type: string;
    joiningFee: number;
    minParticipants: number;
    maxParticipants: number;
    currentParticipants: number;
    host: {
        id: string;
        name: string;
        email: string;
        profilePhoto: string | null;
        averageRating: number | null;
    };
    _count: {
        participants: number;
    };
}

export interface AllEventsResponse {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: PublicEvent[];
}

export interface GetAllEventsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    type?: string;
    searchTerm?: string;
    includePast?: boolean;
}

export const getAllEvents = async (params?: GetAllEventsParams): Promise<AllEventsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    if (params?.status && params.status !== "all") searchParams.set("status", params.status);
    if (params?.type && params.type !== "all") searchParams.set("type", params.type);
    if (params?.searchTerm) searchParams.set("searchTerm", params.searchTerm);
    // Only set includePast if it's explicitly true, otherwise backend will filter out past events
    if (params?.includePast === true) {
        searchParams.set("includePast", "true");
    }

    const queryString = searchParams.toString();
    const endpoint = `/event${queryString ? `?${queryString}` : ""}`;

    // Use public fetch since events are public and don't require authentication
    const response = await publicFetch(endpoint, {
        method: "GET",
        next: { revalidate: 60, tags: ["events"] }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
        // If response is not OK, return empty data instead of throwing
        console.error(`Failed to fetch events: ${response.status} ${response.statusText}`);
        return {
            meta: { page: 1, limit: 10, total: 0 },
            data: [],
        };
    }

    const result = await response.json();

    if (!result.success) {
        console.error("API returned error:", result.message);
        return {
            meta: { page: 1, limit: 10, total: 0 },
            data: [],
        };
    }

    return {
        meta: result.meta || { page: 1, limit: 10, total: 0 },
        data: result.data || [],
    };
};

