import { Book, Category } from "../generated/prisma/client";

export type CreateBookRequest = {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publishedYear: number;
    totalPages: number;
    stock: number;
    categoryIds?: number[];
}

export type UpdateBookRequest = {
    id: number;
    isbn?: string;
    title?: string;
    author?: string;
    publisher?: string;
    publishedYear?: number;
    totalPages?: number;
    stock?: number;
    categoryIds?: number[];
}

export type CategoryResponse = {
    id: number;
    name: string;
    description: string | null;
}

export type BookResponse = {
    id: number;
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publishedYear: number;
    totalPages: number;
    stock: number;
    categories: CategoryResponse[];
    createdAt: Date;
    updatedAt: Date;
}

export type BookWithCategories = Book & {
    categories: Category[];
}

export function toBookResponse(book: BookWithCategories): BookResponse {
    return {
        id: book.id,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publishedYear: book.publishedYear,
        totalPages: book.totalPages,
        stock: book.stock,
        categories: book.categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
        })),
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
    };
}