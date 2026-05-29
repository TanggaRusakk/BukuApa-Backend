import { Request, Response, NextFunction } from "express";
import { BookService } from "../services/book-service";

export class BookController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await BookService.create(req.body);
            res.status(201).json({ data: result });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            // Konversi dari string ke number
            const bookId = Number(req.params.bookId); 
            const request = { ...req.body, id: bookId };
            const result = await BookService.update(request);
            res.status(200).json({ data: result });
        } catch (e) {
            next(e);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            // Konversi dari string ke number
            const bookId = Number(req.params.bookId);
            const result = await BookService.delete(bookId);
            res.status(200).json({ data: result });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            // Konversi dari string ke number
            const bookId = Number(req.params.bookId);
            const result = await BookService.get(bookId);
            res.status(200).json({ data: result });
        } catch (e) {
            next(e);
        }
    }
}