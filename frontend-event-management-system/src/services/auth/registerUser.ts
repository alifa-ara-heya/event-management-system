/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { registerUserValidationZodSchema } from "@/zod/auth.validation";

export const registerUser = async (_currentState: any, formData: FormData): Promise<any> => {
    try {
        console.log("📝 Starting registration process...");

        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            bio: formData.get('bio') || undefined,
            location: formData.get('location') || undefined,
            interests: formData.get('interests') ? JSON.parse(formData.get('interests') as string) : undefined,
        }

        console.log("✅ Form data extracted:", {
            name: payload.name,
            email: payload.email,
            hasBio: !!payload.bio,
            hasLocation: !!payload.location,
            interestsCount: payload.interests?.length || 0
        });

        const validationResult = zodValidator(payload, registerUserValidationZodSchema);

        if (validationResult.success === false) {
            console.error("❌ Validation failed:", validationResult.errors);
            return validationResult;
        }

        console.log("✅ Validation passed");

        const validatedPayload: any = validationResult.data;

        // Prepare data for backend (matches backend validation schema)
        const registerData = {
            email: validatedPayload.email,
            password: validatedPayload.password,
            name: validatedPayload.name,
            bio: validatedPayload.bio,
            location: validatedPayload.location,
            interests: validatedPayload.interests || [],
        }

        const newFormData = new FormData();
        newFormData.append("data", JSON.stringify(registerData));

        // Handle profile photo upload if provided
        const file = formData.get("file");
        console.log("🔍 File check:", {
            hasFile: !!file,
            fileType: file?.constructor?.name,
            isFile: file instanceof File,
            size: file instanceof File ? file.size : 'N/A',
            name: file instanceof File ? file.name : 'N/A'
        });

        if (file && file instanceof File && file.size > 0) {
            console.log("📸 Profile photo found:", {
                name: file.name,
                size: file.size,
                type: file.type
            });
            newFormData.append("file", file);
        } else {
            console.log("ℹ️ No profile photo provided or file is empty");
            if (file) {
                console.log("⚠️ File exists but is invalid:", file);
            }
        }

        console.log("🚀 Sending registration request to backend...");
        const res = await serverFetch.post("/user", {
            body: newFormData,
        })

        const result = await res.json();
        console.log("📥 Backend response received:", result);

        if (result.success) {
            console.log("✅ Registration successful!");
            console.log("📋 Backend success message:", result.message || "User created successfully");
            console.log("📊 Response data:", result.data);
            // Return success state so client can show toast before redirecting
            return {
                ...result,
                redirectTo: "/login?registered=true"
            };
        } else {
            console.error("❌ Registration failed:", result.message);
        }

        return result;

    } catch (error: any) {
        // Re-throw NEXT_REDIRECT errors so Next.js can handle them
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.log(error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : "Registration Failed. Please try again."}`
        };
    }
}

