"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface CancelPaymentResponse {
    success: boolean;
    message: string;
}

export const cancelPayment = async (paymentId: string): Promise<CancelPaymentResponse> => {
    try {
        const response = await serverFetch.delete(`/payment/${paymentId}`);

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to cancel payment");
        }

        return {
            success: true,
            message: result.message || "Payment cancelled successfully",
        };
    } catch (error: any) {
        console.error("Error cancelling payment:", error);
        throw new Error(error.message || "Failed to cancel payment");
    }
};

