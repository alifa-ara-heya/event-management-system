"use server";

import { serverFetch } from "@/lib/server-fetch";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface HostRequestStatus {
    hasRequest: boolean;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    rejectionReason?: string | null;
    isHost: boolean;
}

export const checkHostRequestStatus = async (): Promise<HostRequestStatus> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        redirect("/login");
    }

    try {
        // Check user's role to see if they're already a host
        const userResponse = await serverFetch.get("/auth/me");
        const userResult = await userResponse.json();

        if (userResult.success && userResult.data) {
            // If user is already a host, return early
            if (userResult.data.role === "HOST") {
                return {
                    hasRequest: true,
                    status: "APPROVED",
                    isHost: true,
                };
            }
        }

        // Note: The backend doesn't have a dedicated "get my host request" endpoint
        // We'll rely on the form submission to handle existing requests
        // The backend will return an error if there's already a pending request
        return {
            hasRequest: false,
            isHost: false,
        };
    } catch (error: any) {
        console.error("Error checking host request status:", error);
        return {
            hasRequest: false,
            isHost: false,
        };
    }
};

