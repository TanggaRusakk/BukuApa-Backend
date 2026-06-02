import { prismaClient } from "../utils/database-util";
import { CategoryResponse } from "../models/book-model";

export class CategoryService {
    // Mengambil seluruh daftar kategori buku yang tersedia.
    static async getAll(): Promise<CategoryResponse[]> {
        const categories = await prismaClient.category.findMany({
            orderBy: { name: "asc" }
        });

        return categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
        }));
    }
}
