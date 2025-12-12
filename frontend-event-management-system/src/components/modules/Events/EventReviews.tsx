"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    reviewer: {
        id: string;
        email: string;
        name: string | null;
        profilePhoto: string | null;
    };
}

interface EventReviewsProps {
    eventId: string;
    currentUserEmail?: string | null;
}

export function EventReviews({ eventId, currentUserEmail }: EventReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/review/event/${eventId}`, {
                    credentials: "include",
                    cache: "no-store",
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        // Handle response structure: { meta: {...}, data: [...] }
                        let reviewsData = [];
                        if (Array.isArray(data.data)) {
                            reviewsData = data.data;
                        } else if (data.data.data && Array.isArray(data.data.data)) {
                            reviewsData = data.data.data;
                        }
                        setReviews(reviewsData);
                    }
                } else {
                    setError("Failed to load reviews");
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setError("Failed to load reviews");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [eventId]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>Loading reviews...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return null;
    }

    // Separate user's review from other reviews
    const userReview = currentUserEmail
        ? reviews.find((r) => r.reviewer?.email === currentUserEmail)
        : null;
    const otherReviews = currentUserEmail
        ? reviews.filter((r) => r.reviewer?.email !== currentUserEmail)
        : reviews;

    if (reviews.length === 0 && !userReview) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* User's Review */}
                {userReview && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <h3 className="font-semibold text-lg">Your Review</h3>
                        </div>
                        <div className="p-4 rounded-lg border bg-muted/50">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-10 w-10 shrink-0">
                                    <AvatarImage
                                        src={userReview.reviewer.profilePhoto || ""}
                                        alt={userReview.reviewer.name || userReview.reviewer.email}
                                    />
                                    <AvatarFallback>
                                        {userReview.reviewer.name?.charAt(0).toUpperCase() ||
                                            userReview.reviewer.email.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">
                                            {userReview.reviewer.name || userReview.reviewer.email}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${
                                                        star <= userReview.rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(userReview.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {userReview.comment && (
                                        <p className="text-sm text-foreground">{userReview.comment}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Reviews */}
                {otherReviews.length > 0 && (
                    <div className="space-y-4">
                        {userReview && (
                            <div className="flex items-center gap-2 pb-2 border-b">
                                <h3 className="font-semibold text-lg">Other Reviews</h3>
                            </div>
                        )}
                        <div className="space-y-4">
                            {otherReviews.map((review) => (
                                <div key={review.id} className="p-4 rounded-lg border">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10 shrink-0">
                                            <AvatarImage
                                                src={review.reviewer.profilePhoto || ""}
                                                alt={review.reviewer.name || review.reviewer.email}
                                            />
                                            <AvatarFallback>
                                                {review.reviewer.name?.charAt(0).toUpperCase() ||
                                                    review.reviewer.email.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-medium">
                                                    {review.reviewer.name || review.reviewer.email}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-4 w-4 ${
                                                                star <= review.rating
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <p className="text-sm text-foreground">{review.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

