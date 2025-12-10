import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { UserValidation } from "./user.validation";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { auth } from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Create a new user
router.post(
    "/",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the JSON data from form-data
            if (req.body.data) {
                const parsedData = JSON.parse(req.body.data);
                req.body = parsedData;
            }
            // Validate the parsed data
            req.body = UserValidation.createUserValidationSchema.parse(req.body);
            return UserController.createUser(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Create admin (Admin only)
router.post(
    "/create-admin",
    auth(UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the JSON data from form-data
            if (req.body.data) {
                const parsedData = JSON.parse(req.body.data);
                req.body = parsedData;
            }
            // Validate the parsed data
            req.body = UserValidation.createAdminValidationSchema.parse(req.body);
            return UserController.createAdmin(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Create host
router.post(
    "/create-host",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the JSON data from form-data
            if (req.body.data) {
                const parsedData = JSON.parse(req.body.data);
                req.body = parsedData;
            }
            // Validate the parsed data
            req.body = UserValidation.createHostValidationSchema.parse(req.body);
            return UserController.createHost(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Get my profile
router.get(
    '/me',
    auth(UserRole.ADMIN, UserRole.HOST, UserRole.USER),
    UserController.getMyProfile
);

// Update my profile
router.patch(
    "/update-my-profile",
    auth(UserRole.ADMIN, UserRole.HOST, UserRole.USER),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the JSON data from form-data (if sent as form-data)
            if (req.body.data) {
                const parsedData = JSON.parse(req.body.data);
                req.body = parsedData;
            }
            // If sent as JSON, req.body is already parsed by express.json() middleware
            // Validate the parsed data
            req.body = UserValidation.updateMyProfileValidationSchema.parse(req.body);
            return UserController.updateMyProfile(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Get all users (Admin only)
router.get(
    '/',
    auth(UserRole.ADMIN),
    UserController.getAllUsers
);

// Delete user (Admin only) - Soft delete
router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    UserController.deleteUser
);

// Change user status (Admin only)
router.patch(
    '/:id/status',
    auth(UserRole.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body
            req.body = UserValidation.changeUserStatusValidationSchema.parse(req.body);
            return UserController.changeUserStatus(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

export const userRoutes = router;

