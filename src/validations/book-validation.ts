import { z } from "zod";

export class BookValidation {
    static readonly CREATE = z.object({
        isbn: z.string().min(1, "ISBN tidak boleh kosong"),
        title: z.string().min(1, "Judul buku tidak boleh kosong"),
        author: z.string().min(1, "Nama penulis tidak boleh kosong"),
        publisher: z.string().min(1, "Nama penerbit tidak boleh kosong"),
        publishedYear: z.number().int().min(1800).max(new Date().getFullYear(), "Tahun terbit tidak valid"),
        totalPages: z.number().int().positive("Jumlah halaman harus lebih dari 0"),
        stock: z.number().int().nonnegative("Stok minimal bernilai 0")
    });

    static readonly UPDATE = z.object({
        id: z.number().int().positive("ID buku tidak valid"),
        isbn: z.string().min(1).optional(),
        title: z.string().min(1).optional(),
        author: z.string().min(1).optional(),
        publisher: z.string().min(1).optional(),
        publishedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
        totalPages: z.number().int().positive().optional(),
        stock: z.number().int().nonnegative().optional()
    });
}