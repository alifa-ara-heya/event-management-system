import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPaymentIntent } from "@/services/payment/createPaymentIntent";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Authentication required. Please log in to join events." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { eventId } = body;

        if (!eventId) {
            return NextResponse.json(
                { success: false, message: "Event ID is required" },
                { status: 400 }
            );
        }

        const result = await createPaymentIntent(eventId);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

