"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
    eventId: string;
    eventDate: string;
    onReviewSubmitted?: () => void;
}

export function ReviewForm({ eventId, eventDate, onReviewSubmitted }: ReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        if (rating < 1 || rating > 5) {
            toast.error("Rating must be between 1 and 5");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    eventId,
                    rating,
                    comment: comment.trim() || undefined,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to submit review");
            }

            if (result.success) {
                toast.success("Review submitted successfully!");
                setRating(0);
                setComment("");
                
                if (onReviewSubmitted) {
                    onReviewSubmitted();
                } else {
                    router.refresh();
                }
            } else {
                throw new Error(result.message || "Failed to submit review");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isEventPast = new Date(eventDate) < new Date();

    if (!isEventPast) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Write a Review</CardTitle>
                <CardDescription>
                    Share your experience attending this event
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating */}
                    <div className="space-y-2">
                        <Label htmlFor="rating">Rating *</Label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded"
                                    disabled={isSubmitting}
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${
                                            star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                    {rating} {rating === 1 ? "star" : "stars"}
                                </span>
                            )}
                        </div>
                        <input
                            type="hidden"
                            name="rating"
                            value={rating}
                            required
                        />
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Comment (Optional)</Label>
                        <Textarea
                            id="comment"
                            name="comment"
                            placeholder="Share your thoughts about the event..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSubmitting}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Review"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

