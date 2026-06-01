import express from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import { BorrowingController } from "../controllers/borrowing-controller";
import { BookController } from "../controllers/book-controller";
import { ReviewController } from "../controllers/review-controller";

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

// Route Review (Jeferey)
privateRouter.post("/books/:bookId/reviews", ReviewController.create);
privateRouter.get("/books/:bookId/reviews", ReviewController.getReviews);
privateRouter.get("/books/:bookId/can-review", ReviewController.canReview);
privateRouter.put("/reviews/:reviewId", ReviewController.update);
privateRouter.delete("/reviews/:reviewId", ReviewController.delete);