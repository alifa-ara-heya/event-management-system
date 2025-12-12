"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface EventActivityData {
    month: string;
    events: number;
}

export const getEventActivityData = async (): Promise<EventActivityData[]> => {
    try {
        // Fetch recent events to calculate activity
        const response = await serverFetch.get("/user/my/events?limit=1000&sortBy=joinedAt&sortOrder=desc");
        const result = await response.json();

        if (!result.success || !result.data) {
            return [];
        }

        const events = result.data || [];

        // Group by month based on joinedAt
        const monthlyMap = new Map<string, number>();
        events.forEach((event: any) => {
            if (event.joinedAt) {
                const date = new Date(event.joinedAt);
                const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                if (!monthlyMap.has(monthKey)) {
                    monthlyMap.set(monthKey, 0);
                }
                monthlyMap.set(monthKey, monthlyMap.get(monthKey)! + 1);
            }
        });

        // Convert to array and sort by date
        const activityData = Array.from(monthlyMap.entries())
            .map(([month, events]) => ({ month, events }))
            .sort((a, b) => {
                // Simple sort by month name (this works for same year)
                return a.month.localeCompare(b.month);
            })
            .slice(-6); // Last 6 months

        return activityData;
    } catch (error) {
        console.error("Error fetching event activity data:", error);
        return [];
    }
};

