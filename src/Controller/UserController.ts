import jwt from "jsonwebtoken";
import wrapAsync from "../Utils/wrapAsync";
import { ApiError } from "../Utils/errorHandler";
import { ApiResponse } from "../Utils/responseHandler";
import { generateAccessToken } from "../Utils/generateAcessToken";
import { generateRefreshToken } from "../Utils/generateRefreshToken";
import { Request, Response, NextFunction } from "express";
import { User } from "../Models/UserModel";

const generateAccessAndRefreshTokens = async (
    userId: string
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

export const createUser = wrapAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return next(
                new ApiError(400, "All fields are required")
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(
                new ApiError(400, "User already exists")
            );
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    createdUser,
                    "User created successfully"
                )
            );
    }
);

export const loginUser = wrapAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(
                new ApiError(400, "Email and password are required")
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return next(
                new ApiError(404, "User not found")
            );
        }

        const isPasswordCorrect =
            await user.isValidPassword(password);

        if (!isPasswordCorrect) {
            return next(
                new ApiError(401, "Invalid credentials")
            );
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(
                user._id.toString()
            );

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
            })
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken,
                        refreshToken,
                    },
                    "User logged in successfully"
                )
            );
    }
);

export const refreshAccessTokenAdmin = wrapAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const incomingRefreshToken =
            req.cookies.refreshToken ||
            req.body.refreshToken;

        if (!incomingRefreshToken) {
            return next(
                new ApiError(401, "Unauthorized request")
            );
        }

        let decodedToken: any;

        try {
            decodedToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET as string
            );
        } catch (error) {
            return next(
                new ApiError(401, "Invalid refresh token")
            );
        }

        const user = await User.findById(decodedToken.id);

        if (!user) {
            return next(
                new ApiError(401, "Invalid refresh token")
            );
        }

        if (
            incomingRefreshToken !== user.refreshToken
        ) {
            return next(
                new ApiError(
                    401,
                    "Refresh token expired or already used"
                )
            );
        }

        const {
            accessToken,
            refreshToken: newRefreshToken,
        } = await generateAccessAndRefreshTokens(
            user._id.toString()
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
            })
            .cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
            })
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed successfully"
                )
            );
    }
);


const logoutUser = wrapAsync(
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const refreshToken =
            req.cookies.refreshToken;

        if (!refreshToken) {
            return next(
                new ApiError(
                    401,
                    "Unauthorized request"
                )
            );
        }

        const decodedToken = jwt.verify(
            refreshToken,
            process.env
                .REFRESH_TOKEN_SECRET as string
        ) as jwt.JwtPayload;

        const user = await User.findById(
            decodedToken.id
        );

        if (!user) {
            return next(
                new ApiError(
                    404,
                    "User not found"
                )
            );
        }

        user.refreshToken = "";

        await user.save({
            validateBeforeSave: false,
        });

        return res
            .status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Logout successful"
                )
            );
    }
);

export { logoutUser };