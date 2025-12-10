import z from "zod";
import { UserStatus } from "@prisma/client";

const createUserValidationSchema = z.object({
    password: z.string({
        error: "Password is required."
    }),
    email: z.email({
        error: "Email is required."
    }),
    name: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    interests: z.array(z.string()).optional()
});

const createAdminValidationSchema = z.object({
    password: z.string({
        error: "Password is required."
    }),
    admin: z.object({
        name: z.string({
            error: "Name is required."
        }),
        email: z.email({
            error: "Email is required."
        }),
        contactNumber: z.string().optional()
    })
});

const createHostValidationSchema = z.object({
    password: z.string({
        error: "Password is required."
    }),
    host: z.object({
        name: z.string({
            error: "Name is required."
        }),
        email: z.email({
            error: "Email is required."
        }),
        contactNumber: z.string().optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        interests: z.array(z.string()).optional()
    })
});

const updateMyProfileValidationSchema = z.object({
    bio: z.string().optional(),
    location: z.string().optional(),
    interests: z.array(z.string()).optional(),
    name: z.string().optional(),
    contactNumber: z.string().optional()
});

const changeUserStatusValidationSchema = z.object({
    status: z.nativeEnum(UserStatus, {
        error: "Status must be ACTIVE, INACTIVE, or DELETED."
    })
});

export const UserValidation = {
    createUserValidationSchema,
    createAdminValidationSchema,
    createHostValidationSchema,
    updateMyProfileValidationSchema,
    changeUserStatusValidationSchema
};

