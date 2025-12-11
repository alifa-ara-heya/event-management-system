"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface AdminDashboardStats {
    overview: {
        totalUsers: number;
        totalHosts: number;
        totalEvents: number;
        totalPayments: number;
        activeUsers: number;
        activeHosts: number;
        activeEvents: number;
        pendingHostRequests: number;
        totalRevenue: number;
    };
    recentEvents: Array<{
        id: string;
        name: string;
        date: string;
        location: string;
        image: string | null;
        host: {
            name: string;
            email: string;
        };
        _count: {
            participants: number;
        };
    }>;
    recentUsers: Array<{
        id: string;
        email: string;
        name: string;
        role: string;
        createdAt: string;
    }>;
}

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
    const response = await serverFetch.get("/admin/dashboard/stats", {
        next: { revalidate: 60 },
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch dashboard stats");
    }

    return result.data;
};

