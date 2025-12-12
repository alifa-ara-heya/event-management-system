"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface SubmitHostRequestResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const submitHostRequest = async (formData: FormData): Promise<SubmitHostRequestResponse> => {
    try {
        // Extract form data
        const name = formData.get("name") as string;
        const contactNumber = formData.get("contactNumber") as string;
        const bio = formData.get("bio") as string;
        const location = formData.get("location") as string;
        const file = formData.get("file") as File | null;

        // Prepare payload (only include fields that are provided)
        const payload: any = {};
        if (name) payload.name = name;
        if (contactNumber) payload.contactNumber = contactNumber;
        if (bio) payload.bio = bio;
        if (location) payload.location = location;

        // Create FormData for file upload
        const uploadFormData = new FormData();
        uploadFormData.append("data", JSON.stringify(payload));

        // Only append file if it's a valid File object with size > 0
        if (file && file instanceof File && file.size > 0) {
            uploadFormData.append("file", file);
        }

        const response = await serverFetch.post("/host/request", {
            body: uploadFormData,
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to submit host request");
        }

        return {
            success: true,
            message: result.message || "Host request submitted successfully",
            data: result.data,
        };
    } catch (error: any) {
        console.error("Error submitting host request:", error);
        throw new Error(error.message || "Failed to submit host request");
    }
};

