"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface JoinEventButtonProps {
    eventId: string;
    isUpcoming: boolean;
    isFull: boolean;
    status: string;
    joiningFee: number;
}

export function JoinEventButton({ eventId, isUpcoming, isFull, status, joiningFee }: JoinEventButtonProps) {
    const router = useRouter();
    const [isJoining, setIsJoining] = useState(false);

    const handleJoinEvent = async () => {
        if (!isUpcoming || isFull || status !== "OPEN") {
            return;
        }

        setIsJoining(true);
        try {
            const response = await fetch("/api/payment/create-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ eventId }),
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Redirect to login if not authenticated
                    router.push(`/login?redirect=/events/${eventId}`);
                    return;
                }
                throw new Error(result.message || "Failed to join event");
            }

            // Backend wraps response in 'data' field
            const paymentData = result.data || result;

            if (result.success) {
                // If it's a free event, the backend directly adds the participant
                if (paymentData.message?.includes("free event") || result.message?.includes("free event")) {
                    toast.success("Successfully joined the event!");
                    router.refresh();
                } else if (paymentData.checkoutUrl) {
                    // For paid events, redirect to Stripe checkout
                    console.log("Redirecting to checkout:", paymentData.checkoutUrl);
                    window.location.href = paymentData.checkoutUrl;
                } else {
                    console.error("No checkoutUrl in response:", { result, paymentData });
                    toast.error("Failed to get checkout URL. Please try again.");
                }
            } else {
                throw new Error(result.message || "Failed to join event");
            }
        } catch (error: any) {
            console.error("Error joining event:", error);
            toast.error(error.message || "Failed to join event. Please try again.");
        } finally {
            setIsJoining(false);
        }
    };

    // Don't show button if event is not available
    if (!isUpcoming || isFull || status !== "OPEN") {
        if (isFull) {
            return (
                <div className="w-full p-4 rounded-lg border bg-muted/50">
                    <p className="text-sm text-muted-foreground text-center">
                        This event is full
                    </p>
                </div>
            );
        }
        return null;
    }

    return (
        <Button
            className="w-full"
            size="lg"
            onClick={handleJoinEvent}
            disabled={isJoining}
        >
            {isJoining ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : joiningFee > 0 ? (
                `Join Event - $${joiningFee.toFixed(2)}`
            ) : (
                "Join Event (Free)"
            )}
        </Button>
    );
}

