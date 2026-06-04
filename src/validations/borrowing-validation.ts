import { z } from "zod";

export class BorrowingValidation {
    static readonly CREATE = z.object({
        bookId: z.coerce.number({
            error: "Book ID harus berupa angka"
        }).int("Book ID harus bilangan bulat")
            .positive("Book ID must be a positive number")
    });
}