import z from "zod";

const createUserValidationSchema = z.object({
    password: z.string({
        error: "Password is required."
    }),
    email: z.email({
        error: "Email is required."
    }),
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
        location: z.string().optional()
    })
});

export const UserValidation = {
    createUserValidationSchema,
    createAdminValidationSchema,
    createHostValidationSchema
};

