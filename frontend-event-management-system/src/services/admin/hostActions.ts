"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface DeleteHostResponse {
    success: boolean;
    message: string;
}

export const deleteHost = async (hostId: string): Promise<DeleteHostResponse> => {
    try {
        const response = await serverFetch.delete(`/host/${hostId}`);

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to delete host");
        }

        return {
            success: true,
            message: result.message || "Host deleted successfully",
        };
    } catch (error: any) {
        console.error("Error deleting host:", error);
        throw new Error(error.message || "Failed to delete host");
    }
};

export interface UpdateHostStatusResponse {
    success: boolean;
    message: string;
}

export const updateHostStatus = async (hostId: string, isDeleted: boolean): Promise<UpdateHostStatusResponse> => {
    try {
        const response = await serverFetch.patch(`/host/${hostId}/status`, {
            body: JSON.stringify({ isDeleted }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to update host status");
        }

        return {
            success: true,
            message: result.message || "Host status updated successfully",
        };
    } catch (error: any) {
        console.error("Error updating host status:", error);
        throw new Error(error.message || "Failed to update host status");
    }
};

