"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface HostProfile {
    id: string;
    email: string;
    name: string;
    profilePhoto: string | null;
    bio: string | null;
    location: string | null;
    contactNumber: string | null;
    interests?: string[];
    averageRating: number;
    totalRevenue: number;
    createdAt: string;
    hostedEvents: Array<{
        id: string;
        name: string;
        type: string;
        date: string;
        location: string;
        status: string;
        image: string | null;
        currentParticipants: number;
        maxParticipants: number;
    }>;
    reviews: Array<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: string;
        reviewer: {
            email: string;
            profilePhoto: string | null;
        };
    }>;
    _count: {
        hostedEvents: number;
        reviews: number;
    };
}

export const getHostById = async (id: string): Promise<HostProfile> => {
    const response = await serverFetch.get(`/host/${id}`, {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch host");
    }

    return result.data;
};

