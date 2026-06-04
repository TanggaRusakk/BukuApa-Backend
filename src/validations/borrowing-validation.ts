import { z } from "zod";

export class BorrowingValidation {
    // FIX: Hapus ": ZodType" biar TypeScript bisa ngebaca isinya secara otomatis
    static readonly CREATE = z.object({
        bookId: z.number().positive("Book ID must be a positive number"),
        userId: z.number().positive("User ID must be a positive number").optional()
    });
}