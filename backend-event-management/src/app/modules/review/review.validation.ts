import z from "zod";

const createReviewValidationSchema = z.object({
    eventId: z.string({
        error: "Event ID is required."
    }).min(1, "Event ID cannot be empty"),
    rating: z.number({
        error: "Rating is required."
    }).int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z.string().optional()
});

export const ReviewValidation = {
    createReviewValidationSchema
};

