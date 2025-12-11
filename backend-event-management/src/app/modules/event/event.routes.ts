import express, { NextFunction, Request, Response } from "express";
import { EventController } from "./event.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { EventValidation } from "./event.validation";
import { auth } from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const router = express.Router();

// Create event (Host only)
router.post(
    "/",
    auth(UserRole.HOST),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the JSON data from form-data if present
            if (req.body && req.body.data) {
                const parsedData = JSON.parse(req.body.data);
                req.body = { ...parsedData };
            } else if (!req.body || Object.keys(req.body).length === 0) {
                return next(new ApiError(httpStatus.BAD_REQUEST, "Request body is required."));
            }
            // Validate the parsed data
            req.body = EventValidation.createEventValidationSchema.parse(req.body);
            return EventController.createEvent(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Get all events (Public - with search, filters, pagination)
router.get(
    "/",
    EventController.getAllEvents
);

// Get event by ID (Public)
router.get(
    "/:id",
    EventController.getEventById
);

// Get my events (Host only)
router.get(
    "/my/events",
    auth(UserRole.HOST),
    EventController.getMyEvents
);

// Update event (Host only - own events)
router.patch(
    "/:id",
    auth(UserRole.HOST),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the JSON data from form-data if present
            if (req.body && req.body.data) {
                const parsedData = JSON.parse(req.body.data);
                req.body = { ...parsedData };
            }
            // Validate the parsed data
            req.body = EventValidation.updateEventValidationSchema.parse(req.body);
            return EventController.updateEvent(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Update event status (Host only - own events)
router.patch(
    "/:id/status",
    auth(UserRole.HOST),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = EventValidation.updateEventStatusValidationSchema.parse(req.body);
            return EventController.updateEventStatus(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Delete event (Host only - own events, soft delete)
router.delete(
    "/:id",
    auth(UserRole.HOST),
    EventController.deleteEvent
);

export const eventRoutes = router;

