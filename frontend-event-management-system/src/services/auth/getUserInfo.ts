"use server"

import { serverFetch } from "@/lib/server-fetch";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface UserInfo {
    id?: string;
    name?: string;
    email: string;
    role: "ADMIN" | "HOST" | "USER";
    profilePhoto?: string;
}

export const getUserInfo = async (): Promise<UserInfo> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // If no access token, throw error immediately
    if (!accessToken) {
        throw new Error("No access token found");
    }

    try {
        const response = await serverFetch.get("/auth/me", {
            next: { tags: ["user-info"], revalidate: 180 },
        });

        const result = await response.json();

        if (result.success && result.data) {
            // Decode token to get user info
            const decodedToken = jwt.decode(accessToken) as JwtPayload;

            console.log("📸 Profile photo from backend:", result.data.profilePhoto);
            console.log("📋 Full user data:", result.data);

            return {
                id: result.data.id,
                name: result.data.name || decodedToken.name || "Unknown User",
                email: result.data.email || decodedToken.email,
                role: result.data.role || decodedToken.role,
                profilePhoto: result.data.profilePhoto || undefined,
            };
        }

        // If backend says no success, check if token exists as fallback
        const decodedToken = jwt.decode(accessToken) as JwtPayload;
        if (decodedToken && decodedToken.email) {
            return {
                email: decodedToken.email,
                role: decodedToken.role as "ADMIN" | "HOST" | "USER",
                name: decodedToken.name || "Unknown User",
            };
        }

        throw new Error("Failed to get user info");
    } catch (error: any) {
        console.error("Error getting user info:", error);
        // Re-check token in case it was deleted during the request
        const currentToken = cookieStore.get("accessToken")?.value;
        if (!currentToken) {
            throw new Error("No access token found");
        }
        throw error;
    }
};

