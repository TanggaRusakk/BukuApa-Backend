import { z, ZodType } from "zod"

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        name: z
            .string({
                error: "Name must be string!",
            })
            .trim()
            .min(1, "Name can not be empty!")
            .max(100, "Name must be at most 100 characters!"),
        email: z
            .string({
                error: "Email must be string!",
            })
            .trim()
            .min(1, "Email can not be empty!")
            .max(255, "Email must be at most 255 characters!")
            .email("Email format is invalid!"),
        password: z
            .string({
                error: "Password must be string!",
            })
            .min(8, "Password must contain at least 8 characters!")
            .max(128, "Password must be at most 128 characters!")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number!"
            ),
    })

    static readonly LOGIN: ZodType = z.object({
        email: z
            .string({
                error: "Email must be string!",
            })
            .trim()
            .min(1, "Email can not be empty!")
            .email("Email format is invalid!"),
        password: z
            .string({
                error: "Password must be string!",
            })
            .min(1, "Password can not be empty!"),
    })
}