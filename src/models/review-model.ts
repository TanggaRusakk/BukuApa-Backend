import { Review, User } from "../generated/prisma/client";

export type CreateReviewRequest = {
    bookId: number;
    rating: number;
    comment: string;
};

export type UpdateReviewRequest = {
    rating?: number;
    comment?: string;
};

export type ReviewResponse = {
    id: number;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: number;
        name: string;
    };
};

export type ReviewListResponse = {
    reviews: ReviewResponse[];
    total: number;
    averageRating: number | null;
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
    };
};

export function toReviewResponse(review: Review & { user: Pick<User, "id" | "name"> }): ReviewResponse {
    return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        user: {
        id: review.user.id,
        name: review.user.name
        }
    };
}

export function toReviewListResponse(
    reviews: (Review & { user: Pick<User, "id" | "name"> })[],
    total: number,
    averageRating: number | null,
    page: number,
    limit: number
    ): ReviewListResponse {
    return {
        reviews: reviews.map(toReviewResponse),
        total,
        averageRating,
        pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
        }
    };
}