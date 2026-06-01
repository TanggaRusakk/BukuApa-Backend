import { Request, Response, NextFunction } from "express";
import { UserRequest } from "../models/user-request-model";
import { ReviewService } from "../services/review-service";
import { CreateReviewRequest, UpdateReviewRequest } from "../models/review-model";

export class ReviewController {
    /**
   * GET /api/books/:bookId/reviews
   * Public endpoint - semua user bisa melihat ulasan
    */
    static async getReviews(req: Request, res: Response, next: NextFunction) {
        try {
        const bookId = Number(req.params.bookId);
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await ReviewService.getByBookId(bookId, page, limit);

        res.status(200).json({ data: result });
        } catch (e) {
        next(e);
        }
    }

    /**
     * POST /api/reviews
     * Protected: Member only - membuat ulasan baru
     */
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("User ID not found in request");
        }

        const request: CreateReviewRequest = req.body;
        const result = await ReviewService.create(userId, request);

        res.status(201).json({ data: result });
        } catch (e) {
        next(e);
        }
    }

    /**
     * PUT /api/reviews/:reviewId
     * Protected: Owner only - memperbarui ulasan
     */
    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("User ID not found in request");
        }

        const reviewId = Number(req.params.reviewId);
        const request: UpdateReviewRequest = req.body;

        const result = await ReviewService.update(userId, reviewId, request);

        res.status(200).json({ data: result });
        } catch (e) {
        next(e);
        }
    }

    /**
     * DELETE /api/reviews/:reviewId
     * Protected: Owner only - menghapus ulasan
     */
    static async delete(req: UserRequest, res: Response, next: NextFunction) {
        try {
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("User ID not found in request");
        }

        const reviewId = Number(req.params.reviewId);
        const result = await ReviewService.delete(userId, reviewId);

        res.status(200).json({ data: result });
        } catch (e) {
        next(e);
        }
    }

    /**
     * GET /api/books/:bookId/can-review
     * Protected: Cek eligibility user untuk me-review buku
     */
    static async canReview(req: UserRequest, res: Response, next: NextFunction) {
        try {
        const userId = req.user?.id;
        const bookId = Number(req.params.bookId);

        if (!userId) {
            throw new Error("User ID not found in request");
        }

        const canReview = await ReviewService.canUserReview(userId, bookId);

        res.status(200).json({ data: { canReview } });
        } catch (e) {
        next(e);
        }
    }
}