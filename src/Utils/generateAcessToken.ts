import jwt from "jsonwebtoken";
import { Types } from "mongoose";



interface UserPayload {
    _id: Types.ObjectId;
    role: string;
}

export const generateAccessToken = (user: UserPayload): string => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: "7d",
        }
    );
};