import express, { NextFunction, Request, Response } from "express";
import { ReviewController } from "./review.controller";
import { ReviewValidation } from "./review.validation";
import { auth } from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const router = express.Router();

// Create review (User only - after attending event)
router.post(
    "/",
    auth(UserRole.USER),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = ReviewValidation.createReviewValidationSchema.parse(req.body);
            return ReviewController.insertIntoDB(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Get all reviews (Public - with filters)
router.get(
    "/",
    ReviewController.getAllFromDB
);

// Get reviews for a specific host (Public - includes all reviews for the host, including event-specific ones)
router.get(
    "/host/:hostId",
    ReviewController.getHostReviews
);

// Get reviews for a specific event (Public)
router.get(
    "/event/:eventId",
    ReviewController.getEventReviews
);

export const reviewRoutes = router;

