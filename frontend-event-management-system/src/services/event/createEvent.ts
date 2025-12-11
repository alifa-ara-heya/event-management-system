"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createEventValidationZodSchema } from "@/zod/event.validation";

export interface CreateEventResponse {
    success: boolean;
    message: string;
    redirectTo?: string;
    data?: any;
}

export const createEvent = async (_currentState: any, formData: FormData): Promise<CreateEventResponse> => {
    try {
        // Extract form data
        const name = formData.get("name") as string;
        const type = formData.get("type") as string;
        const description = formData.get("description") as string;
        const date = formData.get("date") as string;
        const location = formData.get("location") as string;
        const minParticipants = formData.get("minParticipants") ? parseInt(formData.get("minParticipants") as string) : 1;
        const maxParticipants = parseInt(formData.get("maxParticipants") as string);
        const joiningFee = formData.get("joiningFee") ? parseFloat(formData.get("joiningFee") as string) : 0;
        const status = formData.get("status") as string || "OPEN";
        const file = formData.get("file") as File | null;

        // Prepare payload
        const payload = {
            name,
            type,
            description: description || undefined,
            date,
            location,
            minParticipants,
            maxParticipants,
            joiningFee,
            status,
        };

        // Validate payload
        const validationResult = zodValidator(payload, createEventValidationZodSchema);
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
            console.log("📸 Appending file to FormData:", {
                name: file.name,
                size: file.size,
                type: file.type,
            });
        }

        console.log("🚀 Creating event with payload:", payload);

        const response = await serverFetch.post("/event/", {
            body: uploadFormData,
        });

        const result = await response.json();

        console.log("📥 Create event response:", result);

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to create event",
            };
        }

        console.log("✅ Event created successfully:", result.data);

        // Return redirect path instead of redirecting directly
        return {
            success: true,
            message: "Event created successfully!",
            redirectTo: `/events/${result.data.id}`,
            data: result.data,
        };
    } catch (error: any) {
        console.error("❌ Error creating event:", error);

        return {
            success: false,
            message: error.message || "An error occurred while creating the event",
        };
    }
};

