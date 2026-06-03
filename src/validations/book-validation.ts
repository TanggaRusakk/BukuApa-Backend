import { z } from "zod";

export class BookValidation {
    static readonly CREATE = z.object({
        isbn: z.string()
            .trim()
            .min(1, "ISBN tidak boleh kosong")
            .regex(/^(?:\d{10}|\d{13})$/, "ISBN harus berupa 10 atau 13 digit angka"),
        title: z.string()
            .trim()
            .min(1, "Judul buku tidak boleh kosong")
            .max(255, "Judul buku maksimal 255 karakter"),
        author: z.string()
            .trim()
            .min(1, "Nama penulis tidak boleh kosong")
            .max(255, "Nama penulis maksimal 255 karakter"),
        publisher: z.string()
            .trim()
            .min(1, "Nama penerbit tidak boleh kosong")
            .max(255, "Nama penerbit maksimal 255 karakter"),
        publishedYear: z.number({
            error: "Tahun terbit harus berupa angka"
        }).int("Tahun terbit harus bilangan bulat")
            .min(1800, "Tahun terbit minimal 1800")
            .max(new Date().getFullYear(), "Tahun terbit tidak valid"),
        totalPages: z.number({
            error: "Jumlah halaman harus berupa angka"
        }).int("Jumlah halaman harus bilangan bulat")
            .positive("Jumlah halaman harus lebih dari 0"),
        stock: z.number({
            error: "Jumlah stok harus berupa angka"
        }).int("Jumlah stok harus bilangan bulat")
            .nonnegative("Stok minimal bernilai 0"),
        categoryIds: z.array(
            z.number({
                error: "ID kategori harus berupa angka"
            }).int("ID kategori harus bilangan bulat")
                .positive("ID kategori tidak valid")
        ).optional()
    });

    static readonly UPDATE = z.object({
        id: z.number({
            error: "ID buku harus berupa angka"
        }).int("ID buku harus bilangan bulat")
            .positive("ID buku tidak valid"),
        isbn: z.string()
            .trim()
            .min(1, "ISBN tidak boleh kosong")
            .regex(/^(?:\d{10}|\d{13})$/, "ISBN harus berupa 10 atau 13 digit angka")
            .optional(),
        title: z.string()
            .trim()
            .min(1, "Judul buku tidak boleh kosong")
            .max(255, "Judul buku maksimal 255 karakter")
            .optional(),
        author: z.string()
            .trim()
            .min(1, "Nama penulis tidak boleh kosong")
            .max(255, "Nama penulis maksimal 255 karakter")
            .optional(),
        publisher: z.string()
            .trim()
            .min(1, "Nama penerbit tidak boleh kosong")
            .max(255, "Nama penerbit maksimal 255 karakter")
            .optional(),
        publishedYear: z.number({
            error: "Tahun terbit harus berupa angka"
        }).int("Tahun terbit harus bilangan bulat")
            .min(1800, "Tahun terbit minimal 1800")
            .max(new Date().getFullYear(), "Tahun terbit tidak valid")
            .optional(),
        totalPages: z.number({
            error: "Jumlah halaman harus berupa angka"
        }).int("Jumlah halaman harus bilangan bulat")
            .positive("Jumlah halaman harus lebih dari 0")
            .optional(),
        stock: z.number({
            error: "Jumlah stok harus berupa angka"
        }).int("Jumlah stok harus bilangan bulat")
            .nonnegative("Stok minimal bernilai 0")
            .optional(),
        categoryIds: z.array(
            z.number({
                error: "ID kategori harus berupa angka"
            }).int("ID kategori harus bilangan bulat")
                .positive("ID kategori tidak valid")
        ).optional()
    }).refine(
        (data) => {
            const { id, ...fields } = data;
            return Object.values(fields).some((v) => v !== undefined);
        },
        { message: "Minimal satu field harus diisi untuk update" }
    );
}