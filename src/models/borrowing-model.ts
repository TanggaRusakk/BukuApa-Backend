import { Borrowing } from "../generated/prisma/client";

export type CreateBorrowingRequest = {
    bookId: number;
    userId?: number;
}

export type BorrowingResponse = {
    id: number;
    userId: number;
    bookId: number;
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date | null;
    status: string;
    extensionCount: number; // <--- Tetap ada biar Android gak error
    createdAt: Date;
    updatedAt: Date;
    book?: any;
    user?: any;
}

export function toBorrowingResponse(borrowing: any): BorrowingResponse {
    // AKAL-AKALAN: Hitung selisih hari buat nentuin extensionCount tanpa ubah Database
    const bDate = new Date(borrowing.borrowDate);
    const dDate = new Date(borrowing.dueDate);
    const diffDays = Math.round(Math.abs(dDate.getTime() - bDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let extCount = 0;
    if (diffDays >= 20) extCount = 2;      // 21 hari = 2x perpanjang
    else if (diffDays >= 13) extCount = 1; // 14 hari = 1x perpanjang

    return {
        id: borrowing.id,
        userId: borrowing.userId,
        bookId: borrowing.bookId,
        borrowDate: borrowing.borrowDate,
        dueDate: borrowing.dueDate,
        returnDate: borrowing.returnDate,
        status: borrowing.status,
        extensionCount: extCount, 
        createdAt: borrowing.createdAt,
        updatedAt: borrowing.updatedAt,
        book: borrowing.book,
        user: borrowing.user
    }
}