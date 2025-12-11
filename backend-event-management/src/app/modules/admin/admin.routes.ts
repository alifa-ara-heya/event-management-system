import express, { NextFunction, Request, Response } from "express";
import { AdminController } from "./admin.controller";
import { auth } from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { EventValidation } from "../event/event.validation";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const router = express.Router();

// All admin routes require ADMIN role
router.use(auth(UserRole.ADMIN));

// Dashboard statistics
router.get(
    "/dashboard/stats",
    AdminController.getDashboardStats
);

// Event management
router.get(
    "/events",
    AdminController.getAllEvents
);

router.patch(
    "/events/:id",
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = EventValidation.updateEventValidationSchema.parse(req.body);
            return AdminController.updateEvent(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

router.patch(
    "/events/:id/status",
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = EventValidation.updateEventStatusValidationSchema.parse(req.body);
            return AdminController.updateEventStatus(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

router.delete(
    "/events/:id",
    AdminController.deleteEvent
);

// Statistics endpoints
router.get(
    "/statistics/events",
    AdminController.getEventStatistics
);

router.get(
    "/statistics/users",
    AdminController.getUserStatistics
);

router.get(
    "/statistics/hosts",
    AdminController.getHostStatistics
);

export const adminRoutes = router;

