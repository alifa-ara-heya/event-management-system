import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/server-fetch";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;

        if (!sessionId) {
            return NextResponse.json(
                { success: false, message: "Session ID is required" },
                { status: 400 }
            );
        }

        const response = await serverFetch.get(`/payment/session/${sessionId}`);

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { success: false, message: error.message || "Failed to fetch payment" },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error fetching payment by session ID:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

