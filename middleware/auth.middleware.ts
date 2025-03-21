import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

// Extend Request type to include `user`
interface AuthenticatedRequest extends Request {
    user?: any;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header("Authorization");

    if (!token || !JWT_SECRET) {
        res.status(401).json({ message: "Access Denied. No token provided or JWT Verification failed with an unexpected error." });
        return 
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
        return 
    }
};

export default authMiddleware;
