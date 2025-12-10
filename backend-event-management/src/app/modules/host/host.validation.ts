import z from "zod";
import { HostRequestStatus } from "@prisma/client";

const submitHostRequestValidationSchema = z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional()
});

const rejectHostRequestValidationSchema = z.object({
    rejectionReason: z.string().optional()
});

const updateHostStatusValidationSchema = z.object({
    isDeleted: z.boolean({
        error: "isDeleted is required."
    })
});

export const HostValidation = {
    submitHostRequestValidationSchema,
    rejectHostRequestValidationSchema,
    updateHostStatusValidationSchema
};

