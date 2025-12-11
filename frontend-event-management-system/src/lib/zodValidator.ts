import { ZodObject, ZodTypeAny } from "zod"

export const zodValidator = <T>(payload: T, schema: ZodObject<any> | ZodTypeAny) => {
    const validatedPayload = schema.safeParse(payload)

    if (!validatedPayload.success) {
        return {
            success: false,
            errors: validatedPayload.error.issues.map(issue => {
                return {
                    field: issue.path[0] as string,
                    message: issue.message,
                }
            })
        }
    }

    return {
        success: true,
        data: validatedPayload.data,
    };
}

