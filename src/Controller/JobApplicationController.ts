import path from "path";
import { Request, Response, NextFunction } from "express";
import wrapAsync from "../Utils/wrapAsync";
import { ApiError } from "../Utils/errorHandler";
import { ApiResponse } from "../Utils/responseHandler";
import { JobApplication } from "../Models/JobApplicationModel";
import { transporter } from "../Utils/mailTransporter";

export const applyJob = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const {
            jobTitle,
            fullName,
            email,
            phoneNumber,
            coverNote,
        } = req.body;

        if (
            !jobTitle ||
            !fullName ||
            !email ||
            !phoneNumber ||
            !coverNote
        ) {
            return next(
                new ApiError(
                    400,
                    "All fields are required"
                )
            );
        }

        if (!req.file) {
            return next(
                new ApiError(
                    400,
                    "Resume is required"
                )
            );
        }

        const resumeUrl = req.file.path;

        // Save Application
        const application =
            await JobApplication.create({
                jobTitle,
                fullName,
                email,
                phoneNumber,
                resumeUrl,
                coverNote,
            });

        // Return response immediately
        res.status(201).json(
            new ApiResponse(
                201,
                application,
                "Application submitted successfully"
            )
        );

        // Background Email Processing
        setImmediate(async () => {
            try {
                await Promise.all([
                    // HR Mail
                    transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: process.env.HR_EMAIL,
                        subject: `New Job Application - ${jobTitle}`,
                        html: `
                            <h2>New Job Application</h2>

                            <p>
                                <b>Job Title:</b>
                                ${jobTitle}
                            </p>

                            <p>
                                <b>Candidate Name:</b>
                                ${fullName}
                            </p>

                            <p>
                                <b>Email:</b>
                                ${email}
                            </p>

                            <p>
                                <b>Phone:</b>
                                ${phoneNumber}
                            </p>

                            <h3>Cover Note</h3>

                            <p>
                                ${coverNote}
                            </p>
                        `,
                        attachments: [
                            {
                                filename:
                                    path.basename(
                                        req.file!.path
                                    ),
                                path: req.file!.path,
                            },
                        ],
                    }),

                    // Candidate Mail
                    transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject:
                            "Application Submitted Successfully",
                        html: `
                            <div style="font-family: Arial, sans-serif;">
                                <h2>
                                    Thank You For Applying
                                </h2>

                                <p>
                                    Dear ${fullName},
                                </p>

                                <p>
                                    We have successfully received
                                    your application for the
                                    position of
                                    <strong>
                                        ${jobTitle}
                                    </strong>.
                                </p>

                                <p>
                                    Our recruitment team will
                                    review your profile and
                                    contact you if your profile
                                    matches our requirements.
                                </p>

                                <br />

                                <p>
                                    <strong>
                                        Application ID:
                                    </strong>
                                    ${application._id}
                                </p>

                                <p>
                                    <strong>
                                        Applied On:
                                    </strong>
                                    ${new Date().toLocaleDateString()}
                                </p>

                                <br />

                                <p>
                                    Thank you for your interest
                                    in our company.
                                </p>

                                <p>
                                    Regards,
                                    <br />
                                    HR Team
                                </p>
                            </div>
                        `,
                    }),
                ]);

                console.log(
                    "Application emails sent successfully"
                );
            } catch (error) {
                console.error(
                    "Email sending failed:",
                    error
                );
            }
        });
    }
);

export const getAllApplications =
    wrapAsync(
        async (
            req: Request,
            res: Response
        ) => {
            const applications =
                await JobApplication.find().sort({
                    createdAt: -1,
                });

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        applications,
                        "Applications fetched successfully"
                    )
                );
        }
    );


export const getApplicationById =
    wrapAsync(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            const application =
                await JobApplication.findById(
                    req.params.id
                );

            if (!application) {
                return next(
                    new ApiError(
                        404,
                        "Application not found"
                    )
                );
            }

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        application,
                        "Application fetched successfully"
                    )
                );
        }
    );