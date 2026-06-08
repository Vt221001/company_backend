import { Contact } from "../Models/ContactModel";
import { ApiError } from "../Utils/errorHandler";
import { transporter } from "../Utils/mailTransporter";
import { ApiResponse } from "../Utils/responseHandler";
import { Request, Response, NextFunction } from "express";
import wrapAsync from "../Utils/wrapAsync";

export const createContact =
    wrapAsync(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            const {
                fullName,
                email,
                phoneNumber,
                message,
            } = req.body;

            if (
                !fullName ||
                !email ||
                !phoneNumber ||
                !message
            ) {
                return next(
                    new ApiError(
                        400,
                        "All fields are required"
                    )
                );
            }

            const contact =
                await Contact.create({
                    fullName,
                    email,
                    phoneNumber,
                    message,
                });

            // Instant response
            res.status(201).json(
                new ApiResponse(
                    201,
                    contact,
                    "Message sent successfully"
                )
            );

            // Background mails
            setImmediate(
                async () => {
                    try {
                        console.log(
                            "HR_EMAIL =>",
                            process.env.HR_EMAIL
                        );

                        console.log(
                            "Candidate Email =>",
                            email
                        );
                        await Promise.all([
                            transporter.sendMail(
                                {
                                    from: process.env.EMAIL_USER,
                                    to: process.env.HR_EMAIL,
                                    subject:
                                        "New Contact Form Submission",
                                    html: `
                                <h2>New Contact Request</h2>

                                <p>
                                    <b>Name:</b>
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

                                <p>
                                    <b>Message:</b>
                                </p>

                                <p>
                                    ${message}
                                </p>
                            `,
                                }
                            ),

                            transporter.sendMail(
                                {
                                    from: process.env.EMAIL_USER,
                                    to: email,
                                    subject:
                                        "We've Received Your Message",
                                    html: `
                                <h2>
                                    Thank You
                                </h2>

                                <p>
                                    Dear ${fullName},
                                </p>

                                <p>
                                    We have received your message.
                                    Our team will get back to you shortly.
                                </p>

                                <p>
                                    Thank you for contacting us.
                                </p>

                                <p>
                                    Regards,
                                    <br/>
                                    Team
                                </p>
                            `,
                                }
                            ),
                        ]);
                    } catch (
                    error
                    ) {
                        console.error(
                            error
                        );
                    }
                }
            );
        }
    );



export const getAllContacts =
    wrapAsync(
        async (
            req: Request,
            res: Response
        ) => {
            const contacts =
                await Contact.find().sort({
                    createdAt: -1,
                });

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        contacts,
                        "Contacts fetched successfully"
                    )
                );
        }
    );

export const getContactById =
    wrapAsync(
        async (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            const contact =
                await Contact.findById(
                    req.params.id
                );

            if (!contact) {
                return next(
                    new ApiError(
                        404,
                        "Contact not found"
                    )
                );
            }

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        contact,
                        "Contact fetched successfully"
                    )
                );
        }
    );