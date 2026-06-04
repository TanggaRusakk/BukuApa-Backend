import { z } from "zod";

export class CatalogValidation {
    static readonly SEARCH = z.object({
        title: z.string().trim().max(255, "Parameter 'title' maksimal 255 karakter").optional(),
        author: z.string().trim().max(255, "Parameter 'author' maksimal 255 karakter").optional(),
    });
}
