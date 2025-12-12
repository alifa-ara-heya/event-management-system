"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface GetAllHostRequestsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    searchTerm?: string;
    status?: string;
}

export interface HostRequest {
    id: string;
    userId: string;
    name: string;
    email: string;
    contactNumber: string | null;
    bio: string | null;
    location: string | null;
    status: string;
    rejectionReason: string | null;
    createdAt: string;
    user: {
        email: string;
        role: string;
        status: string;
    };
}

export interface GetAllHostRequestsResponse {
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: HostRequest[];
}

export const getAllHostRequests = async (params?: GetAllHostRequestsParams): Promise<GetAllHostRequestsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    if (params?.searchTerm) searchParams.set("searchTerm", params.searchTerm);
    if (params?.status && params.status !== "all") searchParams.set("status", params.status);

    const response = await serverFetch.get(`/host/requests?${searchParams.toString()}`);
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch host requests");
    }

    return {
        success: true,
        message: result.message,
        meta: result.meta,
        data: result.data,
    };
};
