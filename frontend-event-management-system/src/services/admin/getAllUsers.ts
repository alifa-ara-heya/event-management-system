"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface GetAllUsersParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    searchTerm?: string;
    role?: string;
    status?: string;
}

export interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    status: string;
    profilePhoto: string | null;
    bio: string | null;
    location: string | null;
    interests: string[];
    contactNumber: string | null;
    createdAt: string;
    _count?: {
        joinedEvents?: number;
        reviews?: number;
    };
}

export interface GetAllUsersResponse {
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: User[];
}

export const getAllUsers = async (params?: GetAllUsersParams): Promise<GetAllUsersResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    if (params?.searchTerm) searchParams.set("searchTerm", params.searchTerm);
    if (params?.role && params.role !== "all") searchParams.set("role", params.role);
    if (params?.status && params.status !== "all") searchParams.set("status", params.status);

    const response = await serverFetch.get(`/user?${searchParams.toString()}`);
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch users");
    }

    return {
        success: true,
        message: result.message,
        meta: result.meta,
        data: result.data,
    };
};
