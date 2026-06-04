import { z } from "zod";

export class ReviewValidation {
    static readonly CREATE = z.object({
        bookId: z.coerce.number({
            error: "ID buku harus berupa angka"
        }).int("ID buku harus bilangan bulat")
            .positive("ID buku tidak valid"),
        rating: z.coerce.number({
            error: "Rating harus berupa angka"
        }).int("Rating harus bilangan bulat")
            .min(1, "Rating minimal 1")
            .max(5, "Rating maksimal 5"),
        comment: z.string({
            error: "Komentar harus berupa teks"
        }).trim()
            .min(1, "Komentar ulasan tidak boleh kosong")
            .max(1000, "Komentar maksimal 1000 karakter")
    });

    static readonly UPDATE = z.object({
        rating: z.coerce.number({
            error: "Rating harus berupa angka"
        }).int("Rating harus bilangan bulat")
            .min(1, "Rating minimal 1")
            .max(5, "Rating maksimal 5")
            .optional(),
        comment: z.string({
            error: "Komentar harus berupa teks"
        }).trim()
            .min(1, "Komentar ulasan tidak boleh kosong")
            .max(1000, "Komentar maksimal 1000 karakter")
            .optional()
    }).refine(
        (data) => data.rating !== undefined || data.comment !== undefined,
        { message: "Minimal satu field (rating atau comment) harus diisi untuk update" }
    );
}