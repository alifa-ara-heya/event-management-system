import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/server-fetch";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;
        const response = await serverFetch.get(`/review/event/${eventId}`, {
            next: { revalidate: 60 },
        });

        const result = await response.json();

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.message || "Failed to fetch reviews",
                },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to fetch reviews",
            },
            { status: 500 }
        );
    }
}


