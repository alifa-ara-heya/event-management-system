"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface HostEvent {
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
    _count: {
        participants: number;
    };
}

export interface PaginatedHostEvents {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: HostEvent[];
}

export interface GetHostEventsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    searchTerm?: string;
}

export const getHostEvents = async (params?: GetHostEventsParams): Promise<PaginatedHostEvents> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.searchTerm) searchParams.set("searchTerm", params.searchTerm);

    const queryString = searchParams.toString();
    const endpoint = `/event/my/events${queryString ? `?${queryString}` : ""}`;

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

