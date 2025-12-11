"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateEventValidationZodSchema, updateEventStatusValidationZodSchema } from "@/zod/event.validation";

export interface UpdateEventResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const updateEvent = async (eventId: string, formData: FormData): Promise<UpdateEventResponse> => {
    try {
        // Extract form data
        const name = formData.get("name") as string;
        const type = formData.get("type") as string;
        const description = formData.get("description") as string;
        const date = formData.get("date") as string;
        const location = formData.get("location") as string;
        const minParticipants = formData.get("minParticipants") ? parseInt(formData.get("minParticipants") as string) : undefined;
        const maxParticipants = formData.get("maxParticipants") ? parseInt(formData.get("maxParticipants") as string) : undefined;
        const joiningFee = formData.get("joiningFee") ? parseFloat(formData.get("joiningFee") as string) : undefined;
        const file = formData.get("file") as File | null;

        // Prepare payload (only include fields that are provided)
        const payload: any = {};
        if (name) payload.name = name;
        if (type) payload.type = type;
        if (description !== null) payload.description = description || undefined;
        if (date) payload.date = date;
        if (location) payload.location = location;
        if (minParticipants !== undefined) payload.minParticipants = minParticipants;
        if (maxParticipants !== undefined) payload.maxParticipants = maxParticipants;
        if (joiningFee !== undefined) payload.joiningFee = joiningFee;

        // Validate payload
        const validationResult = zodValidator(payload, updateEventValidationZodSchema);
        if (!validationResult.success) {
            const errorMessage = validationResult.errors?.[0]?.message || "Validation failed";
            return {
                success: false,
                message: errorMessage,
            };
        }

        // Use validated data
        const validatedPayload = validationResult.data;

        // Create FormData for file upload
        const uploadFormData = new FormData();
        uploadFormData.append("data", JSON.stringify(validatedPayload));

        // Only append file if it's a valid File object with size > 0
        if (file && file instanceof File && file.size > 0) {
            uploadFormData.append("file", file);
        }

        const response = await serverFetch.patch(`/event/${eventId}`, {
            body: uploadFormData,
        });

        const result = await response.json();

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update event",
            };
        }

        return {
            success: true,
            message: "Event updated successfully!",
            data: result.data,
        };
    } catch (error: any) {
        console.error("❌ Error updating event:", error);
        return {
            success: false,
            message: error.message || "An error occurred while updating the event",
        };
    }
};

export const updateEventStatus = async (eventId: string, status: string): Promise<UpdateEventResponse> => {
    try {
        const payload = { status };

        // Validate payload
        const validationResult = zodValidator(payload, updateEventStatusValidationZodSchema);
        if (!validationResult.success) {
            const errorMessage = validationResult.errors?.[0]?.message || "Validation failed";
            return {
                success: false,
                message: errorMessage,
            };
        }

        const response = await serverFetch.patch(`/event/${eventId}/status`, {
            body: JSON.stringify(validationResult.data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update event status",
            };
        }

        return {
            success: true,
            message: "Event status updated successfully!",
            data: result.data,
        };
    } catch (error: any) {
        console.error("❌ Error updating event status:", error);
        return {
            success: false,
            message: error.message || "An error occurred while updating the event status",
        };
    }
};

export const deleteEvent = async (eventId: string): Promise<UpdateEventResponse> => {
    try {
        const response = await serverFetch.delete(`/event/${eventId}`);

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
            data: result.data,
        };
    } catch (error: any) {
        console.error("❌ Error deleting event:", error);
        return {
            success: false,
            message: error.message || "An error occurred while deleting the event",
        };
    }
};

