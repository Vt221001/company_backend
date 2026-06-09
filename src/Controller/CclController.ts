import { Request, Response, NextFunction } from "express";

import CmsPage from "../Models/CclModel";
import wrapAsync from "../Utils/wrapAsync";
import { ApiError } from "../Utils/errorHandler";
import { ApiResponse } from "../Utils/responseHandler";
import { deleteCmsPageImages } from "../Utils/deleteCmsPageImages";

// Create Cms Page
export const createCmsPage = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const {
            pageName,
            slug,
            icon,
            menuSubtitle,
            hero,
            sections,
        } = req.body;

        if (!pageName || !slug) {
            return next(
                new ApiError(
                    400,
                    "Page name and slug are required"
                )
            );
        }

        const existingPage =
            await CmsPage.findOne({ slug });

        if (existingPage) {
            return next(
                new ApiError(
                    400,
                    "Page with this slug already exists"
                )
            );
        }

        const page = await CmsPage.create({
            pageName,
            slug,
            icon,
            menuSubtitle,
            hero,
            sections,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                page,
                "CMS page created successfully"
            )
        );
    }
);

// Get All Pages
export const getAllCmsPages = wrapAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const pages = await CmsPage.find().sort({
            createdAt: -1,
        });
        
        return res.status(200).json(
            new ApiResponse(
                200,
                pages,
                "CMS pages fetched successfully"
            )
        );
    }
);

// Get Page By Id
export const getCmsPageById = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const page =
            await CmsPage.findById(
                req.params.id
            );

        if (!page) {
            return next(
                new ApiError(
                    404,
                    "CMS page not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                page,
                "CMS page fetched successfully"
            )
        );
    }
);

// Get Page By Slug
export const getCmsPageBySlug = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const page =
            await CmsPage.findOne({
                slug: req.params.slug,
            });

        if (!page) {
            return next(
                new ApiError(
                    404,
                    "CMS page not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                page,
                "CMS page fetched successfully"
            )
        );
    }
);

// Update Cms Page
export const updateCmsPage = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const page =
            await CmsPage.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!page) {
            return next(
                new ApiError(
                    404,
                    "CMS page not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                page,
                "CMS page updated successfully"
            )
        );
    }
);

// Delete Cms Page
export const deleteCmsPage = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        // const page =
        //     await CmsPage.findByIdAndDelete(
        //         req.params.id
        //     );

        // if (!page) {
        //     return next(
        //         new ApiError(
        //             404,
        //             "CMS page not found"
        //         )
        //     );
        // }

        const page =
            await CmsPage.findById(
                req.params.id
            );

        if (!page) {
            return next(
                new ApiError(
                    404,
                    "CMS page not found"
                )
            );
        }

        await deleteCmsPageImages(
            page
        );

        await CmsPage.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "CMS page deleted successfully"
            )
        );
    }
);




export const uploadCmsImage = wrapAsync(
    async (req, res) => {
        const file = req.file as any;

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    url: file.path,
                },
                "Image uploaded successfully"
            )
        );
    }
);