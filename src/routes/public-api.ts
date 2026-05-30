import express from "express";
import { UserController } from "../controllers/user-controller"; 
import { CatalogController } from "../controllers/catalog-controller";
import { ReviewController } from '../controllers/review-controller';

export const publicRouter = express.Router();

// Route Auth (Buatan Angga)
publicRouter.post("/register", UserController.register); 
publicRouter.post("/login", UserController.login);

// Route Catalog (Buatanmu)
publicRouter.get("/books", CatalogController.search);

// Route Review (Buatanmu)
publicRouter.post("/books/:bookId/reviews", ReviewController.create);
publicRouter.get("/books/:bookId/reviews", ReviewController.getReviews);