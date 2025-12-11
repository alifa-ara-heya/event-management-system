"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface EventDetail {
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
        bio: string | null;
        location: string | null;
        averageRating: number | null;
        _count: {
            hostedEvents: number;
            reviews: number;
        };
    };
    participants: Array<{
        id: string;
        userId: string;
        joinedAt: string;
        user: {
            email: string;
            name: string | null;
            profilePhoto: string | null;
        };
    }>;
    _count: {
        participants: number;
    };
}

export const getEventById = async (id: string): Promise<EventDetail> => {
    const response = await serverFetch.get(`/event/${id}`, {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch event");
    }

    return result.data;
};

