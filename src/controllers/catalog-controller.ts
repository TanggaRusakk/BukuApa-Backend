import { Request, Response, NextFunction } from "express";
import { CatalogService } from "../services/catalog-service";

export class CatalogController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const request = {
        title: req.query.title as string,
        author: req.query.author as string,
      };
      
      const result = await CatalogService.search(request);
      
      res.status(200).json({
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }
}