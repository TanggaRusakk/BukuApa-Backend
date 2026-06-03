import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { ResponseError } from "../errors/response-error"

export const errorMiddleware = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));

        res.status(400).json({
            errors: "Validation error",
            details: formattedErrors,
        })
    } else if (error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message,
        })
    } else {
        res.status(500).json({
            errors: error.message,
        })
    }
}