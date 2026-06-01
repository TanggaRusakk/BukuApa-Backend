import { Request, Response, NextFunction } from "express";
import { BorrowingService } from "../services/borrowing-service";

export interface UserRequest extends Request {
  user?: any;
}

export class BorrowingController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request = {
        bookId: req.body.bookId,
      };
      const result = await BorrowingService.create(req.user, request);
      res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  }

  static async returnBook(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const loanId = parseInt(req.params.loanId as string);
      const result = await BorrowingService.returnBook(req.user, loanId);
      res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  }
}