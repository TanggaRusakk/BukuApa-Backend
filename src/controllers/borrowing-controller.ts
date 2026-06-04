import { Response, NextFunction } from "express";
import { UserRequest } from "../models/user-request-model";
import { BorrowingService } from "../services/borrowing-service";

export class BorrowingController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request = req.body;
            const response = await BorrowingService.create(req.user!, request);
            
            // WAJIB dibungkus "data"
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async returnBook(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const loanId = Number(req.params.loanId);
            const response = await BorrowingService.returnBook(req.user!, loanId);
            
            // WAJIB dibungkus "data"
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async list(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await BorrowingService.list(req.user!);
            
            // WAJIB dibungkus "data"
            res.status(200).json({
                data: response 
            });
        } catch (e) {
            next(e);
        }
    }

    static async extend(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const loanId = Number(req.params.loanId);
            const response = await BorrowingService.extend(req.user!, loanId);
            
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }
}