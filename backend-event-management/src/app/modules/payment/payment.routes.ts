import express, { NextFunction, Request, Response } from "express";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";
import { auth } from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const router = express.Router();

// Create payment intent / checkout session (User only)
router.post(
    "/create-intent",
    auth(UserRole.USER),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = PaymentValidation.createPaymentIntentValidationSchema.parse(req.body);
            return PaymentController.createPaymentIntent(req, res, next);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.issues[0]?.message || 'Validation failed'));
            }
            return next(error);
        }
    }
);

// Get payment by ID (User only - own payments)
router.get(
    "/:id",
    auth(UserRole.USER),
    PaymentController.getPaymentById
);

// Get my payments (User only)
router.get(
    "/my/payments",
    auth(UserRole.USER),
    PaymentController.getMyPayments
);

// Cancel unpaid payment (User only - own payments)
router.delete(
    "/:id",
    auth(UserRole.USER),
    PaymentController.cancelPayment
);

export const paymentRoutes = router;

