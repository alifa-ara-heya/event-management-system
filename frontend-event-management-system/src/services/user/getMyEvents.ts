"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface UserEvent {
    id: string;
    name: string;
    description: string | null;
    date: string;
    location: string;
    image: string | null;
    status: string;
    type: string;
    price: number;
    capacity: number;
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
    joinedAt: string;
    participantId: string;
}

export interface PaginatedEvents {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: UserEvent[];
}

export interface GetMyEventsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    type?: string;
}

export const getMyEvents = async (params?: GetMyEventsParams): Promise<PaginatedEvents> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.type) searchParams.set("type", params.type);

    const queryString = searchParams.toString();
    const endpoint = `/user/my/events${queryString ? `?${queryString}` : ""}`;

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

