"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface CreateReviewPayload {
    eventId: string;
    rating: number;
    comment?: string;
}

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    eventId: string | null;
    reviewerId: string;
    hostId: string;
    createdAt: string;
    updatedAt: string;
    reviewer: {
        id: string;
        email: string;
        name: string | null;
        profilePhoto: string | null;
    };
    host: {
        id: string;
        email: string;
        name: string;
        profilePhoto: string | null;
    };
}

export interface CreateReviewResponse {
    success: boolean;
    message: string;
    data?: Review;
}

export const createReview = async (payload: CreateReviewPayload): Promise<CreateReviewResponse> => {
    const response = await serverFetch.post("/review", {
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
        },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to create review");
    }

    return result;
};

export const getEventReviews = async (eventId: string) => {
    const response = await serverFetch.get(`/review/event/${eventId}`, {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch reviews");
    }

    return result.data;
};

export const getHostReviews = async (hostId: string) => {
    const response = await serverFetch.get(`/review/host/${hostId}`, {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch reviews");
    }

    return result.data;
};

