"use server";

import { serverFetch } from "@/lib/server-fetch";
import { cookies } from "next/headers";

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
    participantAdded?: boolean;
}

export const verifyPaymentAndAddParticipant = async (sessionId: string): Promise<VerifyPaymentResponse> => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return {
            success: false,
            message: "Authentication required",
        };
    }

    try {
        const response = await serverFetch.post("/payment/verify-session", {
            body: JSON.stringify({ sessionId }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!result.success) {
            return {
                success: false,
                message: result.message || "Failed to verify payment",
            };
        }

        return {
            success: true,
            message: result.message || "Payment verified successfully",
            participantAdded: result.data?.participantAdded || false,
        };
    } catch (error: any) {
        console.error("Error verifying payment:", error);
        return {
            success: false,
            message: error.message || "Failed to verify payment",
        };
    }
};

