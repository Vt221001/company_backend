import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface CustomJwtPayload extends JwtPayload {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: CustomJwtPayload;
        }
    }
}

const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({
            message: "Auth token not found!",
        });
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err, user) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized",
                });
            }

            req.user = user as CustomJwtPayload;
            next();
        }
    );
};

export { authenticateToken };