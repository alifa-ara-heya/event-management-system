"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface UserDashboardStats {
    overview: {
        totalJoinedEvents: number;
        upcomingEvents: number;
        pastEvents: number;
        totalReviews: number;
    };
    upcomingEvents: Array<{
        id: string;
        name: string;
        date: string;
        location: string;
        image: string | null;
        host: {
            name: string;
            profilePhoto: string | null;
        };
        joinedAt: string;
    }>;
    recentJoinedEvents: Array<{
        id: string;
        name: string;
        date: string;
        location: string;
        image: string | null;
        host: {
            name: string;
            profilePhoto: string | null;
        };
        joinedAt: string;
    }>;
}

export const getUserDashboardStats = async (): Promise<UserDashboardStats> => {
    const response = await serverFetch.get("/user/my/dashboard", {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch dashboard stats");
    }

    return result.data;
};

