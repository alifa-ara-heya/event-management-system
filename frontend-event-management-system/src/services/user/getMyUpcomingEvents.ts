"use server";

import { serverFetch } from "@/lib/server-fetch";
import { UserEvent, PaginatedEvents } from "./getMyEvents";

export interface GetMyUpcomingEventsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const getMyUpcomingEvents = async (params?: GetMyUpcomingEventsParams): Promise<PaginatedEvents> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const queryString = searchParams.toString();
    const endpoint = `/user/my/events/upcoming${queryString ? `?${queryString}` : ""}`;

    const response = await serverFetch.get(endpoint, {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch upcoming events");
    }

    return {
        meta: result.meta,
        data: result.data,
    };
};

