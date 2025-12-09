import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { UserValidation } from "./user.validation";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

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

// Create admin
router.post(
    "/create-admin",
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

export const userRoutes = router;

