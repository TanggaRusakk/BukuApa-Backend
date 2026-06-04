import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../errors/response-error";
import { CreateBorrowingRequest, BorrowingResponse, toBorrowingResponse } from "../models/borrowing-model";
import { BorrowingValidation } from "../validations/borrowing-validation";

export class BorrowingService {
  static async create(user: any, request: CreateBorrowingRequest): Promise<BorrowingResponse> {
    const borrowRequest = BorrowingValidation.CREATE.parse(request);

    const book = await prismaClient.book.findUnique({ where: { id: borrowRequest.bookId } });
    if (!book) throw new ResponseError(404, "Book not found");
    if (book.stock <= 0) throw new ResponseError(400, "Book is out of stock");

    const targetUserId = (user.role === "STAFF" && borrowRequest.userId) ? borrowRequest.userId : user.id;

    const targetUser = await prismaClient.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) throw new ResponseError(404, "User not found");

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const result = await prismaClient.$transaction(async (prisma: any) => {
      const borrowing = await prisma.borrowing.create({
        data: {
          userId: targetUserId,
          bookId: book.id,
          dueDate: dueDate,
          status: "BORROWED",
        },
        include: {
          book: true,
          user: true
        }
      });

      await prisma.book.update({
        where: { id: book.id },
        data: { stock: { decrement: 1 } },
      });

      return borrowing;
    });

    return toBorrowingResponse(result);
  }

  static async returnBook(user: any, loanId: number): Promise<BorrowingResponse> {
    const queryFilter = user.role === "STAFF" ? { id: loanId } : { id: loanId, userId: user.id };

    const borrowing = await prismaClient.borrowing.findFirst({
      where: queryFilter,
      include: { book: true, user: true }
    });

    if (!borrowing) throw new ResponseError(404, "Borrowing record not found or access denied");
    if (borrowing.status !== "BORROWED") throw new ResponseError(400, "Book has already been returned or overdue");

    const result = await prismaClient.$transaction(async (prisma: any) => {
      const updatedBorrowing = await prisma.borrowing.update({
        where: { id: loanId },
        data: {
          status: "RETURNED",
          returnDate: new Date(),
        },
        include: { book: true, user: true }
      });

      await prisma.book.update({
        where: { id: borrowing.bookId },
        data: { stock: { increment: 1 } },
      });

      return updatedBorrowing;
    });

    return toBorrowingResponse(result);
  }

  static async extend(user: any, loanId: number): Promise<BorrowingResponse> {
    const queryFilter = user.role === "STAFF" ? { id: loanId } : { id: loanId, userId: user.id };

    const borrowing = await prismaClient.borrowing.findFirst({
      where: queryFilter,
      include: { book: true, user: true }
    });

    if (!borrowing) throw new ResponseError(404, "Data peminjaman tidak ditemukan");
    if (borrowing.status !== "BORROWED") throw new ResponseError(400, "Buku sudah dikembalikan atau terlambat");

    // Hitung jatah perpanjangan dari selisih tanggal
    const bDate = new Date(borrowing.borrowDate);
    const currDueDate = new Date(borrowing.dueDate);
    const diffDays = Math.round(Math.abs(currDueDate.getTime() - bDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let extCount = 0;
    if (diffDays >= 20) extCount = 2;
    else if (diffDays >= 13) extCount = 1;

    if (extCount >= 2) throw new ResponseError(400, "Jatah perpanjangan maksimal 2 kali sudah habis");

    // Tambah 7 hari
    const newDueDate = new Date(borrowing.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 7);

    const result = await prismaClient.borrowing.update({
      where: { id: loanId },
      data: { dueDate: newDueDate },
      include: { book: true, user: true }
    });

    return toBorrowingResponse(result);
  }
  
  static async list(user: any): Promise<BorrowingResponse[]> {
    // Memaksa konversi ke Number buat jaga-jaga kalau token JWT ngirimnya String
    const authUserId = Number(user.id || user.userId);
    
    // Filter: Staff liat semua, User cuma liat ID-nya sendiri
    const queryFilter = user.role === "STAFF" ? {} : { userId: authUserId };

    const borrowings = await prismaClient.borrowing.findMany({
      where: queryFilter,
      include: {
        book: true,
        user: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    return borrowings.map((borrowing: any) => toBorrowingResponse(borrowing));
  }
}