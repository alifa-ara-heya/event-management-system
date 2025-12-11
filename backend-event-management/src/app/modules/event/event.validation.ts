import z from "zod";
import { EventType, EventStatus } from "@prisma/client";

const EventTypeEnum = z.enum(Object.values(EventType) as [string, ...string[]], {
    error: "Event type is required and must be a valid type."
});

const EventStatusEnum = z.enum(Object.values(EventStatus) as [string, ...string[]], {
    error: "Status must be OPEN, FULL, CANCELLED, or COMPLETED."
});

const createEventValidationSchema = z.object({
    name: z.string({
        error: "Event name is required."
    }).min(1, "Event name cannot be empty"),
    type: EventTypeEnum,
    description: z.string().optional(),
    date: z.string({
        error: "Event date is required."
    }).transform((str) => new Date(str)), // Convert string to Date
    location: z.string({
        error: "Location is required."
    }).min(1, "Location cannot be empty"),
    minParticipants: z.number({
        error: "Minimum participants is required."
    }).int().min(1, "Minimum participants must be at least 1").optional().default(1),
    maxParticipants: z.number({
        error: "Maximum participants is required."
    }).int().min(1, "Maximum participants must be at least 1"),
    joiningFee: z.number({
        error: "Joining fee must be a number."
    }).min(0, "Joining fee cannot be negative").optional().default(0),
    status: EventStatusEnum.optional().default("OPEN")
});

const updateEventValidationSchema = z.object({
    name: z.string().min(1, "Event name cannot be empty").optional(),
    type: EventTypeEnum.optional(),
    description: z.string().optional(),
    date: z.string().transform((str) => new Date(str)).optional(),
    location: z.string().min(1, "Location cannot be empty").optional(),
    minParticipants: z.number().int().min(1).optional(),
    maxParticipants: z.number().int().min(1).optional(),
    joiningFee: z.number().min(0).optional(),
    status: EventStatusEnum.optional()
});

const updateEventStatusValidationSchema = z.object({
    status: EventStatusEnum
});

export const EventValidation = {
    createEventValidationSchema,
    updateEventValidationSchema,
    updateEventStatusValidationSchema
};

