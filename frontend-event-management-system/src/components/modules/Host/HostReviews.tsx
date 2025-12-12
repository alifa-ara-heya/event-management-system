"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, Users, DollarSign, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

interface HostReviewsProps {
    hostId: string;
}

export function HostReviews({ hostId }: HostReviewsProps) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/review/host/${hostId}`, {
                    credentials: "include",
                    cache: "no-store",
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        let reviewsData = [];
                        if (Array.isArray(data.data)) {
                            reviewsData = data.data;
                        } else if (data.data.data && Array.isArray(data.data.data)) {
                            reviewsData = data.data.data;
                        }
                        setReviews(reviewsData);
                    }
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [hostId]);

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

    if (reviews.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>No reviews yet</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-4 rounded-lg border">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-10 w-10 shrink-0">
                                    <AvatarImage
                                        src={review.reviewer?.profilePhoto || ""}
                                        alt={review.reviewer?.email || "Reviewer"}
                                    />
                                    <AvatarFallback>
                                        {review.reviewer?.email?.charAt(0).toUpperCase() || "R"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium text-sm">
                                            {review.reviewer?.email || "Anonymous"}
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
            </CardContent>
        </Card>
    );
}

