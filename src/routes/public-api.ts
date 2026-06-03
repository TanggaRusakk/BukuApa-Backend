import express from "express";
import { UserController } from "../controllers/user-controller";
import { CatalogController } from "../controllers/catalog-controller";
import { CategoryController } from "../controllers/category-controller";
import { ReviewController } from "../controllers/review-controller";

export const publicRouter = express.Router();

// Route Auth (Angga)
publicRouter.post("/register", UserController.register);
publicRouter.post("/login", UserController.login);

// Route Catalog (JC)
publicRouter.get("/books", CatalogController.search);

// Route Category (Angga)
publicRouter.get("/categories", CategoryController.getAll);

// Route Review (Jeferey)
publicRouter.get("/books/:bookId/reviews", ReviewController.getReviews);