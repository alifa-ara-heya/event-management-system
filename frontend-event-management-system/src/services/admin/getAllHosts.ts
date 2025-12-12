"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface GetAllHostsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    searchTerm?: string;
    location?: string;
}

export interface Host {
    id: string;
    email: string;
    name: string | null;
    profilePhoto: string | null;
    bio: string | null;
    location: string | null;
    contactNumber: string | null;
    averageRating: number | null;
    totalRevenue: number;
    isDeleted?: boolean;
    createdAt: string;
    _count?: {
        hostedEvents?: number;
        reviews?: number;
    };
}

export interface GetAllHostsResponse {
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: Host[];
}

export const getAllHosts = async (params?: GetAllHostsParams): Promise<GetAllHostsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    if (params?.searchTerm) searchParams.set("searchTerm", params.searchTerm);
    if (params?.location) searchParams.set("location", params.location);

    const response = await serverFetch.get(`/host?${searchParams.toString()}`);
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch hosts");
    }

    return {
        success: true,
        message: result.message,
        meta: result.meta,
        data: result.data,
    };
};
