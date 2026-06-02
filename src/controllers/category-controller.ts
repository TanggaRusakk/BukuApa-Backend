import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category-service";

export class CategoryController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await CategoryService.getAll();
            res.status(200).json({ data: result });
        } catch (e) {
            next(e);
        }
    }
}
