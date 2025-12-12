import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/server-fetch";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventId, rating, comment } = body;

        if (!eventId || !rating) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event ID and rating are required",
                },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Rating must be between 1 and 5",
                },
                { status: 400 }
            );
        }

        const response = await serverFetch.post("/review", {
            body: JSON.stringify({
                eventId,
                rating: Number(rating),
                comment: comment || undefined,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.message || "Failed to create review",
                },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Review created successfully",
            data: result.data,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Failed to create review",
            },
            { status: 500 }
        );
    }
}

