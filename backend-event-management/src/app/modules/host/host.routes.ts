import express, { NextFunction, Request, Response } from "express";
import { HostController } from "./host.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { HostValidation } from "./host.validation";
import { auth } from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const router = express.Router();

// Submit host request (User only)
router.post(
    "/request",
    auth(UserRole.USER),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the JSON data from form-data if present
            if (req.body && req.body.data) {
                const parsedData = JSON.parse(req.body.data);
                req.body = { ...parsedData };
            } else if (!req.body || Object.keys(req.body).length === 0) {
                // If no body, initialize empty object
                req.body = {};
            }
            // Validate the parsed data (all fields are optional)
            req.body = HostValidation.submitHostRequestValidationSchema.parse(req.body);
            return HostController.submitHostRequest(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Get all host requests (Admin only)
router.get(
    "/requests",
    auth(UserRole.ADMIN),
    HostController.getAllHostRequests
);

// Approve host request (Admin only)
router.patch(
    "/requests/:id/approve",
    auth(UserRole.ADMIN),
    HostController.approveHostRequest
);

// Reject host request (Admin only)
router.patch(
    "/requests/:id/reject",
    auth(UserRole.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = HostValidation.rejectHostRequestValidationSchema.parse(req.body);
            return HostController.rejectHostRequest(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Get my host statistics (Host only) - Must be before /:id route
router.get(
    "/my/stats",
    auth(UserRole.HOST),
    HostController.getMyHostStats
);

// Get all hosts (Admin only)
router.get(
    "/",
    auth(UserRole.ADMIN),
    HostController.getAllHosts
);

// Get host by ID (Public) - Must be last to avoid matching /requests or /my/stats
router.get(
    "/:id",
    HostController.getHostById
);

// Update host status (Admin only) - Must be before /:id route
router.patch(
    "/:id/status",
    auth(UserRole.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = HostValidation.updateHostStatusValidationSchema.parse(req.body);
            return HostController.updateHostStatus(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Delete host (Admin only) - Must be before /:id route
router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    HostController.deleteHost
);

export const hostRoutes = router;

