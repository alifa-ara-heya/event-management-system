"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface CreatePaymentIntentResponse {
    success: boolean;
    message: string;
    paymentId?: string;
    checkoutUrl?: string;
    sessionId?: string;
    participant?: any;
    event?: any;
}

export const createPaymentIntent = async (eventId: string): Promise<CreatePaymentIntentResponse> => {
    try {
        const response = await serverFetch.post("/payment/create-intent", {
            body: JSON.stringify({ eventId }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to create payment intent");
        }

        return result;
    } catch (error: any) {
        console.error("Error creating payment intent:", error);
        throw new Error(error.message || "Failed to create payment intent");
    }
};

