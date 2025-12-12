"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface ApproveHostRequestResponse {
    success: boolean;
    message: string;
}

export const approveHostRequest = async (requestId: string): Promise<ApproveHostRequestResponse> => {
    try {
        const response = await serverFetch.patch(`/host/requests/${requestId}/approve`, {
            body: JSON.stringify({}),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to approve host request");
        }

        return {
            success: true,
            message: result.message || "Host request approved successfully",
        };
    } catch (error: any) {
        console.error("Error approving host request:", error);
        throw new Error(error.message || "Failed to approve host request");
    }
};

export interface RejectHostRequestResponse {
    success: boolean;
    message: string;
}

export const rejectHostRequest = async (requestId: string, rejectionReason: string): Promise<RejectHostRequestResponse> => {
    try {
        const response = await serverFetch.patch(`/host/requests/${requestId}/reject`, {
            body: JSON.stringify({ rejectionReason }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to reject host request");
        }

        return {
            success: true,
            message: result.message || "Host request rejected successfully",
        };
    } catch (error: any) {
        console.error("Error rejecting host request:", error);
        throw new Error(error.message || "Failed to reject host request");
    }
};

