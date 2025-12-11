"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface HostDashboardStats {
    overview: {
        totalEvents: number;
        upcomingEvents: number;
        pastEvents: number;
        totalParticipants: number;
        totalRevenue: number;
        averageRating: number;
        totalReviews: number;
    };
    recentUpcomingEvents: Array<{
        id: string;
        name: string;
        status: string;
        date: string;
        location: string;
        image: string | null;
        currentParticipants: number;
        maxParticipants: number;
        joiningFee: number;
        _count: {
            participants: number;
            payments: number;
        };
    }>;
    recentPastEvents: Array<{
        id: string;
        name: string;
        status: string;
        date: string;
        location: string;
        image: string | null;
        currentParticipants: number;
        maxParticipants: number;
        joiningFee: number;
        _count: {
            participants: number;
            payments: number;
        };
    }>;
}

export const getHostDashboardStats = async (): Promise<HostDashboardStats> => {
    const response = await serverFetch.get("/host/my/stats", {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch dashboard stats");
    }

    return result.data;
};

