import jwt from "jsonwebtoken";
import { Types } from "mongoose";


interface UserPayload {
    _id: Types.ObjectId;
    role: string;
}

export const generateRefreshToken = (user: UserPayload): string => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: "20d",
        }
    );
};