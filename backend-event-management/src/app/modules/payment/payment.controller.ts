import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../shared/sendResponse";
import { stripe } from "../../helpers/stripe";
import config from "../../../config";
import httpStatus from "http-status";

const createPaymentIntent = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { eventId } = req.body;
    const result = await PaymentService.createPaymentIntent(user, eventId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: result.message,
        data: result
    });
});

const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = config.webhookSecret as string;

    console.log("📥 Webhook received");
    console.log("Signature:", sig ? "Present" : "Missing");
    console.log("Webhook secret configured:", webhookSecret ? "Yes" : "No");

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        console.log("✅ Webhook verified. Event type:", event.type);
    } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        await PaymentService.handleStripeWebhookEvent(event);
        console.log("✅ Webhook processed successfully");
    } catch (error: any) {
        console.error("❌ Error processing webhook:", error);
        throw error;
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Webhook request processed successfully',
        data: null
    });
});

const getPaymentById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await PaymentService.getPaymentById(id, user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment retrieved successfully",
        data: result
    });
});

const getMyPayments = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page,
        limit,
        sortBy,
        sortOrder
    };

    const result = await PaymentService.getMyPayments(user, filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payments retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const cancelPayment = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await PaymentService.cancelPayment(user, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: result
    });
});

export const PaymentController = {
    createPaymentIntent,
    handleStripeWebhookEvent,
    getPaymentById,
    getMyPayments,
    cancelPayment
};

