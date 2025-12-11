import { z } from "zod";

export const updateProfileValidationZodSchema = z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    contactNumber: z.string().optional(),
    interests: z.array(z.string()).optional(),
});

