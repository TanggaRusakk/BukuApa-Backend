import { z, ZodType } from "zod";

export class BorrowingValidation {
    static readonly CREATE = z.object({
        bookId: z.number().positive("Book ID must be a positive number")
    });
}