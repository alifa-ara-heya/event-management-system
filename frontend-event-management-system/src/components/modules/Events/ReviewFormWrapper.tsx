"use client";

import { useEffect, useState } from "react";
import { ReviewForm } from "@/components/modules/Events/ReviewForm";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ReviewFormWrapperProps {
    eventId: string;
    eventDate: string;
    participants: Array<{
        userId: string;
    }>;
}

export function ReviewFormWrapper({ eventId, eventDate, participants }: ReviewFormWrapperProps) {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<{
        email: string;
        role: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/me", {
                    credentials: "include",
                    cache: "no-store",
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        setUserInfo({
                            email: data.data.email,
                            role: data.data.role,
                        });
                    }
                }
            } catch (error) {
                console.error("Error checking auth:", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Check if user has already reviewed
    useEffect(() => {
        const checkExistingReview = async () => {
            if (!userInfo || userInfo.role !== "USER") {
                return;
            }

            try {
                const response = await fetch(`/api/review/event/${eventId}`, {
                    credentials: "include",
                    cache: "no-store",
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        let reviews = [];
                        if (Array.isArray(data.data)) {
                            reviews = data.data;
                        } else if (data.data.data && Array.isArray(data.data.data)) {
                            reviews = data.data.data;
                        }
                        
                        const userEmail = userInfo.email;
                        const hasUserReviewed = reviews.some(
                            (review: any) => {
                                const reviewerEmail = review.reviewer?.email || review.reviewerEmail;
                                return reviewerEmail === userEmail;
                            }
                        );
                        setHasReviewed(hasUserReviewed);
                    }
                }
            } catch (error) {
                console.error("Error checking existing review:", error);
            }
        };

        if (userInfo && !isLoading) {
            checkExistingReview();
        }
    }, [userInfo, eventId, isLoading]);

    // Show loading state while checking
    if (isLoading) {
        return null;
    }

    // Only show form if:
    // 1. User is logged in
    // 2. User is a USER role
    // 3. Event date has passed
    // 4. User is in participants list
    const isEventPast = new Date(eventDate) < new Date();
    const isUserParticipant = userInfo
        ? participants.some((p) => p.userId === userInfo.email)
        : false;
    
    const canReview =
        userInfo?.role === "USER" &&
        isEventPast &&
        isUserParticipant;

    if (!canReview) {
        return null;
    }

    // If user has already reviewed, show a message instead of the form
    if (hasReviewed) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Review Submitted
                    </CardTitle>
                    <CardDescription>
                        Thank you for your review! You can see it below.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <ReviewForm
            eventId={eventId}
            eventDate={eventDate}
            onReviewSubmitted={() => {
                setHasReviewed(true);
                router.refresh();
            }}
        />
    );
}

