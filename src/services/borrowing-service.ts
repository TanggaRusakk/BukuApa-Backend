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

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const result = await prismaClient.$transaction(async (prisma: any) => {
      const borrowing = await prisma.borrowing.create({
        data: {
          userId: user.id,
          bookId: book.id,
          dueDate: dueDate,
          status: "BORROWED",
        },
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
    const borrowing = await prismaClient.borrowing.findFirst({
      where: { id: loanId, userId: user.id },
    });

    if (!borrowing) throw new ResponseError(404, "Borrowing record not found");
    if (borrowing.status !== "BORROWED") throw new ResponseError(400, "Book has already been returned or overdue");

    const result = await prismaClient.$transaction(async (prisma: any) => {
      const updatedBorrowing = await prisma.borrowing.update({
        where: { id: loanId },
        data: {
          status: "RETURNED",
          returnDate: new Date(),
        },
      });

      await prisma.book.update({
        where: { id: borrowing.bookId },
        data: { stock: { increment: 1 } },
      });

      return updatedBorrowing;
    });

    return toBorrowingResponse(result);
  }
}