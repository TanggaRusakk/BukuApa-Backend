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

  static async list(user: any): Promise<BorrowingResponse[]> {
    const queryFilter = user.role === "STAFF" ? {} : { userId: user.id };

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