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

        const book = await prismaClient.book.create({
            data: bookRequest
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

        const updatedBook = await prismaClient.book.update({
            where: { id: bookRequest.id },
            data: bookRequest
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

        // FIX: Hapus manual secara berurutan (PENGGANTI ON DELETE CASCADE di Schema Prisma)
        // Kita pakai $transaction biar kalau ada gagal di tengah jalan, datanya ke-rollback aman
        await prismaClient.$transaction(async (prisma: any) => {
            // 1. Bersihin data peminjaman yang nyangkut sama buku ini
            await prisma.borrowing.deleteMany({ 
                where: { bookId: bookId } 
            });
            
            // 2. Bersihin data review yang nyangkut sama buku ini
            await prisma.review.deleteMany({ 
                where: { bookId: bookId } 
            });
            
            // 3. Eksekusi mati bukunya dengan tenang
            await prisma.book.delete({ 
                where: { id: bookId } 
            });
        });

        return { message: "Buku berhasil dihapus dari katalog" };
    }

    //Mengambil detail informasi lengkap satu buku tertentu.
    static async get(bookId: number): Promise<BookResponse> {
        const book = await prismaClient.book.findUnique({
            where: { id: bookId }
        });

        if (!book) {
            throw new ResponseError(404, "Buku tidak ditemukan");
        }

        return toBookResponse(book);
    }
}