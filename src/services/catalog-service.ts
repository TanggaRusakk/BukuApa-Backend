import { prismaClient } from "../utils/database-util";
import { BookResponse, toBookResponse } from "../models/book-model";

export class CatalogService {
  static async search(request: { title?: string; author?: string }): Promise<BookResponse[]> {
    const books = await prismaClient.book.findMany({
      where: {
        title: request.title ? { contains: request.title, mode: "insensitive" } : undefined,
        author: request.author ? { contains: request.author, mode: "insensitive" } : undefined,
      },
    });
    
    return books.map(toBookResponse);
  }
}