import user from "../models/user.js";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
interface DecodedToken extends JwtPayload {
    id: string; 
}
export const authUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from cookie or Authorization header
        let token = req.cookies.token;
        
        // Check Authorization header if token not in cookies
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
        req.user = await user.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}