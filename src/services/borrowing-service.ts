import { prismaClient } from "../utils/database-util";
import { ResponseError } from "../errors/response-error";

export class BorrowingService {
  static async create(user: any, request: { bookId: number }) {
    // 1. Cek ketersediaan buku
    const book = await prismaClient.book.findUnique({ where: { id: request.bookId } });
    if (!book) throw new ResponseError(404, "Book not found");
    if (book.stock <= 0) throw new ResponseError(400, "Book is out of stock");

    // 2. Set tanggal tenggat waktu (7 hari dari sekarang)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // 3. Proses peminjaman (mengurangi stok dan mencatat transaksi)
    const result = await prismaClient.$transaction(async (prisma: any) => {
      const borrowing = await prisma.borrowing.create({
        data: {
          userId: user.id, // Ambil ID user dari token login
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

    return result;
  }

  static async returnBook(user: any, loanId: number) {
    // 1. Cek data peminjaman
    const borrowing = await prismaClient.borrowing.findFirst({
      where: { id: loanId, userId: user.id },
    });

    if (!borrowing) throw new ResponseError(404, "Borrowing record not found");
    if (borrowing.status !== "BORROWED") throw new ResponseError(400, "Book has already been returned or overdue");

    // 2. Proses pengembalian (menambah stok dan ubah status)
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

    return result;
  }
}