import { z } from "zod";

export class ReviewValidation {
    static readonly CREATE = z.object({
        bookId: z.number().int().positive("ID buku tidak valid"),
        rating: z.number()
        .int()
        .min(1, "Rating minimal 1")
        .max(5, "Rating maksimal 5"),
        comment: z.string()
        .min(1, "Komentar ulasan tidak boleh kosong")
        .max(1000, "Komentar maksimal 1000 karakter")
    });

    static readonly UPDATE = z.object({
        rating: z.number()
        .int()
        .min(1)
        .max(5)
        .optional(),
        comment: z.string()
        .min(1)
        .max(1000)
        .optional()
    });
}