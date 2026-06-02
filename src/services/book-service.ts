import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../errors/response-error";
import { BookValidation } from "../validations/book-validation";
import { Validation } from "../validations/validation";
import { BookResponse, CreateBookRequest, UpdateBookRequest, toBookResponse } from "../models/book-model";

export class BookService {
    // Menambahkan data buku baru ke dalam sistem katalog perpustakaan.
    static async create(request: CreateBookRequest): Promise<BookResponse> {
        const bookRequest = Validation.validate(BookValidation.CREATE, request);

        const isbnExists = await prismaClient.book.findUnique({
            where: { isbn: bookRequest.isbn }
        });

        if (isbnExists) {
            throw new ResponseError(400, "Buku dengan ISBN ini sudah terdaftar");
        }

        // Validasi bahwa semua categoryIds yang dikirim memang ada di database
        if (bookRequest.categoryIds && bookRequest.categoryIds.length > 0) {
            const existingCategories = await prismaClient.category.findMany({
                where: { id: { in: bookRequest.categoryIds } },
                select: { id: true }
            });

            if (existingCategories.length !== bookRequest.categoryIds.length) {
                throw new ResponseError(400, "Satu atau lebih kategori tidak ditemukan");
            }
        }

        const { categoryIds, ...bookData } = bookRequest;

        const book = await prismaClient.book.create({
            data: {
                ...bookData,
                categories: categoryIds && categoryIds.length > 0
                    ? { connect: categoryIds.map(id => ({ id })) }
                    : undefined
            },
            include: { categories: true }
        });

        return toBookResponse(book);
    }

    // Memperbarui informasi buku yang sudah terdaftar berdasarkan ID.
    static async update(request: UpdateBookRequest): Promise<BookResponse> {
        const bookRequest = Validation.validate(BookValidation.UPDATE, request);

        const bookExists = await prismaClient.book.findUnique({
            where: { id: bookRequest.id }
        });

        if (!bookExists) {
            throw new ResponseError(404, "Buku tidak ditemukan");
        }

        // Validasi bahwa semua categoryIds yang dikirim memang ada di database
        if (bookRequest.categoryIds && bookRequest.categoryIds.length > 0) {
            const existingCategories = await prismaClient.category.findMany({
                where: { id: { in: bookRequest.categoryIds } },
                select: { id: true }
            });

            if (existingCategories.length !== bookRequest.categoryIds.length) {
                throw new ResponseError(400, "Satu atau lebih kategori tidak ditemukan");
            }
        }

        const { categoryIds, id, ...bookData } = bookRequest;

        const updatedBook = await prismaClient.book.update({
            where: { id },
            data: {
                ...bookData,
                // Menggunakan 'set' agar kategori lama di-replace dengan yang baru
                categories: categoryIds !== undefined
                    ? { set: categoryIds.map(catId => ({ id: catId })) }
                    : undefined
            },
            include: { categories: true }
        });

        return toBookResponse(updatedBook);
    }

    // Menghapus rekaman data buku secara permanen dari sistem inventaris.
    static async delete(bookId: number): Promise<{ message: string }> {
        const bookExists = await prismaClient.book.findUnique({
            where: { id: bookId }
        });

        if (!bookExists) {
            throw new ResponseError(404, "Buku tidak ditemukan");
        }

        await prismaClient.book.delete({
            where: { id: bookId }
        });

        return { message: "Buku berhasil dihapus dari katalog" };
    }

    //Mengambil detail informasi lengkap satu buku tertentu.
    static async get(bookId: number): Promise<BookResponse> {
        const book = await prismaClient.book.findUnique({
            where: { id: bookId },
            include: { categories: true }
        });

        if (!book) {
            throw new ResponseError(404, "Buku tidak ditemukan");
        }

        return toBookResponse(book);
    }
}