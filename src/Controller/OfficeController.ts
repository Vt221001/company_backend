import { Request, Response, NextFunction } from "express";

import { Office } from "../Models/OfficeModel";

import wrapAsync from "../Utils/wrapAsync";
import { ApiError } from "../Utils/errorHandler";
import { ApiResponse } from "../Utils/responseHandler";

// Create Office
export const createOffice = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const {
            country,
            officeType,
            address,
            phone,
            email,
            mapUrl
        } = req.body;

        if (
            !country ||
            !address
        ) {
            return next(
                new ApiError(
                    400,
                    "All required fields are required"
                )
            );
        }

        const office = await Office.create({
            country,
            officeType,
            address,
            phone,
            email,
            mapUrl
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                office,
                "Office created successfully"
            )
        );
    }
);

// Get All Offices
export const getAllOffices = wrapAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const offices = await Office.find().sort({
            createdAt: -1,
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                offices,
                "Offices fetched successfully"
            )
        );
    }
);

// Get Office By Id
export const getOfficeById = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const office = await Office.findById(
            req.params.id
        );

        if (!office) {
            return next(
                new ApiError(
                    404,
                    "Office not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                office,
                "Office fetched successfully"
            )
        );
    }
);

// Update Office
export const updateOffice = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const office =
            await Office.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!office) {
            return next(
                new ApiError(
                    404,
                    "Office not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                office,
                "Office updated successfully"
            )
        );
    }
);

// Delete Office
export const deleteOffice = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const office =
            await Office.findByIdAndDelete(
                req.params.id
            );

        if (!office) {
            return next(
                new ApiError(
                    404,
                    "Office not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Office deleted successfully"
            )
        );
    }
);