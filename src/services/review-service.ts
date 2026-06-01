import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../errors/response-error";
import { ReviewValidation } from "../validations/review-validation";
import { Validation } from "../validations/validation";
import {
    CreateReviewRequest,
    UpdateReviewRequest,
    ReviewResponse,
    ReviewListResponse,
    toReviewResponse,
    toReviewListResponse
} from "../models/review-model";
import { BorrowStatus } from "../generated/prisma/client";

export class ReviewService {
    /**
     * Membuat ulasan baru untuk buku
     * - Verifikasi: Member harus pernah meminjam & mengembalikan buku tersebut
     * - Validasi: Rating 1-5, comment tidak kosong
     */
    static async create(userId: number, request: CreateReviewRequest): Promise<ReviewResponse> {
        const validatedRequest = Validation.validate(ReviewValidation.CREATE, request);

        // UC-05: Verifikasi riwayat peminjaman (harus sudah RETURNED)
        const hasBorrowed = await prismaClient.borrowing.findFirst({
        where: {
            userId,
            bookId: validatedRequest.bookId,
            status: BorrowStatus.RETURNED,
            returnDate: { not: null }
        }
        });

        if (!hasBorrowed) {
        throw new ResponseError(403, "Anda harus membaca buku ini terlebih dahulu untuk memberikan ulasan");
        }

        // Cek apakah user sudah pernah review buku ini
        const existingReview = await prismaClient.review.findFirst({
        where: {
            userId,
            bookId: validatedRequest.bookId
        }
        });

        if (existingReview) {
        throw new ResponseError(409, "Anda sudah memberikan ulasan untuk buku ini");
        }

        const review = await prismaClient.review.create({
        data: {
            userId,
            bookId: validatedRequest.bookId,
            rating: validatedRequest.rating,
            comment: validatedRequest.comment.trim()
        },
        include: {
            user: {
            select: { id: true, name: true }
            }
        }
        });

        return toReviewResponse(review);
    }

    /**
     * Memperbarui ulasan milik sendiri
     * - RBAC: Hanya owner yang bisa update
     */
    static async update(userId: number, reviewId: number, request: UpdateReviewRequest): Promise<ReviewResponse> {
        const validatedRequest = Validation.validate(ReviewValidation.UPDATE, request);

        const existingReview = await prismaClient.review.findUnique({
        where: { id: reviewId }
        });

        if (!existingReview) {
        throw new ResponseError(404, "Ulasan tidak ditemukan");
        }

        // RBAC: Hanya pemilik ulasan yang bisa memodifikasi
        if (existingReview.userId !== userId) {
        throw new ResponseError(403, "Unauthorized: Anda hanya dapat memodifikasi ulasan milik sendiri");
        }

        // Build update data (hanya field yang ada)
        const updateData: Partial<CreateReviewRequest> = {};
        if (validatedRequest.rating !== undefined) updateData.rating = validatedRequest.rating;
        if (validatedRequest.comment !== undefined) updateData.comment = validatedRequest.comment.trim();

        const updatedReview = await prismaClient.review.update({
        where: { id: reviewId },
        data: updateData,
        include: {
            user: {
            select: { id: true, name: true }
            }
        }
        });

        return toReviewResponse(updatedReview);
    }

    /**
     * Menghapus ulasan milik sendiri
     * - RBAC: Hanya owner yang bisa delete
     */
    static async delete(userId: number, reviewId: number): Promise<{ message: string }> {
        const existingReview = await prismaClient.review.findUnique({
        where: { id: reviewId }
        });

        if (!existingReview) {
        throw new ResponseError(404, "Ulasan tidak ditemukan");
        }

        // RBAC: Hanya pemilik ulasan yang bisa menghapus
        if (existingReview.userId !== userId) {
        throw new ResponseError(403, "Unauthorized: Anda hanya dapat menghapus ulasan milik sendiri");
        }

        await prismaClient.review.delete({
        where: { id: reviewId }
        });

        return { message: "Ulasan berhasil dihapus" };
    }

    /**
     * Mendapatkan daftar ulasan untuk sebuah buku dengan pagination
     */
    static async getByBookId(
        bookId: number,
        page: number = 1,
        limit: number = 20
    ): Promise<ReviewListResponse> {
        const skip = (page - 1) * limit;
        const cappedLimit = Math.min(limit, 100); // Maksimal 100 per page

        const [reviews, total, ratingStats] = await Promise.all([
        prismaClient.review.findMany({
            where: { bookId },
            include: {
            user: {
                select: { id: true, name: true }
            }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: cappedLimit
        }),
        prismaClient.review.count({
            where: { bookId }
        }),
        prismaClient.review.aggregate({
            _avg: { rating: true },
            where: { bookId }
        })
        ]);

        return toReviewListResponse(
        reviews,
        total,
        ratingStats._avg.rating ?? null,
        page,
        cappedLimit
        );
    }

    /**
     * Helper: Mengecek apakah user memiliki hak akses untuk me-review buku
     */
    static async canUserReview(userId: number, bookId: number): Promise<boolean> {
        const hasBorrowed = await prismaClient.borrowing.findFirst({
        where: {
            userId,
            bookId,
            status: BorrowStatus.RETURNED,
            returnDate: { not: null }
        }
        });

        const alreadyReviewed = await prismaClient.review.findFirst({
        where: {
            userId,
            bookId
        }
        });

        return !!hasBorrowed && !alreadyReviewed;
    }
}