"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface DeleteEventResponse {
    success: boolean;
    message: string;
}

export const deleteAdminEvent = async (eventId: string): Promise<DeleteEventResponse> => {
    try {
        const response = await serverFetch.delete(`/admin/events/${eventId}`);

        const result = await response.json();

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to delete event",
            };
        }

        return {
            success: true,
            message: "Event deleted successfully!",
        };
    } catch (error: any) {
        console.error("❌ Error deleting event:", error);
        return {
            success: false,
            message: error.message || "An error occurred while deleting the event",
        };
    }
};

