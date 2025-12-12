"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface EventStatistics {
    totalEvents: number;
    statusBreakdown: {
        open: number;
        full: number;
        cancelled: number;
        completed: number;
    };
    eventsByType: Array<{
        type: string;
        count: number;
    }>;
    timeBreakdown: {
        upcoming: number;
        past: number;
    };
    totalParticipants: number;
    totalRevenue: number;
}

export const getEventStatistics = async (): Promise<EventStatistics> => {
    const response = await serverFetch.get("/admin/statistics/events", {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch event statistics");
    }

    return result.data;
};

