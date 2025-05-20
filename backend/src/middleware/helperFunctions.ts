import { StatusCodes } from "http-status-codes";

export const apiResponse = <T>(
    success: boolean,
    data?: T,
    error?: { message: string, statusCode: number }
) => ({
    success,
    data,
    error
}
)

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

import type { Request, Response } from "express";

export const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => {
    return (req: Request, res: Response) => {
        Promise.resolve(fn(req, res)).catch((error) => {
            console.log({ error });
            const statusCode: number = error instanceof ApiError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json(
                apiResponse(false, undefined, {
                    message: error.message || "Internal server error",
                    statusCode
                })
            );
        });
    };
}