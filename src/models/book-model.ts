import { Book } from "../generated/prisma/client";

export type CreateBookRequest = {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publishedYear: number;
    totalPages: number;
    stock: number;
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
    createdAt: Date;
    updatedAt: Date;
}

export function toBookResponse(book: Book): BookResponse {
    return {
        id: book.id,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publishedYear: book.publishedYear,
        totalPages: book.totalPages,
        stock: book.stock,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt
    };
}