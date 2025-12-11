import z from "zod";
import { PaymentStatus } from "@prisma/client";

const createPaymentIntentValidationSchema = z.object({
    eventId: z.string({
        error: "Event ID is required."
    }).min(1, "Event ID cannot be empty")
});

const PaymentStatusEnum = z.enum(Object.values(PaymentStatus) as [string, ...string[]], {
    error: "Status must be PAID or UNPAID."
});

export const PaymentValidation = {
    createPaymentIntentValidationSchema
};

