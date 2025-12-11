import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/server-fetch";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get the FormData from the request
        const formData = await request.formData();
        
        // Extract the data JSON string
        const dataString = formData.get("data") as string;
        if (!dataString) {
            return NextResponse.json(
                { success: false, message: "Event data is required" },
                { status: 400 }
            );
        }

        // Parse the data
        const eventData = JSON.parse(dataString);
        
        // Create new FormData for backend
        const uploadFormData = new FormData();
        uploadFormData.append("data", JSON.stringify(eventData));
        
        // Get the file if present
        const file = formData.get("file") as File | null;
        if (file && file instanceof File && file.size > 0) {
            uploadFormData.append("file", file);
            console.log("📸 Appending file to FormData:", {
                name: file.name,
                size: file.size,
                type: file.type,
            });
        }

        console.log("🚀 Creating event via API route with payload:", eventData);

        // Forward to backend
        const response = await serverFetch.post("/event/", {
            body: uploadFormData,
        });

        const result = await response.json();

        console.log("📥 Create event response:", result);

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message || "Failed to create event" },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Event created successfully!",
            data: result.data,
        });
    } catch (error: any) {
        console.error("❌ Error creating event:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred while creating the event",
            },
            { status: 500 }
        );
    }
}

