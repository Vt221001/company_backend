import { Request, Response, NextFunction } from "express";
import { ApiError } from "../Utils/errorHandler.js";

const authorizeRoles = (...allowedRoles: string[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new ApiError(403, "Access Denied"));
        }

        next();
    };
};

export { authorizeRoles };