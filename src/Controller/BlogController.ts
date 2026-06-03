import { Request, Response, NextFunction } from "express";
import { Blog } from "../Models/BlogModel";
import wrapAsync from "../Utils/wrapAsync";
import { ApiError } from "../Utils/errorHandler";
import { ApiResponse } from "../Utils/responseHandler";
import fs from "fs";
import path from "path";

export const createBlog = wrapAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const {
            title,
            slug,
            excerpt,
            content,
            category,
            tags,
            readTime,
            status,
        } = req.body;

        const requiredFields = [
            "title",
            "slug",
            "excerpt",
            "content",
            "category",
        ];

        const missingFields = requiredFields.filter(
            (field) =>
                !req.body[field] ||
                req.body[field].trim() === ""
        );

        if (missingFields.length) {
            return next(
                new ApiError(
                    400,
                    `Missing required fields: ${missingFields.join(", ")}`
                )
            );
        }

        if (!req.file) {
            return next(
                new ApiError(
                    400,
                    "Cover image is required"
                )
            );
        }

        const existingBlog = await Blog.findOne({
            slug,
        });

        if (existingBlog) {
            return next(
                new ApiError(
                    400,
                    "Blog slug already exists"
                )
            );
        }

        const blog = await Blog.create({
            title,
            slug,
            excerpt,
            content,
            category,
            tags: tags
                ? JSON.parse(tags)
                : [],
            readTime: readTime || 1,
            status: status || "Draft",

            coverImage:
                "/uploads/blogs/" +
                req.file.filename,

            author: req.user?.id,

            publishedAt:
                status === "Published"
                    ? new Date()
                    : undefined,
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                blog,
                "Blog created successfully"
            )
        );
    }
);

export const getAllBlogs = wrapAsync(
    async (req: Request, res: Response) => {
        const blogs = await Blog.find()
            .populate(
                "author",
                "name email"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                blogs,
                "Blogs fetched successfully"
            )
        );
    }
);

export const getBlogById = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const blog =
            await Blog.findById(
                req.params.id
            ).populate(
                "author",
                "name email"
            );

        if (!blog) {
            return next(
                new ApiError(
                    404,
                    "Blog not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                blog,
                "Blog fetched successfully"
            )
        );
    }
);

export const updateBlog = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const blog = await Blog.findById(
            req.params.id
        );

        if (!blog) {
            return next(
                new ApiError(
                    404,
                    "Blog not found"
                )
            );
        }

        const updateData: any = {
            ...req.body,
        };

        if (req.file) {

            // Delete old image
            if (blog.coverImage) {

                const oldImagePath = path.join(
                    process.cwd(),
                    "public",
                    blog.coverImage
                );

                if (
                    fs.existsSync(oldImagePath)
                ) {
                    fs.unlinkSync(
                        oldImagePath
                    );
                }
            }

            // Save new image
            updateData.coverImage =
                "/uploads/blogs/" +
                req.file.filename;
        }

        const updatedBlog =
            await Blog.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    returnDocument:
                        "after",
                    runValidators:
                        true,
                }
            );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedBlog,
                    "Blog updated successfully"
                )
            );
    }
);

export const deleteBlog = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const blog = await Blog.findById(
            req.params.id
        );

        if (!blog) {
            return next(
                new ApiError(
                    404,
                    "Blog not found"
                )
            );
        }

        if (blog.coverImage) {
            const imagePath = path.join(
                process.cwd(),
                "public",
                blog.coverImage
            );

            if (
                fs.existsSync(imagePath)
            ) {
                fs.unlinkSync(
                    imagePath
                );
            }
        }

        await Blog.findByIdAndDelete(
            req.params.id
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Blog deleted successfully"
                )
            );
    }
);