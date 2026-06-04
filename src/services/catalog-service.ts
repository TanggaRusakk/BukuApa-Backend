import { prismaClient } from "../utils/database-util";
import { BookResponse, toBookResponse } from "../models/book-model";
import { Validation } from "../validations/validation";
import { CatalogValidation } from "../validations/catalog-validation";

export class CatalogService {
  static async search(request: { title?: string; author?: string }): Promise<BookResponse[]> {
    const validatedRequest = Validation.validate(CatalogValidation.SEARCH, request);

    const books = await prismaClient.book.findMany({
      where: {
        title: validatedRequest.title ? { contains: validatedRequest.title, mode: "insensitive" } : undefined,
        author: validatedRequest.author ? { contains: validatedRequest.author, mode: "insensitive" } : undefined,
      },
      include: { categories: true }
    });
    
    return books.map(toBookResponse);
  }
}