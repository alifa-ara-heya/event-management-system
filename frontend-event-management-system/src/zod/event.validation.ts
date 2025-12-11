import { z } from "zod";

const EventTypeEnum = z.enum([
    "CONCERT",
    "HIKE",
    "DINNER",
    "GAMING",
    "SPORTS",
    "ART",
    "TECH_MEETUP",
    "OTHER",
]);

const EventStatusEnum = z.enum(["OPEN", "FULL", "CANCELLED", "COMPLETED"]);

export const createEventValidationZodSchema = z.object({
    name: z.string().min(1, "Event name is required"),
    type: EventTypeEnum,
    description: z.string().optional(),
    date: z.string().min(1, "Event date is required"),
    location: z.string().min(1, "Location is required"),
    minParticipants: z.number().int().min(1, "Minimum participants must be at least 1").optional().default(1),
    maxParticipants: z.number().int().min(1, "Maximum participants must be at least 1"),
    joiningFee: z.number().min(0, "Joining fee cannot be negative").optional().default(0),
    status: EventStatusEnum.optional().default("OPEN"),
});

export const updateEventValidationZodSchema = z.object({
    name: z.string().min(1, "Event name cannot be empty").optional(),
    type: EventTypeEnum.optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    location: z.string().min(1, "Location cannot be empty").optional(),
    minParticipants: z.number().int().min(1).optional(),
    maxParticipants: z.number().int().min(1).optional(),
    joiningFee: z.number().min(0).optional(),
    status: EventStatusEnum.optional(),
});

export const updateEventStatusValidationZodSchema = z.object({
    status: EventStatusEnum,
});

