import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { BorrowingController } from "../controllers/borrowing-controller";

export const privateRouter = express.Router();

// Middleware Autentikasi (Agar harus login dulu)
privateRouter.use(authMiddleware);

// Route Borrowing (Buatanmu)
privateRouter.post("/borrowings", BorrowingController.create);
privateRouter.patch("/borrowings/:loanId/return", BorrowingController.returnBook);