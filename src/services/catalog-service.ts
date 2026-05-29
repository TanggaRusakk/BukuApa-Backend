import { prismaClient } from "../utils/database-util";

export class CatalogService {
  static async search(request: { title?: string; author?: string }) {
    // Mencari buku berdasarkan judul atau penulis
    const books = await prismaClient.book.findMany({
      where: {
        title: request.title ? { contains: request.title, mode: "insensitive" } : undefined,
        author: request.author ? { contains: request.author, mode: "insensitive" } : undefined,
      },
    });
    return books;
  }
}