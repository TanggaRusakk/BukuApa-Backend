import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { BorrowingController } from "../controllers/borrowing-controller";
import { BookController } from "../controllers/book-controller";

export const privateRouter = express.Router();

// Middleware Autentikasi (Agar harus login dulu)
privateRouter.use(authMiddleware);

// Route Borrowing (JC)
privateRouter.post("/borrowings", BorrowingController.create);
privateRouter.patch("/borrowings/:loanId/return", BorrowingController.returnBook);

// Route Books (Angga)
privateRouter.post("/books", BookController.create);
privateRouter.put("/books/:bookId", BookController.update);
privateRouter.delete("/books/:bookId", BookController.delete);
privateRouter.get("/books/:bookId", BookController.get);