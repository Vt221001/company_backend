import { Request, Response, NextFunction } from "express";
import wrapAsync from "../Utils/wrapAsync";
import { ApiError } from "../Utils/errorHandler";
import { ApiResponse } from "../Utils/responseHandler";
import { Job } from "../Models/JobModel";
import { validateRequiredFields } from "../Utils/validateRequiredFields";

export const createJob = wrapAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        const missingFields = validateRequiredFields(
            req.body,
            [
                "title",
                "department",
                "employmentType",
                "minExperience",
                "maxExperience",
                "locations",
                "aboutRole",
                "skills",
                "responsibilities",
                "requirements",
            ]
        );

        if (missingFields.length) {
            return next(
                new ApiError(
                    400,
                    `Missing required fields: ${missingFields.join(", ")}`
                )
            );
        }
        const job = await Job.create({
            ...req.body,
            createdBy: req.user?.id,
        });

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    job,
                    "Job created successfully"
                )
            );
    }
);

export const getAllJobs = wrapAsync(
    async (req: Request, res: Response) => {
        const jobs = await Job.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    jobs,
                    "Jobs fetched successfully"
                )
            );
    }
);

export const getJobById = wrapAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const job = await Job.findById(id).populate(
            "createdBy",
            "name email"
        );

        if (!job) {
            return next(
                new ApiError(404, "Job not found")
            );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    job,
                    "Job fetched successfully"
                )
            );
    }
);

export const updateJob = wrapAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const missingFields = validateRequiredFields(
            req.body,
            [
                "title",
                "department",
                "employmentType",
                "minExperience",
                "maxExperience",
                "locations",
                "aboutRole",
                "skills",
                "responsibilities",
                "requirements",
            ]
        );

        if (missingFields.length) {
            return next(
                new ApiError(
                    400,
                    `Missing required fields: ${missingFields.join(", ")}`
                )
            );
        }

        const job = await Job.findByIdAndUpdate(
            id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!job) {
            return next(
                new ApiError(404, "Job not found")
            );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    job,
                    "Job updated successfully"
                )
            );
    }
);

export const deleteJob = wrapAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const job = await Job.findByIdAndDelete(id);

        if (!job) {
            return next(
                new ApiError(404, "Job not found")
            );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Job deleted successfully"
                )
            );
    }
);