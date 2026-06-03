import { ResponseError } from "../errors/response-error";

export function validateIdParam(value: string | string[], fieldName: string = "ID"): number {
    const raw = Array.isArray(value) ? value[0] : value;
    const num = Number(raw);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
        throw new ResponseError(400, `${fieldName} harus berupa angka positif`);
    }
    return num;
}

export function validatePaginationQuery(
    page?: string,
    limit?: string
): { page: number; limit: number } {
    let parsedPage = 1;
    let parsedLimit = 20;

    if (page !== undefined) {
        parsedPage = Number(page);
        if (isNaN(parsedPage) || !Number.isInteger(parsedPage) || parsedPage < 1) {
            throw new ResponseError(400, "Parameter 'page' harus berupa angka positif");
        }
    }

    if (limit !== undefined) {
        parsedLimit = Number(limit);
        if (isNaN(parsedLimit) || !Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
            throw new ResponseError(400, "Parameter 'limit' harus berupa angka antara 1-100");
        }
    }

    return { page: parsedPage, limit: parsedLimit };
}
