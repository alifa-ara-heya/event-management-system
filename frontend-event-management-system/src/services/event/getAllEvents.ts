"use server";

import { serverFetch } from "@/lib/server-fetch";

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

    const response = await serverFetch.get(endpoint, {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch events");
    }

    return {
        meta: result.meta,
        data: result.data,
    };
};

