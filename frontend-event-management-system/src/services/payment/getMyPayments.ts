"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface Payment {
    id: string;
    eventId: string;
    userId: string;
    amount: number;
    transactionId: string;
    status: "PAID" | "UNPAID";
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
    event: {
        id: string;
        name: string;
        date: string;
        location: string;
        image: string | null;
    };
}

export interface MyPaymentsResponse {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
    data: Payment[];
}

export interface GetMyPaymentsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: "PAID" | "UNPAID" | "all";
}

export const getMyPayments = async (params?: GetMyPaymentsParams): Promise<MyPaymentsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
    if (params?.status && params.status !== "all") searchParams.set("status", params.status);

    const queryString = searchParams.toString();
    const endpoint = `/payment/my/payments${queryString ? `?${queryString}` : ""}`;

    const response = await serverFetch.get(endpoint);

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch payments");
    }

    return {
        meta: result.meta,
        data: result.data,
    };
};

