import express from "express";
import { UserController } from "../controllers/user-controller"; 
import { CatalogController } from "../controllers/catalog-controller";

export const publicRouter = express.Router();

// Route Auth (Buatan Angga)
publicRouter.post("/register", UserController.register); 
publicRouter.post("/login", UserController.login);

// Route Catalog (Buatanmu)
publicRouter.get("/books", CatalogController.search);