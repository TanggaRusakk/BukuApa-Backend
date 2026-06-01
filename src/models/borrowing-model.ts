import { Borrowing } from "../generated/prisma/client";

export type CreateBorrowingRequest = {
    bookId: number;
}

export type BorrowingResponse = {
    id: number;
    userId: number;
    bookId: number;
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export function toBorrowingResponse(borrowing: Borrowing): BorrowingResponse {
    return {
        id: borrowing.id,
        userId: borrowing.userId,
        bookId: borrowing.bookId,
        borrowDate: borrowing.borrowDate,
        dueDate: borrowing.dueDate,
        returnDate: borrowing.returnDate,
        status: borrowing.status,
        createdAt: borrowing.createdAt,
        updatedAt: borrowing.updatedAt,
    }
}