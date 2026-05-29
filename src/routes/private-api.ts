import express from "express"
import { authMiddleware } from "../middlewares/auth-middleware"
import { BookController } from "../controllers/book-controller"

export const privateRouter = express.Router()

privateRouter.use(authMiddleware)
privateRouter.post("/books", BookController.create)
privateRouter.put("/books/:bookId", BookController.update)
privateRouter.delete("/books/:bookId", BookController.delete)
privateRouter.get("/books/:bookId", BookController.get)