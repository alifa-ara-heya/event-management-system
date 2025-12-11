"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateProfileValidationZodSchema } from "@/zod/user.validation";

export const updateMyProfile = async (_currentState: any, formData: FormData): Promise<any> => {
    try {
        // Extract form data
        const name = formData.get("name")?.toString();
        const bio = formData.get("bio")?.toString();
        const location = formData.get("location")?.toString();
        const contactNumber = formData.get("contactNumber")?.toString();
        const interestsStr = formData.get("interests")?.toString();

        let interests: string[] = [];
        if (interestsStr) {
            try {
                interests = JSON.parse(interestsStr);
            } catch (e) {
                console.error("Error parsing interests:", e);
            }
        }

        const payload: any = {};
        if (name !== undefined && name !== null) payload.name = name;
        if (bio !== undefined && bio !== null) payload.bio = bio;
        if (location !== undefined && location !== null) payload.location = location;
        if (contactNumber !== undefined && contactNumber !== null) payload.contactNumber = contactNumber;
        if (interests.length > 0) payload.interests = interests;

        // Validate payload
        const validationResult = zodValidator(payload, updateProfileValidationZodSchema);
        if (validationResult.success === false) {
            return validationResult;
        }

        // Create FormData for multipart/form-data
        const updateFormData = new FormData();

        // Add file if present
        const file = formData.get("file");
        if (file instanceof File && file.size > 0) {
            updateFormData.append("file", file);
        }

        // Add JSON data
        updateFormData.append("data", JSON.stringify(validationResult.data));

        console.log("📝 Updating profile with:", validationResult.data);
        if (file instanceof File) {
            console.log("📸 File included:", { name: file.name, size: file.size });
        }

        const response = await serverFetch.patch("/user/update-my-profile", {
            body: updateFormData,
            // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
        });

        const result = await response.json();

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to update profile",
            };
        }

        console.log("✅ Profile updated successfully:", result.data);

        return {
            success: true,
            message: result.message || "Profile updated successfully",
            data: result.data,
        };
    } catch (error: any) {
        console.error("❌ Profile update error:", error);
        return {
            success: false,
            message: error.message || "Failed to update profile. Please try again.",
        };
    }
};

