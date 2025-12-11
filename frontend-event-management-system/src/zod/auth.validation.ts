import { z } from "zod";

export const registerUserValidationZodSchema = z.object({
    name: z.string().min(1, "Name is required.").optional(),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(6, "Confirm password is required."),
    bio: z.string().optional(),
    location: z.string().optional(),
    interests: z.array(z.string()).optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
});

export const loginValidationZodSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(1, "Password is required."),
});
