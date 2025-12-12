"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface DeleteUserResponse {
    success: boolean;
    message: string;
}

export const deleteUser = async (userId: string): Promise<DeleteUserResponse> => {
    try {
        const response = await serverFetch.delete(`/user/${userId}`);

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to delete user");
        }

        return {
            success: true,
            message: result.message || "User deleted successfully",
        };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        throw new Error(error.message || "Failed to delete user");
    }
};

export interface ChangeUserStatusResponse {
    success: boolean;
    message: string;
}

export const changeUserStatus = async (userId: string, status: string): Promise<ChangeUserStatusResponse> => {
    try {
        const response = await serverFetch.patch(`/user/${userId}/status`, {
            body: JSON.stringify({ status }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to change user status");
        }

        return {
            success: true,
            message: result.message || "User status updated successfully",
        };
    } catch (error: any) {
        console.error("Error changing user status:", error);
        throw new Error(error.message || "Failed to change user status");
    }
};

