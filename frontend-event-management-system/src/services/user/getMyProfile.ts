"use server";

import { serverFetch } from "@/lib/server-fetch";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface UserProfile {
    id: string;
    email: string;
    name: string | null;
    role: "ADMIN" | "HOST" | "USER";
    status: string;
    needPasswordChange: boolean;
    profilePhoto: string | null;
    bio: string | null;
    location: string | null;
    interests: string[];
    // Host/Admin specific fields
    contactNumber?: string | null;
}

export const getMyProfile = async (): Promise<UserProfile> => {
    // Check if user has access token before making request
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        redirect("/login");
    }

    const response = await serverFetch.get("/user/me", {
        next: { revalidate: 0 }, // Always fetch fresh data
    });

    const result = await response.json();

    if (!result.success) {
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
            redirect("/login");
        }
        throw new Error(result.message || "Failed to fetch profile");
    }

    return result.data;
};

